package com.trillion.trader.service;

import com.trillion.trader.dto.PagedResponse;
import com.trillion.trader.dto.request.PropFirmRequest;
import com.trillion.trader.dto.response.PropFirmResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PropFirmService {
    PagedResponse<PropFirmResponse> getAllPropFirms(Pageable pageable);
    List<PropFirmResponse> getRecommendedPropFirms();
    PropFirmResponse getPropFirmById(String id);
    PropFirmResponse createPropFirm(PropFirmRequest request);
    PropFirmResponse updatePropFirm(String id, PropFirmRequest request);
    void deletePropFirm(String id);
}
