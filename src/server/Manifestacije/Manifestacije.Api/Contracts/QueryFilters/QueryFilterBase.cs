namespace Manifestacije.Api.Contracts.QueryFilters;

public class QueryFilterBase
{
    public int PageSize { get; set; }
    public int PageNumber { get; set; }
    public string? SortColumn { get; set; }
    public string? SortDirection { get; set; } = "";
    public bool IsAnd { get; set; } = false;
    public bool ShowDeleted { get; set; } = false;
}