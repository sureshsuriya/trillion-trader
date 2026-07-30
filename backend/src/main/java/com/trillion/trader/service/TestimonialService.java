package com.trillion.trader.service;

import com.trillion.trader.dto.PagedResponse;
import com.trillion.trader.dto.request.TestimonialRequest;
import com.trillion.trader.dto.response.TestimonialResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TestimonialService {
    PagedResponse<TestimonialResponse> getAllTestimonials(Pageable pageable);
    List<TestimonialResponse> getFeaturedTestimonials();
    TestimonialResponse getTestimonialById(String id);
    TestimonialResponse createTestimonial(TestimonialRequest request);
    TestimonialResponse updateTestimonial(String id, TestimonialRequest request);
    void deleteTestimonial(String id);
}
