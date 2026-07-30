package com.trillion.trader.controller;

import com.trillion.trader.dto.ApiResponse;
import com.trillion.trader.dto.PagedResponse;
import com.trillion.trader.dto.request.PropFirmRequest;
import com.trillion.trader.dto.response.PropFirmResponse;
import com.trillion.trader.service.PropFirmService;
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
@RequestMapping("/api/v1/prop-firms")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PropFirmController {

    private final PropFirmService service;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<PropFirmResponse>>> getAllPropFirms(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "rating") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ResponseEntity.ok(ApiResponse.success(service.getAllPropFirms(pageable), "Prop Firms retrieved"));
    }

    @GetMapping("/recommended")
    public ResponseEntity<ApiResponse<List<PropFirmResponse>>> getRecommendedPropFirms() {
        return ResponseEntity.ok(ApiResponse.success(service.getRecommendedPropFirms(), "Recommended Prop Firms retrieved"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PropFirmResponse>> getPropFirmById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(service.getPropFirmById(id), "Prop Firm retrieved"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PropFirmResponse>> createPropFirm(@Valid @RequestBody PropFirmRequest request) {
        return new ResponseEntity<>(ApiResponse.success(service.createPropFirm(request), "Prop Firm created"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PropFirmResponse>> updatePropFirm(@PathVariable String id, @Valid @RequestBody PropFirmRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.updatePropFirm(id, request), "Prop Firm updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePropFirm(@PathVariable String id) {
        service.deletePropFirm(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Prop Firm deleted"));
    }
}
