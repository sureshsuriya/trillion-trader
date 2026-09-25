package com.trillion.trader.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Document(collection = "courses")
public class Course extends BaseEntity {
    @Id
    private String id;

    private String title;

    @Indexed(unique = true)
    private String slug;

    private String description;
    private String shortDescription;
    private String thumbnailUrl;
    
    // BEGINNER, INTERMEDIATE, ADVANCED
    private String level;
    
    // FOREX, STOCKS, OPTIONS, PROP_FIRM, TECHNICAL_ANALYSIS
    private String category;
    
    // FREE, PREMIUM
    private String accessType;
    
    private String duration; // e.g. "4h 30m"
    private double rating;
    private int totalStudents;
    private boolean published;

    private String instructorName;
    private String instructorTitle;
    private String instructorAvatar;

    @Builder.Default
    private List<CourseModule> modules = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseModule {
        private String id;
        private String title;
        private String description;
        private int orderIndex;
        
        @Builder.Default
        private List<Lesson> lessons = new ArrayList<>();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Lesson {
        private String id;
        private String title;
        private String slug;
        private String description;
        private String videoUrl;
        private String duration; // e.g. "12m"
        private String contentHtml;
        private boolean freePreview;
        private int orderIndex;
        
        @Builder.Default
        private List<QuizQuestion> quiz = new ArrayList<>();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuizQuestion {
        private String question;
        private List<String> options;
        private int correctOptionIndex;
        private String explanation;
    }
}
