package com.trillion.trader.repository;

import com.trillion.trader.model.BlogCategory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlogCategoryRepository extends MongoRepository<BlogCategory, String> {
    Optional<BlogCategory> findBySlug(String slug);
}
