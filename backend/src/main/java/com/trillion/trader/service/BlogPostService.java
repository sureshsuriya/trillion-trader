package com.trillion.trader.service;

import com.trillion.trader.dto.PagedResponse;
import com.trillion.trader.dto.request.BlogPostRequest;
import com.trillion.trader.dto.response.BlogPostResponse;
import org.springframework.data.domain.Pageable;

public interface BlogPostService {
    PagedResponse<BlogPostResponse> getAllPosts(Pageable pageable, String categoryId);
    PagedResponse<BlogPostResponse> getPublishedPosts(Pageable pageable, String categoryId);
    BlogPostResponse getPostById(String id);
    BlogPostResponse getPostBySlug(String slug);
    BlogPostResponse createPost(BlogPostRequest request);
    BlogPostResponse updatePost(String id, BlogPostRequest request);
    void deletePost(String id);
    void incrementViews(String id);
}
