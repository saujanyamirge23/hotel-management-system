package com.hotelmanagement.feedbackservice.controller;

import com.hotelmanagement.feedbackservice.entity.Feedback;
import com.hotelmanagement.feedbackservice.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:3000")
public class FeedbackController {
    
    @Autowired
    private FeedbackService feedbackService;
    
    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        List<Feedback> feedback = feedbackService.getAllFeedback();
        return ResponseEntity.ok(feedback);
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Feedback>> getFeedbackByType(@PathVariable Feedback.FeedbackType type) {
        List<Feedback> feedback = feedbackService.getFeedbackByType(type);
        return ResponseEntity.ok(feedback);
    }
    
    @GetMapping("/rating/{rating}")
    public ResponseEntity<List<Feedback>> getFeedbackByRating(@PathVariable Integer rating) {
        List<Feedback> feedback = feedbackService.getFeedbackByRating(rating);
        return ResponseEntity.ok(feedback);
    }
    
    @GetMapping("/positive")
    public ResponseEntity<List<Feedback>> getPositiveFeedback() {
        List<Feedback> feedback = feedbackService.getPositiveFeedback();
        return ResponseEntity.ok(feedback);
    }
    
    @GetMapping("/recent/{days}")
    public ResponseEntity<List<Feedback>> getRecentFeedback(@PathVariable Integer days) {
        List<Feedback> feedback = feedbackService.getRecentFeedback(days);
        return ResponseEntity.ok(feedback);
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<Feedback>> getFeedbackBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<Feedback> feedback = feedbackService.getFeedbackBetweenDates(startDate, endDate);
        return ResponseEntity.ok(feedback);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable Long id) {
        Optional<Feedback> feedback = feedbackService.getFeedbackById(id);
        return feedback.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Feedback> createFeedback(@Valid @RequestBody Feedback feedback) {
        try {
            Feedback savedFeedback = feedbackService.saveFeedback(feedback);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedFeedback);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        boolean deleted = feedbackService.deleteFeedback(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // Analytics Endpoints
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getFeedbackAnalytics() {
        Map<String, Object> analytics = feedbackService.getFeedbackAnalytics();
        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/analytics/by-type")
    public ResponseEntity<Map<String, Long>> getFeedbackCountByType() {
        Map<String, Long> counts = feedbackService.getFeedbackCountByType();
        return ResponseEntity.ok(counts);
    }
    
    @GetMapping("/analytics/by-rating")
    public ResponseEntity<Map<String, Long>> getFeedbackCountByRating() {
        Map<String, Long> counts = feedbackService.getFeedbackCountByRating();
        return ResponseEntity.ok(counts);
    }
}
