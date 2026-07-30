package com.trillion.trader.repository;

import com.trillion.trader.model.BlogPost;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface BlogPostRepository extends MongoRepository<BlogPost, String> {
    Optional<BlogPost> findBySlug(String slug);
    List<BlogPost> findByCategoryId(String categoryId);
    List<BlogPost> findByPublishedTrue();
}
