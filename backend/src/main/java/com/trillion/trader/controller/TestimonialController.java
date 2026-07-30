package com.trillion.trader.controller;

import com.trillion.trader.dto.ApiResponse;
import com.trillion.trader.dto.PagedResponse;
import com.trillion.trader.dto.request.TestimonialRequest;
import com.trillion.trader.dto.response.TestimonialResponse;
import com.trillion.trader.service.TestimonialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/testimonials")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TestimonialController {

    private final TestimonialService service;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<TestimonialResponse>>> getAllTestimonials(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ResponseEntity.ok(ApiResponse.success(service.getAllTestimonials(pageable), "Testimonials retrieved"));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<TestimonialResponse>>> getFeaturedTestimonials() {
        return ResponseEntity.ok(ApiResponse.success(service.getFeaturedTestimonials(), "Featured testimonials retrieved"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TestimonialResponse>> getTestimonialById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(service.getTestimonialById(id), "Testimonial retrieved"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TestimonialResponse>> createTestimonial(@Valid @RequestBody TestimonialRequest request) {
        return new ResponseEntity<>(ApiResponse.success(service.createTestimonial(request), "Testimonial created"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TestimonialResponse>> updateTestimonial(@PathVariable String id, @Valid @RequestBody TestimonialRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.updateTestimonial(id, request), "Testimonial updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTestimonial(@PathVariable String id) {
        service.deleteTestimonial(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Testimonial deleted"));
    }
}
