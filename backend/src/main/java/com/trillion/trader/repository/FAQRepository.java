package com.trillion.trader.repository;

import com.trillion.trader.model.FAQ;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FAQRepository extends MongoRepository<FAQ, String> {
    List<FAQ> findByCategoryOrderByDisplayOrderAsc(String category);
}
