package com.trillion.trader.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Document(collection = "user_progress")
@CompoundIndex(def = "{'userId': 1, 'courseId': 1}", unique = true)
public class UserProgress extends BaseEntity {
    @Id
    private String id;
    
    private String userId;
    private String courseId;
    
    @Builder.Default
    private Set<String> completedLessonIds = new HashSet<>();
    
    private String lastAccessedLessonId;
    private double progressPercentage;
    private boolean completed;
}
