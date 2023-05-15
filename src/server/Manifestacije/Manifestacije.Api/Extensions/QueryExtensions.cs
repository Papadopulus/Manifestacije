﻿using System.Reflection;
using MongoDB.Driver;

namespace Manifestacije.Api.Extensions;

public static class QueryExtensions
{
    public static IFindFluent<TType, TType>? Paginate<TType>(this IFindFluent<TType, TType> query,
        QueryFilterBase filter)
    {
        return query.Skip((filter.PageNumber - 1) * filter.PageSize).Limit(filter.PageSize);
    }

    public static SortDefinition<TType> Sort<TType>(QueryFilterBase filter)
    {
        if (string.IsNullOrEmpty(filter.SortColumn))
        {
            return Builders<TType>.Sort.Descending("CreatedAtUtc");
        }

        return filter.SortDirection != "desc"
            ? Builders<TType>.Sort.Ascending(filter.SortColumn)
            : Builders<TType>.Sort.Descending(filter.SortColumn);
    }

    public static FilterDefinition<TType> Filter<TType, TSource>(this TSource query)
    {
        var props = query!
            .GetType()
            .GetProperties(BindingFlags.Public
                           | BindingFlags.Instance
                           | BindingFlags.DeclaredOnly);

        var propsWithoutMinMax = props
            .Where(x => !x.Name.AsSpan().StartsWith("Min")
                        && !x.Name.AsSpan().StartsWith("Max")
                        && !x.Name.AsSpan().EndsWith("List")
                        && !x.Name.AsSpan().EndsWith("Id"))
            .ToArray();

        var propsMin = props
            .Where(x => x.Name.AsSpan().StartsWith("Min"))
            .ToArray();
        var propsMax = props
            .Where(x => x.Name.AsSpan().StartsWith("Max"))
            .ToArray();

        var propsList = props
            .Where(x => x.Name.AsSpan().EndsWith("List"))
            .ToArray();

        var propsId = props
            .Where(x => x.Name.AsSpan().EndsWith("Id"))
            .ToArray();

        var intersection = query.GetType()
            .GetProperties()
            .First(x => x.Name.Contains("IntersectionColumns")).GetValue(query) as string;

        var union = query.GetType()
            .GetProperties()
            .First(x => x.Name.Contains("UnionColumns")).GetValue(query) as string;

        var intersectionColumns = intersection?.Split(',') ?? new string[] { };
        var unionColumns = union?.Split(',') ?? new string[] { };


        var showDeleted = query.GetType()
            .GetProperties()
            .First(x => x.Name.Contains("ShowDeleted")).GetValue(query) as bool? ?? false;

        FilterDefinition<TType>? filter = null;
        FilterDefinition<TType>? filterIntersection = null;
        FilterDefinition<TType>? filterUnion = null;

        foreach (var prop in propsMin)
        {
            var valueMin = prop.GetValue(query);
            var valueMax = propsMax.FirstOrDefault(x => x.Name[3..] == prop.Name[3..])?.GetValue(query);
            var name = prop.Name[3..];

            if (valueMin is null
                && valueMax is null)
            {
                continue;
            }

            FilterDefinition<TType>? filterMinMax = null;

            if (valueMin is not null)
            {
                filterMinMax = filterMinMax is null
                    ? Builders<TType>.Filter.Gte(name, valueMin)
                    : Builders<TType>.Filter.Gte(name, valueMin) & filterMinMax;
            }

            if (valueMax is not null)
            {
                filterMinMax = filterMinMax is null
                    ? Builders<TType>.Filter.Lte(name, valueMax)
                    : Builders<TType>.Filter.Lte(name, valueMax) & filterMinMax;
            }

            if (intersectionColumns.Contains(name))
            {
                filterIntersection = filterIntersection is null ? filterMinMax : filterIntersection & filterMinMax;
                continue;
            }

            if (unionColumns.Contains(name))
            {
                filterUnion = filterUnion is null ? filterMinMax : filterUnion | filterMinMax;
            }
        }

        foreach (var prop in propsWithoutMinMax)
        {
            var value = prop.GetValue(query);
            var name = prop.Name;

            if (value is null)
            {
                continue;
            }

            var property = typeof(TType).GetProperty(name,
                BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance)!;

            var filterProp = property.PropertyType == typeof(string)
                ? Builders<TType>.Filter.Regex(name, $"/{value}/i")
                : Builders<TType>.Filter.Eq(name, value.ToString());

            if (intersectionColumns.Contains(name))
            {
                filterIntersection = filterIntersection is null ? filterProp : filterIntersection & filterProp;
                continue;
            }

            if (unionColumns.Contains(name))
            {
                filterUnion = filterUnion is null ? filterProp : filterUnion | filterProp;
            }
        }

        foreach (var prop in propsList)
        {
            var value = prop.GetValue(query);
            var name = prop.Name;

            if (value is null)
            {
                continue;
            }

            var filterProp = Builders<TType>.Filter.AnyIn(name, $"/{value}/i");

            if (intersectionColumns.Contains(name))
            {
                filterIntersection = filterIntersection is null ? filterProp : filterIntersection & filterProp;
                continue;
            }

            if (unionColumns.Contains(name))
            {
                filterUnion = filterUnion is null ? filterProp : filterUnion | filterProp;
            }
        }

        foreach (var prop in propsId)
        {
            var value = prop.GetValue(query);
            var name = prop.Name;

            if (value is null)
            {
                continue;
            }

            var values = value.ToString()!.Split(',');

            FilterDefinition<TType>? filterProp = null;
            foreach (var id in values)
            {
                if (string.IsNullOrWhiteSpace(id))
                    continue;

                var currentFilter = Builders<TType>.Filter
                    .Eq(name[..^2] + ".Id", id);

                filterProp = filterProp is null ? currentFilter : filterProp | currentFilter;
            }

            if (intersectionColumns.Contains(name))
            {
                filterIntersection = filterIntersection is null ? filterProp : filterIntersection & filterProp;
                continue;
            }

            if (unionColumns.Contains(name))
            {
                filterUnion = filterUnion is null ? filterProp : filterUnion | filterProp;
            }
        }

        if (filterIntersection is null && filterUnion is null)
            filter = Builders<TType>.Filter.Empty;
        else if (filterIntersection is not null && filterUnion is null)
            filter = filterIntersection;
        else if (filterIntersection is null && filterUnion is not null)
            filter = filterUnion;
        else
            filter = filterIntersection & filterUnion;

        if (showDeleted)
        {
            return filter;
        }

        var deletedFilter = Builders<TType>.Filter.Eq("IsDeleted", false);
        filter &= deletedFilter;

        return filter;
    }
}