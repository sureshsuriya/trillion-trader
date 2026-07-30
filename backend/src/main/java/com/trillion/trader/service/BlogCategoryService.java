package com.trillion.trader.service;

import com.trillion.trader.dto.request.BlogCategoryRequest;
import com.trillion.trader.dto.response.BlogCategoryResponse;

import java.util.List;

public interface BlogCategoryService {
    List<BlogCategoryResponse> getAllCategories();
    BlogCategoryResponse getCategoryById(String id);
    BlogCategoryResponse getCategoryBySlug(String slug);
    BlogCategoryResponse createCategory(BlogCategoryRequest request);
    BlogCategoryResponse updateCategory(String id, BlogCategoryRequest request);
    void deleteCategory(String id);
}
