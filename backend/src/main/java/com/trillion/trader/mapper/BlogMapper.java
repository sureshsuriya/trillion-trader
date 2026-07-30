package com.trillion.trader.mapper;

import com.trillion.trader.dto.response.BlogCategoryResponse;
import com.trillion.trader.dto.response.BlogPostResponse;
import com.trillion.trader.model.BlogCategory;
import com.trillion.trader.model.BlogPost;

public final class BlogMapper {

    private BlogMapper() {}

    public static BlogCategoryResponse toCategoryResponse(BlogCategory category) {
        if (category == null) return null;
        return BlogCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .build();
    }

    public static BlogPostResponse toPostResponse(BlogPost post, BlogCategory category) {
        if (post == null) return null;
        return BlogPostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .slug(post.getSlug())
                .content(post.getContent())
                .excerpt(post.getExcerpt())
                .coverImageUrl(post.getCoverImageUrl())
                .authorId(post.getAuthorId())
                .category(toCategoryResponse(category))
                .tags(post.getTags())
                .published(post.isPublished())
                .views(post.getViews())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
