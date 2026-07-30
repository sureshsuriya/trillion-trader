package com.trillion.trader.service;

import com.trillion.trader.dto.PagedResponse;
import com.trillion.trader.dto.request.FAQRequest;
import com.trillion.trader.dto.response.FAQResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FAQService {
    PagedResponse<FAQResponse> getAllFAQs(Pageable pageable);
    List<FAQResponse> getFAQsByCategory(String category);
    FAQResponse getFAQById(String id);
    FAQResponse createFAQ(FAQRequest request);
    FAQResponse updateFAQ(String id, FAQRequest request);
    void deleteFAQ(String id);
}
