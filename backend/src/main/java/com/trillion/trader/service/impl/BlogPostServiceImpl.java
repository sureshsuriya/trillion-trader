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
        return mapToResponse(findOrThrow(id));
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
        BlogPost post = findOrThrow(id);

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
        postRepository.delete(findOrThrow(id));
    }

    @Override
    public void incrementViews(String id) {
        BlogPost post = findOrThrow(id);
        post.setViews(post.getViews() + 1);
        postRepository.save(post);
    }

    private BlogPost findOrThrow(String id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));
    }

    private BlogPostResponse mapToResponse(BlogPost post) {
        BlogCategoryResponse categoryResponse = null;
        if (post.getCategoryId() != null) {
            categoryResponse = categoryRepository.findById(post.getCategoryId())
                    .map(c -> BlogCategoryResponse.builder()
                            .id(c.getId())
                            .name(c.getName())
                            .slug(c.getSlug())
                            .build())
                    .orElse(null);
        }

        return BlogPostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .slug(post.getSlug())
                .content(post.getContent())
                .excerpt(post.getExcerpt())
                .coverImageUrl(post.getCoverImageUrl())
                .authorId(post.getAuthorId())
                .category(categoryResponse)
                .tags(post.getTags())
                .published(post.isPublished())
                .views(post.getViews())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
