﻿using Manifestacije.Api.Models;

namespace Manifestacije.Api.Repositories.Interfaces;

public interface ICategoryRepository
{
    Task<List<Category>> GetAllCategoriesAsync(CategoryQueryFilter categoryQueryFilter);
    Task<Category?> GetCategoryByIdAsync(string id, bool includeDeleted = false);
    Task<Category?> GetCategoryWithNameAsync(string name, bool includeDeleted = false);
    Task<bool> CreateCategoryAsync(Category category);
    Task<bool> UpdateCategoryAsync(Category category);
    Task<bool> DeleteCategoryAsync(string id);
}