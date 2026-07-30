package com.trillion.trader.repository;

import com.trillion.trader.model.Testimonial;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestimonialRepository extends MongoRepository<Testimonial, String> {
    List<Testimonial> findByFeaturedTrue();
}
