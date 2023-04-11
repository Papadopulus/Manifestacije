using Manifestacije.Api.Models;
using Riok.Mapperly.Abstractions;

namespace Manifestacije.Api.Mappers;

[Mapper]
public static partial class CategoryMapper
{
    public static partial Category CategoryCreateRequestToCategory(CategoryCreateRequest categoryCreateRequest);
    public static partial Category CategoryUpdateRequestToCategory(CategoryUpdateRequest categoryUpdateRequest);
    public static partial CategoryViewResponse CategoryToCategoryViewResponse(Category category);

    public static partial IEnumerable<CategoryViewResponse> CategoryToCategoryViewResponseEnumerable(
        IEnumerable<Category> categories);
}