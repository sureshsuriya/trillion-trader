package com.trillion.trader.repository;

import com.trillion.trader.model.WebsiteSetting;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WebsiteSettingRepository extends MongoRepository<WebsiteSetting, String> {
    Optional<WebsiteSetting> findByKey(String key);
}
