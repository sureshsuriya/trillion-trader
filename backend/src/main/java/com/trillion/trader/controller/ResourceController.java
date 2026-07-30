package com.trillion.trader.controller;

import com.trillion.trader.dto.ApiResponse;
import com.trillion.trader.dto.PagedResponse;
import com.trillion.trader.dto.request.ResourceRequest;
import com.trillion.trader.dto.response.ResourceResponse;
import com.trillion.trader.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/resources")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResourceController {

    private final ResourceService service;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<ResourceResponse>>> getAllResources(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) String type) {

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ResponseEntity.ok(ApiResponse.success(service.getAllResources(pageable, type), "Resources retrieved"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceResponse>> getResourceById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(service.getResourceById(id), "Resource retrieved"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ResourceResponse>> createResource(@Valid @RequestBody ResourceRequest request) {
        return new ResponseEntity<>(ApiResponse.success(service.createResource(request), "Resource created"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceResponse>> updateResource(@PathVariable String id, @Valid @RequestBody ResourceRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.updateResource(id, request), "Resource updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteResource(@PathVariable String id) {
        service.deleteResource(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Resource deleted"));
    }
}
