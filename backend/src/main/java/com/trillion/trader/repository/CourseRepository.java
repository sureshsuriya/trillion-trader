package com.trillion.trader.repository;

import com.trillion.trader.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends MongoRepository<Course, String> {
    Optional<Course> findBySlug(String slug);
    List<Course> findByPublished(boolean published);
    List<Course> findByCategory(String category);
    List<Course> findByLevel(String level);
    List<Course> findByAccessType(String accessType);
}
