package com.trillion.trader.repository;

import com.trillion.trader.model.PropFirm;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropFirmRepository extends MongoRepository<PropFirm, String> {
    List<PropFirm> findByRecommendedTrue();
}
