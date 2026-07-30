package com.trillion.trader.controller;

import com.trillion.trader.dto.ApiResponse;
import com.trillion.trader.dto.PagedResponse;
import com.trillion.trader.dto.request.BlogPostRequest;
import com.trillion.trader.dto.response.BlogPostResponse;
import com.trillion.trader.service.BlogPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/blogs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BlogPostController {

    private final BlogPostService service;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<BlogPostResponse>>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) String categoryId,
            @RequestParam(defaultValue = "false") boolean publicOnly) {

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        PagedResponse<BlogPostResponse> posts = publicOnly 
            ? service.getPublishedPosts(pageable, categoryId)
            : service.getAllPosts(pageable, categoryId);
            
        return ResponseEntity.ok(ApiResponse.success(posts, "Blog posts retrieved"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogPostResponse>> getPostById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(service.getPostById(id), "Post retrieved"));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<BlogPostResponse>> getPostBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(service.getPostBySlug(slug), "Post retrieved"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BlogPostResponse>> createPost(@Valid @RequestBody BlogPostRequest request) {
        return new ResponseEntity<>(ApiResponse.success(service.createPost(request), "Post created"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogPostResponse>> updatePost(@PathVariable String id, @Valid @RequestBody BlogPostRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.updatePost(id, request), "Post updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable String id) {
        service.deletePost(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Post deleted"));
    }
    
    @PostMapping("/{id}/views")
    public ResponseEntity<ApiResponse<Void>> incrementViews(@PathVariable String id) {
        service.incrementViews(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Views incremented"));
    }
}
