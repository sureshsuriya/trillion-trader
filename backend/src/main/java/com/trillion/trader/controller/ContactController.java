package com.trillion.trader.controller;

import com.trillion.trader.dto.ApiResponse;
import com.trillion.trader.model.ContactSubmission;
import com.trillion.trader.service.ContactSubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/contact")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Update in prod
public class ContactController {

    private final ContactSubmissionService service;

    @PostMapping
    public ResponseEntity<ApiResponse<ContactSubmission>> submitContactForm(@RequestBody ContactSubmission submission) {
        ContactSubmission saved = service.saveSubmission(submission);
        return ResponseEntity.ok(ApiResponse.success(saved, "Message sent successfully"));
    }

    // Admin endpoints (would be secured in Phase 6)
    @GetMapping
    public ResponseEntity<ApiResponse<List<ContactSubmission>>> getAllSubmissions() {
        return ResponseEntity.ok(ApiResponse.success(service.getAllSubmissions(), "Submissions retrieved"));
    }

    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<ContactSubmission>>> getUnreadSubmissions() {
        return ResponseEntity.ok(ApiResponse.success(service.getUnreadSubmissions(), "Unread submissions retrieved"));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable String id) {
        service.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Marked as read"));
    }
}
