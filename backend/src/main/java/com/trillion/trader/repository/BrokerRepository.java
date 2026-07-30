package com.trillion.trader.repository;

import com.trillion.trader.model.Broker;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrokerRepository extends MongoRepository<Broker, String> {
    List<Broker> findByRecommendedTrue();
}
