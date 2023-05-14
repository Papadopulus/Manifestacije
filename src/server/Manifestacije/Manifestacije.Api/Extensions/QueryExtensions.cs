using System.Reflection;
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

        var intersect = query.GetType()
            .GetProperties()
            .First(x => x.Name.Contains("Intersection")).GetValue(query) as bool? ?? false;

        var showDeleted = query.GetType()
            .GetProperties()
            .First(x => x.Name.Contains("ShowDeleted")).GetValue(query) as bool? ?? false;

        FilterDefinition<TType>? filter = null;

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

            var filterMinMax = Builders<TType>.Filter.Empty;

            if (valueMin is not null)
            {
                filterMinMax &= Builders<TType>.Filter.Gte(name, valueMin);
            }

            if (valueMax is not null)
            {
                filterMinMax &= Builders<TType>.Filter.Lte(name, valueMax);
            }

            filter = filter is null ? filterMinMax : intersect ? filter & filterMinMax : filter | filterMinMax;
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

            filter = filter is null ? filterProp : intersect ? filter & filterProp : filter | filterProp;
        }

        foreach (var prop in propsList)
        {
            var value = prop.GetValue(query);
            var name = prop.Name;

            if (value is null)
            {
                continue;
            }

            var filterProp = Builders<TType>.Filter.ElemMatch<string>(name, value.ToString());

            filter = filter is null ? filterProp : intersect ? filter & filterProp : filter | filterProp;
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
                if(id is null || string.IsNullOrWhiteSpace(id))
                    continue;
                
                var currentFilter = Builders<TType>.Filter
                    .Eq(name[..^2] + ".Id", value.ToString());

                filterProp = filterProp is not null ? filterProp | currentFilter : currentFilter;
            }

            filter = filter is null ? filterProp : intersect ? filter & filterProp : filter | filterProp;
        }

        if (showDeleted)
        {
            return filter ?? Builders<TType>.Filter.Empty;
        }

        var deletedFilter = Builders<TType>.Filter.Eq("IsDeleted", false);
        filter = filter is null ? deletedFilter : filter & deletedFilter;

        return filter ?? Builders<TType>.Filter.Empty;
    }
}