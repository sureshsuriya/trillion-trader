package com.trillion.trader.controller;

import com.trillion.trader.dto.ApiResponse;
import com.trillion.trader.model.Course;
import com.trillion.trader.model.UserProgress;
import com.trillion.trader.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Course>>> getAllCourses() {
        return ResponseEntity.ok(ApiResponse.success(courseService.getAllPublishedCourses(), "Courses retrieved successfully"));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<Course>>> getAllCoursesAdmin() {
        return ResponseEntity.ok(ApiResponse.success(courseService.getAllCoursesForAdmin(), "All admin courses retrieved successfully"));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<Course>> getCourseBySlug(@PathVariable String slug) {
        return courseService.getCourseBySlug(slug)
                .map(course -> ResponseEntity.ok(ApiResponse.success(course, "Course details retrieved")))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Course not found")));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Course>> getCourseById(@PathVariable String id) {
        return courseService.getCourseById(id)
                .map(course -> ResponseEntity.ok(ApiResponse.success(course, "Course details retrieved")))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Course not found")));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Course>> createCourse(@RequestBody Course course) {
        Course created = courseService.createCourse(course);
        return new ResponseEntity<>(ApiResponse.success(created, "Course created successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Course>> updateCourse(@PathVariable String id, @RequestBody Course course) {
        Course updated = courseService.updateCourse(id, course);
        return ResponseEntity.ok(ApiResponse.success(updated, "Course updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable String id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Course deleted successfully"));
    }

    @PostMapping("/{courseId}/progress")
    public ResponseEntity<ApiResponse<UserProgress>> updateProgress(
            @PathVariable String courseId,
            @RequestBody Map<String, String> payload) {
        String userId = payload.getOrDefault("userId", "guest-user");
        String lessonId = payload.get("lessonId");
        if (lessonId == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("lessonId is required"));
        }
        UserProgress progress = courseService.recordLessonCompletion(userId, courseId, lessonId);
        return ResponseEntity.ok(ApiResponse.success(progress, "Lesson completion recorded"));
    }

    @GetMapping("/{courseId}/progress")
    public ResponseEntity<ApiResponse<UserProgress>> getProgress(
            @PathVariable String courseId,
            @RequestParam(defaultValue = "guest-user") String userId) {
        return courseService.getUserProgress(userId, courseId)
                .map(p -> ResponseEntity.ok(ApiResponse.success(p, "User progress retrieved")))
                .orElseGet(() -> ResponseEntity.ok(ApiResponse.success(
                        UserProgress.builder()
                                .userId(userId)
                                .courseId(courseId)
                                .completedLessonIds(java.util.Collections.emptySet())
                                .progressPercentage(0)
                                .completed(false)
                                .build(),
                        "No progress found, returned empty"
                )));
    }
}
