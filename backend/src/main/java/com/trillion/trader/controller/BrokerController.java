package com.trillion.trader.controller;

import com.trillion.trader.dto.ApiResponse;
import com.trillion.trader.dto.PagedResponse;
import com.trillion.trader.dto.request.BrokerRequest;
import com.trillion.trader.dto.response.BrokerResponse;
import com.trillion.trader.service.BrokerService;
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
@RequestMapping("/api/v1/brokers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BrokerController {

    private final BrokerService service;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<BrokerResponse>>> getAllBrokers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "rating") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ResponseEntity.ok(ApiResponse.success(service.getAllBrokers(pageable), "Brokers retrieved"));
    }

    @GetMapping("/recommended")
    public ResponseEntity<ApiResponse<List<BrokerResponse>>> getRecommendedBrokers() {
        return ResponseEntity.ok(ApiResponse.success(service.getRecommendedBrokers(), "Recommended brokers retrieved"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BrokerResponse>> getBrokerById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(service.getBrokerById(id), "Broker retrieved"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BrokerResponse>> createBroker(@Valid @RequestBody BrokerRequest request) {
        return new ResponseEntity<>(ApiResponse.success(service.createBroker(request), "Broker created"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BrokerResponse>> updateBroker(@PathVariable String id, @Valid @RequestBody BrokerRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.updateBroker(id, request), "Broker updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBroker(@PathVariable String id) {
        service.deleteBroker(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Broker deleted"));
    }
}
