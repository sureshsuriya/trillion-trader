package com.trillion.trader.controller;

import com.trillion.trader.dto.ApiResponse;
import com.trillion.trader.dto.request.WebsiteSettingRequest;
import com.trillion.trader.dto.response.WebsiteSettingResponse;
import com.trillion.trader.service.WebsiteSettingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/settings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WebsiteSettingController {

    private final WebsiteSettingService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WebsiteSettingResponse>>> getAllSettings() {
        return ResponseEntity.ok(ApiResponse.success(service.getAllSettings(), "Settings retrieved"));
    }

    @GetMapping("/{key}")
    public ResponseEntity<ApiResponse<WebsiteSettingResponse>> getSettingByKey(@PathVariable String key) {
        return ResponseEntity.ok(ApiResponse.success(service.getSettingByKey(key), "Setting retrieved"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WebsiteSettingResponse>> createOrUpdateSetting(@Valid @RequestBody WebsiteSettingRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.createOrUpdateSetting(request), "Setting saved"));
    }

    @DeleteMapping("/{key}")
    public ResponseEntity<ApiResponse<Void>> deleteSetting(@PathVariable String key) {
        service.deleteSetting(key);
        return ResponseEntity.ok(ApiResponse.success(null, "Setting deleted"));
    }
}
