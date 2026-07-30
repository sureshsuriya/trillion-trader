package com.trillion.trader.controller;

import com.trillion.trader.dto.ApiResponse;
import com.trillion.trader.dto.request.BlogCategoryRequest;
import com.trillion.trader.dto.response.BlogCategoryResponse;
import com.trillion.trader.service.BlogCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/blog-categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BlogCategoryController {

    private final BlogCategoryService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BlogCategoryResponse>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.success(service.getAllCategories(), "Categories retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogCategoryResponse>> getCategoryById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(service.getCategoryById(id), "Category retrieved"));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<BlogCategoryResponse>> getCategoryBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(service.getCategoryBySlug(slug), "Category retrieved"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BlogCategoryResponse>> createCategory(@Valid @RequestBody BlogCategoryRequest request) {
        return new ResponseEntity<>(ApiResponse.success(service.createCategory(request), "Category created"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogCategoryResponse>> updateCategory(@PathVariable String id, @Valid @RequestBody BlogCategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.updateCategory(id, request), "Category updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable String id) {
        service.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Category deleted"));
    }
}
