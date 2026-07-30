package com.trillion.trader.service.impl;

import com.trillion.trader.dto.PagedResponse;
import com.trillion.trader.dto.request.TestimonialRequest;
import com.trillion.trader.dto.response.TestimonialResponse;
import com.trillion.trader.exception.ResourceNotFoundException;
import com.trillion.trader.model.Testimonial;
import com.trillion.trader.repository.TestimonialRepository;
import com.trillion.trader.service.TestimonialService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestimonialServiceImpl implements TestimonialService {

    private final TestimonialRepository repository;

    @Override
    public PagedResponse<TestimonialResponse> getAllTestimonials(Pageable pageable) {
        Page<Testimonial> page = repository.findAll(pageable);
        return PagedResponse.of(page.map(this::mapToResponse));
    }

    @Override
    public List<TestimonialResponse> getFeaturedTestimonials() {
        return repository.findByFeaturedTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TestimonialResponse getTestimonialById(String id) {
        return mapToResponse(findOrThrow(id));
    }

    @Override
    public TestimonialResponse createTestimonial(TestimonialRequest request) {
        Testimonial testimonial = Testimonial.builder()
                .authorName(request.getAuthorName())
                .authorRole(request.getAuthorRole())
                .avatarUrl(request.getAvatarUrl())
                .content(request.getContent())
                .rating(request.getRating())
                .featured(request.isFeatured())
                .build();
        return mapToResponse(repository.save(testimonial));
    }

    @Override
    public TestimonialResponse updateTestimonial(String id, TestimonialRequest request) {
        Testimonial testimonial = findOrThrow(id);
        
        testimonial.setAuthorName(request.getAuthorName());
        testimonial.setAuthorRole(request.getAuthorRole());
        testimonial.setAvatarUrl(request.getAvatarUrl());
        testimonial.setContent(request.getContent());
        testimonial.setRating(request.getRating());
        testimonial.setFeatured(request.isFeatured());
        
        return mapToResponse(repository.save(testimonial));
    }

    @Override
    public void deleteTestimonial(String id) {
        repository.delete(findOrThrow(id));
    }

    private Testimonial findOrThrow(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found with id: " + id));
    }

    private TestimonialResponse mapToResponse(Testimonial testimonial) {
        return TestimonialResponse.builder()
                .id(testimonial.getId())
                .authorName(testimonial.getAuthorName())
                .authorRole(testimonial.getAuthorRole())
                .avatarUrl(testimonial.getAvatarUrl())
                .content(testimonial.getContent())
                .rating(testimonial.getRating())
                .featured(testimonial.isFeatured())
                .build();
    }
}
