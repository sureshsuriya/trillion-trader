package com.trillion.trader.repository;

import com.trillion.trader.model.UserProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends MongoRepository<UserProgress, String> {
    Optional<UserProgress> findByUserIdAndCourseId(String userId, String courseId);
    List<UserProgress> findByUserId(String userId);
}
