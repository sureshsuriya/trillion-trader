package com.trillion.trader.service.impl;

import com.trillion.trader.dto.request.BlogCategoryRequest;
import com.trillion.trader.dto.response.BlogCategoryResponse;
import com.trillion.trader.exception.BadRequestException;
import com.trillion.trader.exception.ResourceNotFoundException;
import com.trillion.trader.mapper.BlogMapper;
import com.trillion.trader.model.BlogCategory;
import com.trillion.trader.repository.BlogCategoryRepository;
import com.trillion.trader.service.BlogCategoryService;
import com.trillion.trader.util.RepositoryUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogCategoryServiceImpl implements BlogCategoryService {

    private final BlogCategoryRepository repository;

    @Override
    public List<BlogCategoryResponse> getAllCategories() {
        return repository.findAll().stream()
                .map(BlogMapper::toCategoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BlogCategoryResponse getCategoryById(String id) {
        return BlogMapper.toCategoryResponse(RepositoryUtils.findOrThrow(repository, id, "Category"));
    }

    @Override
    public BlogCategoryResponse getCategoryBySlug(String slug) {
        return repository.findBySlug(slug)
                .map(BlogMapper::toCategoryResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));
    }

    @Override
    public BlogCategoryResponse createCategory(BlogCategoryRequest request) {
        if (repository.findBySlug(request.getSlug()).isPresent()) {
            throw new BadRequestException("Category slug already exists");
        }

        BlogCategory category = BlogCategory.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .description(request.getDescription())
                .build();

        return BlogMapper.toCategoryResponse(repository.save(category));
    }

    @Override
    public BlogCategoryResponse updateCategory(String id, BlogCategoryRequest request) {
        BlogCategory category = RepositoryUtils.findOrThrow(repository, id, "Category");

        if (!category.getSlug().equals(request.getSlug()) && repository.findBySlug(request.getSlug()).isPresent()) {
            throw new BadRequestException("Category slug already exists");
        }

        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setDescription(request.getDescription());

        return BlogMapper.toCategoryResponse(repository.save(category));
    }

    @Override
    public void deleteCategory(String id) {
        repository.delete(RepositoryUtils.findOrThrow(repository, id, "Category"));
    }
}
