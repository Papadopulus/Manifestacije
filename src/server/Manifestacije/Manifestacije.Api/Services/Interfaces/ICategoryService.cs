using Manifestacije.Api.Models;

namespace Manifestacije.Api.Services.Interfaces;

public interface ICategoryService
{
    Task<List<Category>> GetAllCategoriesAsync(CategoryQueryFilter categoryQueryFilter);
    Task<Category?> GetCategoryByIdAsync(string id);
    Task<Category> CreateCategoryAsync(CategoryCreateRequest categoryCreateRequest);
    Task<Category?> UpdateCategoryAsync(string id, CategoryUpdateRequest categoryUpdateRequest);
    Task<bool> DeleteCategoryAsync(string id);
}