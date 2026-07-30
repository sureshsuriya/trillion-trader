package com.trillion.trader.controller;

import com.trillion.trader.dto.ApiResponse;
import com.trillion.trader.dto.PagedResponse;
import com.trillion.trader.dto.request.FAQRequest;
import com.trillion.trader.dto.response.FAQResponse;
import com.trillion.trader.service.FAQService;
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
@RequestMapping("/api/v1/faqs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FAQController {

    private final FAQService service;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<FAQResponse>>> getAllFAQs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(defaultValue = "displayOrder") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ResponseEntity.ok(ApiResponse.success(service.getAllFAQs(pageable), "FAQs retrieved"));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<FAQResponse>>> getFAQsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(ApiResponse.success(service.getFAQsByCategory(category), "FAQs retrieved"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FAQResponse>> getFAQById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(service.getFAQById(id), "FAQ retrieved"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FAQResponse>> createFAQ(@Valid @RequestBody FAQRequest request) {
        return new ResponseEntity<>(ApiResponse.success(service.createFAQ(request), "FAQ created"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FAQResponse>> updateFAQ(@PathVariable String id, @Valid @RequestBody FAQRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.updateFAQ(id, request), "FAQ updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFAQ(@PathVariable String id) {
        service.deleteFAQ(id);
        return ResponseEntity.ok(ApiResponse.success(null, "FAQ deleted"));
    }
}
