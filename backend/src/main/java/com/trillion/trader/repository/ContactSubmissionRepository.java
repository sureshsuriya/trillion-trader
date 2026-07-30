package com.trillion.trader.repository;

import com.trillion.trader.model.ContactSubmission;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactSubmissionRepository extends MongoRepository<ContactSubmission, String> {
    List<ContactSubmission> findByReadFalse();
}
