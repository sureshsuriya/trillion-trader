package com.trillion.trader.service;

import com.trillion.trader.model.ContactSubmission;
import com.trillion.trader.repository.ContactSubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactSubmissionService {
    
    private final ContactSubmissionRepository repository;
    
    public ContactSubmission saveSubmission(ContactSubmission submission) {
        submission.setRead(false);
        return repository.save(submission);
    }
    
    public List<ContactSubmission> getAllSubmissions() {
        return repository.findAll();
    }
    
    public List<ContactSubmission> getUnreadSubmissions() {
        return repository.findByReadFalse();
    }
    
    public void markAsRead(String id) {
        repository.findById(id).ifPresent(submission -> {
            submission.setRead(true);
            repository.save(submission);
        });
    }
}
