package com.trillion.trader.service.impl;

import com.trillion.trader.dto.PagedResponse;
import com.trillion.trader.dto.request.BlogPostRequest;
import com.trillion.trader.dto.response.BlogCategoryResponse;
import com.trillion.trader.dto.response.BlogPostResponse;
import com.trillion.trader.exception.BadRequestException;
import com.trillion.trader.exception.ResourceNotFoundException;
import com.trillion.trader.model.BlogCategory;
import com.trillion.trader.model.BlogPost;
import com.trillion.trader.repository.BlogCategoryRepository;
import com.trillion.trader.repository.BlogPostRepository;
import com.trillion.trader.service.BlogPostService;
import com.trillion.trader.mapper.BlogMapper;
import com.trillion.trader.util.RepositoryUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogPostServiceImpl implements BlogPostService {

    private final BlogPostRepository postRepository;
    private final BlogCategoryRepository categoryRepository;

    @Override
    public PagedResponse<BlogPostResponse> getAllPosts(Pageable pageable, String categoryId) {
        Page<BlogPost> page;
        if (categoryId != null && !categoryId.isBlank()) {
            // Very basic filtering for MVP, should use MongoTemplate for complex queries
            List<BlogPost> filtered = postRepository.findByCategoryId(categoryId);
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), filtered.size());
            page = new PageImpl<>(filtered.subList(start, end), pageable, filtered.size());
        } else {
            page = postRepository.findAll(pageable);
        }
        return PagedResponse.of(page.map(this::mapToResponse));
    }

    @Override
    public PagedResponse<BlogPostResponse> getPublishedPosts(Pageable pageable, String categoryId) {
        // Simple approach for MVP
        List<BlogPost> filtered = postRepository.findByPublishedTrue();
        if (categoryId != null && !categoryId.isBlank()) {
            filtered = filtered.stream().filter(p -> p.getCategoryId().equals(categoryId)).collect(Collectors.toList());
        }
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filtered.size());
        Page<BlogPost> page = new PageImpl<>(filtered.subList(start, end), pageable, filtered.size());
        
        return PagedResponse.of(page.map(this::mapToResponse));
    }

    @Override
    public BlogPostResponse getPostById(String id) {
        return mapToResponse(RepositoryUtils.findOrThrow(postRepository, id, "Blog post"));
    }

    @Override
    public BlogPostResponse getPostBySlug(String slug) {
        return postRepository.findBySlug(slug)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with slug: " + slug));
    }

    @Override
    public BlogPostResponse createPost(BlogPostRequest request) {
        if (postRepository.findBySlug(request.getSlug()).isPresent()) {
            throw new BadRequestException("Blog post slug already exists");
        }
        
        // Validate category exists
        categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new BadRequestException("Invalid category ID"));

        BlogPost post = BlogPost.builder()
                .title(request.getTitle())
                .slug(request.getSlug())
                .content(request.getContent())
                .excerpt(request.getExcerpt())
                .coverImageUrl(request.getCoverImageUrl())
                .authorId(request.getAuthorId())
                .categoryId(request.getCategoryId())
                .tags(request.getTags())
                .published(request.isPublished())
                .views(0)
                .build();

        return mapToResponse(postRepository.save(post));
    }

    @Override
    public BlogPostResponse updatePost(String id, BlogPostRequest request) {
        BlogPost post = RepositoryUtils.findOrThrow(postRepository, id, "Blog post");

        if (!post.getSlug().equals(request.getSlug()) && postRepository.findBySlug(request.getSlug()).isPresent()) {
            throw new BadRequestException("Blog post slug already exists");
        }
        
        categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new BadRequestException("Invalid category ID"));

        post.setTitle(request.getTitle());
        post.setSlug(request.getSlug());
        post.setContent(request.getContent());
        post.setExcerpt(request.getExcerpt());
        post.setCoverImageUrl(request.getCoverImageUrl());
        post.setAuthorId(request.getAuthorId());
        post.setCategoryId(request.getCategoryId());
        post.setTags(request.getTags());
        post.setPublished(request.isPublished());

        return mapToResponse(postRepository.save(post));
    }

    @Override
    public void deletePost(String id) {
        postRepository.delete(RepositoryUtils.findOrThrow(postRepository, id, "Blog post"));
    }

    @Override
    public void incrementViews(String id) {
        BlogPost post = RepositoryUtils.findOrThrow(postRepository, id, "Blog post");
        post.setViews(post.getViews() + 1);
        postRepository.save(post);
    }

    private BlogPostResponse mapToResponse(BlogPost post) {
        BlogCategory category = null;
        if (post.getCategoryId() != null) {
            category = categoryRepository.findById(post.getCategoryId()).orElse(null);
        }
        return BlogMapper.toPostResponse(post, category);
    }
}
