package com.trillion.trader.service;

import com.trillion.trader.dto.PagedResponse;
import com.trillion.trader.dto.request.BrokerRequest;
import com.trillion.trader.dto.response.BrokerResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BrokerService {
    PagedResponse<BrokerResponse> getAllBrokers(Pageable pageable);
    List<BrokerResponse> getRecommendedBrokers();
    BrokerResponse getBrokerById(String id);
    BrokerResponse createBroker(BrokerRequest request);
    BrokerResponse updateBroker(String id, BrokerRequest request);
    void deleteBroker(String id);
}
