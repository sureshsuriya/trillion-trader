package com.trillion.trader.service.impl;

import com.trillion.trader.dto.request.WebsiteSettingRequest;
import com.trillion.trader.dto.response.WebsiteSettingResponse;
import com.trillion.trader.exception.ResourceNotFoundException;
import com.trillion.trader.model.WebsiteSetting;
import com.trillion.trader.repository.WebsiteSettingRepository;
import com.trillion.trader.service.WebsiteSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WebsiteSettingServiceImpl implements WebsiteSettingService {

    private final WebsiteSettingRepository repository;

    @Override
    public List<WebsiteSettingResponse> getAllSettings() {
        return repository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public WebsiteSettingResponse getSettingByKey(String key) {
        return repository.findByKey(key)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Setting not found with key: " + key));
    }

    @Override
    public WebsiteSettingResponse createOrUpdateSetting(WebsiteSettingRequest request) {
        Optional<WebsiteSetting> existing = repository.findByKey(request.getKey());
        
        WebsiteSetting setting;
        if (existing.isPresent()) {
            setting = existing.get();
            setting.setValue(request.getValue());
            setting.setDescription(request.getDescription());
        } else {
            setting = WebsiteSetting.builder()
                    .key(request.getKey())
                    .value(request.getValue())
                    .description(request.getDescription())
                    .build();
        }
        
        return mapToResponse(repository.save(setting));
    }

    @Override
    public void deleteSetting(String key) {
        WebsiteSetting setting = repository.findByKey(key)
                .orElseThrow(() -> new ResourceNotFoundException("Setting not found with key: " + key));
        repository.delete(setting);
    }

    private WebsiteSettingResponse mapToResponse(WebsiteSetting setting) {
        return WebsiteSettingResponse.builder()
                .id(setting.getId())
                .key(setting.getKey())
                .value(setting.getValue())
                .description(setting.getDescription())
                .build();
    }
}
