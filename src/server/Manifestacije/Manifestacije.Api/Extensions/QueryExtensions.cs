using System.Linq.Expressions;
using System.Reflection;
using Manifestacije.Api.Contracts.QueryFilters;
using MongoDB.Driver;

namespace Manifestacije.Api.Extensions;

public static class QueryExtensions
{
    public static IFindFluent<TType, TType>? Paginate<TType>(this IFindFluent<TType, TType> query,
        QueryFilterBase filter)
    {
        return query.Skip((filter.PageNumber - 1) * filter.PageSize).Limit(filter.PageSize);
    }

    public static IFindFluent<TType, TType>? Sort<TType>(this IFindFluent<TType, TType> query, QueryFilterBase filter)
    {
        if (string.IsNullOrEmpty(filter.SortColumn))
        {
            // TODO: Add default sort
            return query;
        }

        return filter.SortDirection != "desc"
            ? query.SortBy(x => x!.GetType().GetProperty(filter.SortColumn)!.GetValue(x))
            : query.SortByDescending(x => x!.GetType().GetProperty(filter.SortColumn)!.GetValue(x));
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
                        && !x.Name.AsSpan().StartsWith("Max"))
            .ToArray();

        var propsMin = props
            .Where(x => x.Name.AsSpan().StartsWith("Min"))
            .ToArray();
        var propsMax = props
            .Where(x => x.Name.AsSpan().StartsWith("Max"))
            .ToArray();

        var isAnd = query.GetType()
            .GetProperties()
            .First(x => x.Name.Contains("IsAnd")).GetValue(query) as bool? ?? false;

        var showDeleted = query.GetType()
            .GetProperties()
            .First(x => x.Name.Contains("ShowDeleted")).GetValue(query) as bool? ?? false;

        var filter = Builders<TType>.Filter.Empty;
        
        if (!showDeleted)
        {
            filter &= Builders<TType>.Filter.Eq(x => x!.GetType().GetProperty("IsDeleted")!.GetValue(x), false);
        }

        foreach (var prop in propsMin)
        {
            var valueMin = prop.GetValue(query);
            var valueMax = propsMax.FirstOrDefault(x => x.Name[3..] == prop.Name[3..])?.GetValue(query);
            var name = prop.Name.Skip(3).ToString()!;

            if (valueMin is null
                && valueMax is null)
                continue;

            var filterMinMax = Builders<TType>.Filter.Empty;

            if (valueMin is not null)
            {
                var type = prop.GetType();
                var property = type.GetProperty(name,
                    BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance)!;

                var lambda = CreateLambdaExpression<TType>(type, property);
                filterMinMax &= Builders<TType>.Filter.Gte(lambda, valueMin);
            }

            if (valueMax is not null)
            {
                var type = prop.GetType();
                var property = type.GetProperty(name,
                    BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance)!;

                var lambda = CreateLambdaExpression<TType>(type, property);
                filterMinMax &= Builders<TType>.Filter.Lte(lambda!, valueMin);
            }

            filter = isAnd ? filter & filterMinMax : filter | filterMinMax;
        }

        foreach (var prop in propsWithoutMinMax)
        {
            var value = prop.GetValue(query);
            var name = prop.Name;

            if (value is null)
                continue;

            var type = prop.GetType();
            var property = type.GetProperty(name,
                BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance)!;

            var lambda = CreateLambdaExpression<TType>(type, property);
            var filterProp = Builders<TType>.Filter.Regex(lambda, $"^.*{value}.*$");

            filter = isAnd ? filter & filterProp : filter | filterProp;
        }

        return filter;
    }

    private static Expression<Func<TType, object>> CreateLambdaExpression<TType>(Type type, MemberInfo property)
    {
        var parameter = Expression.Parameter(type, "y");
        Expression memberExpression = Expression.MakeMemberAccess(parameter, property);
        return Expression.Lambda<Func<TType, object>>(memberExpression, parameter);
    }
}