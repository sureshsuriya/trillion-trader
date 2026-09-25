package com.trillion.trader.service;

import com.trillion.trader.model.Course;
import com.trillion.trader.model.UserProgress;
import com.trillion.trader.repository.CourseRepository;
import com.trillion.trader.repository.UserProgressRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserProgressRepository userProgressRepository;

    public List<Course> getAllPublishedCourses() {
        return courseRepository.findByPublished(true);
    }

    public List<Course> getAllCoursesForAdmin() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseBySlug(String slug) {
        return courseRepository.findBySlug(slug);
    }

    public Optional<Course> getCourseById(String id) {
        return courseRepository.findById(id);
    }

    public Course createCourse(Course course) {
        if (course.getSlug() == null || course.getSlug().trim().isEmpty()) {
            course.setSlug(generateSlug(course.getTitle()));
        }
        return courseRepository.save(course);
    }

    public Course updateCourse(String id, Course updatedCourse) {
        return courseRepository.findById(id).map(existing -> {
            existing.setTitle(updatedCourse.getTitle());
            existing.setShortDescription(updatedCourse.getShortDescription());
            existing.setDescription(updatedCourse.getDescription());
            existing.setThumbnailUrl(updatedCourse.getThumbnailUrl());
            existing.setLevel(updatedCourse.getLevel());
            existing.setCategory(updatedCourse.getCategory());
            existing.setAccessType(updatedCourse.getAccessType());
            existing.setDuration(updatedCourse.getDuration());
            existing.setPublished(updatedCourse.isPublished());
            existing.setInstructorName(updatedCourse.getInstructorName());
            existing.setInstructorTitle(updatedCourse.getInstructorTitle());
            existing.setInstructorAvatar(updatedCourse.getInstructorAvatar());
            existing.setModules(updatedCourse.getModules());
            return courseRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
    }

    public void deleteCourse(String id) {
        courseRepository.deleteById(id);
    }

    public UserProgress recordLessonCompletion(String userId, String courseId, String lessonId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        int totalLessons = course.getModules().stream()
                .mapToInt(m -> m.getLessons() != null ? m.getLessons().size() : 0)
                .sum();

        UserProgress progress = userProgressRepository.findByUserIdAndCourseId(userId, courseId)
                .orElse(UserProgress.builder()
                        .userId(userId)
                        .courseId(courseId)
                        .completedLessonIds(new HashSet<>())
                        .build());

        progress.getCompletedLessonIds().add(lessonId);
        progress.setLastAccessedLessonId(lessonId);

        if (totalLessons > 0) {
            double percent = ((double) progress.getCompletedLessonIds().size() / totalLessons) * 100.0;
            progress.setProgressPercentage(Math.min(100.0, Math.round(percent * 10.0) / 10.0));
            progress.setCompleted(progress.getCompletedLessonIds().size() >= totalLessons);
        }

        return userProgressRepository.save(progress);
    }

    public Optional<UserProgress> getUserProgress(String userId, String courseId) {
        return userProgressRepository.findByUserIdAndCourseId(userId, courseId);
    }

    private String generateSlug(String input) {
        if (input == null) return UUID.randomUUID().toString();
        return input.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
    }

    @PostConstruct
    public void seedInitialCourses() {
        if (courseRepository.count() == 0) {
            log.info("Seeding starter Trading Academy courses...");

            Course course1 = Course.builder()
                    .title("Forex & Price Action Foundations 101")
                    .slug("forex-price-action-foundations-101")
                    .shortDescription("Master candlestick patterns, market structure, support/resistance, and risk management fundamentals.")
                    .description("The ultimate beginner course for traders entering the Forex and Stock markets. Learn how to read raw price charts without lagging indicators, manage capital like a institutional pro, and execute high-probability setups.")
                    .thumbnailUrl("https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80")
                    .level("BEGINNER")
                    .category("FOREX")
                    .accessType("FREE")
                    .duration("3h 45m")
                    .rating(4.9)
                    .totalStudents(1240)
                    .published(true)
                    .instructorName("Alexander Reed")
                    .instructorTitle("Senior Market Strategist & Prop Trader")
                    .instructorAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80")
                    .modules(List.of(
                            Course.CourseModule.builder()
                                    .id("mod-1")
                                    .title("Module 1: Market Mechanics & Candlestick Anatomy")
                                    .description("Understand who moves the markets and how to interpret price candles.")
                                    .orderIndex(1)
                                    .lessons(List.of(
                                            Course.Lesson.builder()
                                                    .id("les-1")
                                                    .title("1.1 Introduction to Currency Pairs & Pip Math")
                                                    .slug("intro-to-currency-pairs")
                                                    .duration("12m")
                                                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                                                    .contentHtml("<p>Welcome to <strong>Trillion Traders Academy</strong>! In this lesson, we break down what Forex is, how currency pairs work (Base vs Quote currency), and how to calculate pips accurately across major and minor pairs.</p>")
                                                    .freePreview(true)
                                                    .orderIndex(1)
                                                    .quiz(List.of(
                                                            Course.QuizQuestion.builder()
                                                                    .question("What is a 'Pip' in Forex trading?")
                                                                    .options(List.of("Percentage in Point (standardized unit of price change)", "Profit in Percentage", "Price Index Pointer", "Position Initial Price"))
                                                                    .correctOptionIndex(0)
                                                                    .explanation("A pip stands for Percentage in Point and measures the smallest price change in currency quotes.")
                                                                    .build()
                                                    ))
                                                    .build(),
                                            Course.Lesson.builder()
                                                    .id("les-2")
                                                    .title("1.2 Decoding Market Trends & Structure (HH/HL)")
                                                    .slug("decoding-market-trends")
                                                    .duration("18m")
                                                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                                                    .contentHtml("<p>Learn to identify Higher Highs (HH), Higher Lows (HL), Lower Highs (LH), and Lower Lows (LL). Trend identification is the highest edge a beginner can master.</p>")
                                                    .freePreview(true)
                                                    .orderIndex(2)
                                                    .build()
                                    ))
                                    .build(),
                            Course.CourseModule.builder()
                                    .id("mod-2")
                                    .title("Module 2: Key Levels & Execution")
                                    .description("Master horizontal support, resistance, key liquidity zones, and order entry.")
                                    .orderIndex(2)
                                    .lessons(List.of(
                                            Course.Lesson.builder()
                                                    .id("les-3")
                                                    .title("2.1 Drawing Valid Support & Resistance Zones")
                                                    .slug("drawing-support-resistance")
                                                    .duration("22m")
                                                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                                                    .contentHtml("<p>Stop drawing single lines! Learn why key levels are zones where institutional order flow resides.</p>")
                                                    .freePreview(false)
                                                    .orderIndex(1)
                                                    .build()
                                    ))
                                    .build()
                    ))
                    .build();

            Course course2 = Course.builder()
                    .title("Prop Firm Challenge Mastery: Passing 10% Targets")
                    .slug("prop-firm-challenge-mastery")
                    .shortDescription("A battle-tested blueprint to pass FTMO, Funding Pips, and top prop challenges without breaching daily drawdowns.")
                    .description("Prop firms offer traders capital from $10k to $500k+, but 90% of applicants fail due to poor drawdown management. This masterclass teaches risk-reward sizing, maximum drawdown buffers, and high-win-rate setups tailored specifically for prop evaluation phases.")
                    .thumbnailUrl("https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80")
                    .level("ADVANCED")
                    .category("PROP_FIRM")
                    .accessType("PREMIUM")
                    .duration("5h 15m")
                    .rating(5.0)
                    .totalStudents(890)
                    .published(true)
                    .instructorName("Marcus Vance")
                    .instructorTitle("Head Prop Portfolio Manager")
                    .instructorAvatar("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80")
                    .modules(List.of(
                            Course.CourseModule.builder()
                                    .id("mod-pf1")
                                    .title("Module 1: The Math of Prop Challenge Survival")
                                    .description("Designing your personal risk parameters for 5% daily drawdown limit rules.")
                                    .orderIndex(1)
                                    .lessons(List.of(
                                            Course.Lesson.builder()
                                                    .id("les-pf1")
                                                    .title("1.1 Standardizing 0.5% vs 1% Risk per Trade")
                                                    .slug("standardizing-risk-per-trade")
                                                    .duration("25m")
                                                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                                                    .contentHtml("<p>Why risking 1% per trade on a $100k challenge gives you only 5 consecutive losses before hitting daily limits, and how 0.33% - 0.5% risk models ensure math longevity.</p>")
                                                    .freePreview(true)
                                                    .orderIndex(1)
                                                    .build()
                                    ))
                                    .build()
                    ))
                    .build();

            Course course3 = Course.builder()
                    .title("Smart Money Concepts (SMC) & Liquidity Pools")
                    .slug("smart-money-concepts-smc")
                    .shortDescription("Trade like central banks and hedge funds by identifying Order Blocks, Fair Value Gaps (FVG), and Liquidity sweeps.")
                    .description("Uncover how institutional liquidity drives currency markets. Master Order Blocks, Imbalance/FVG fill entries, Break of Structure (BOS), and Change of Character (CHoCH) setups.")
                    .thumbnailUrl("https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80")
                    .level("INTERMEDIATE")
                    .category("TECHNICAL_ANALYSIS")
                    .accessType("PREMIUM")
                    .duration("6h 30m")
                    .rating(4.85)
                    .totalStudents(1560)
                    .published(true)
                    .instructorName("Elena Rostova")
                    .instructorTitle("Quantitative Market Analyst")
                    .instructorAvatar("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80")
                    .modules(List.of(
                            Course.CourseModule.builder()
                                    .id("mod-smc1")
                                    .title("Module 1: Liquidity & Order Flow")
                                    .description("Locating buy-side and sell-side liquidity pools.")
                                    .orderIndex(1)
                                    .lessons(List.of(
                                            Course.Lesson.builder()
                                                    .id("les-smc1")
                                                    .title("1.1 What is Fair Value Gap (FVG) and Imbalance?")
                                                    .slug("fair-value-gap-fvg")
                                                    .duration("20m")
                                                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                                                    .contentHtml("<p>Fair Value Gaps represent inefficiency in the market where only buyers or sellers were active. Prices frequently return to rebalance these gaps.</p>")
                                                    .freePreview(true)
                                                    .orderIndex(1)
                                                    .build()
                                    ))
                                    .build()
                    ))
                    .build();

            courseRepository.saveAll(List.of(course1, course2, course3));
            log.info("Successfully seeded starter Trading Academy courses!");
        }
    }
}
