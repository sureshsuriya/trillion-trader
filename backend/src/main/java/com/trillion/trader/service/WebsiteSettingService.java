package com.trillion.trader.service;

import com.trillion.trader.dto.request.WebsiteSettingRequest;
import com.trillion.trader.dto.response.WebsiteSettingResponse;

import java.util.List;

public interface WebsiteSettingService {
    List<WebsiteSettingResponse> getAllSettings();
    WebsiteSettingResponse getSettingByKey(String key);
    WebsiteSettingResponse createOrUpdateSetting(WebsiteSettingRequest request);
    void deleteSetting(String key);
}
