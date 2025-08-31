package com.hotelmanagement.feedbackservice.service;

import com.hotelmanagement.feedbackservice.entity.Feedback;
import com.hotelmanagement.feedbackservice.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class FeedbackService {
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }
    
    public List<Feedback> getFeedbackByType(Feedback.FeedbackType feedbackType) {
        return feedbackRepository.findByFeedbackType(feedbackType);
    }
    
    public List<Feedback> getFeedbackByRating(Integer rating) {
        return feedbackRepository.findByOverallRating(rating);
    }
    
    public List<Feedback> getPositiveFeedback() {
        return feedbackRepository.findByOverallRatingGreaterThanEqual(4);
    }
    
    public List<Feedback> getRecentFeedback(Integer days) {
        LocalDateTime fromDate = LocalDateTime.now().minus(days, ChronoUnit.DAYS);
        return feedbackRepository.findRecentFeedback(fromDate);
    }
    
    public List<Feedback> getFeedbackBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return feedbackRepository.findByCreatedAtBetween(startDate, endDate);
    }
    
    public Optional<Feedback> getFeedbackById(Long id) {
        return feedbackRepository.findById(id);
    }
    
    public Feedback saveFeedback(Feedback feedback) {
        if (feedback.getId() == null) {
            feedback.setCreatedAt(LocalDateTime.now());
        } else {
            feedback.setUpdatedAt(LocalDateTime.now());
        }
        return feedbackRepository.save(feedback);
    }
    
    public boolean deleteFeedback(Long id) {
        Optional<Feedback> optionalFeedback = feedbackRepository.findById(id);
        if (optionalFeedback.isPresent()) {
            feedbackRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    // Analytics Methods
    public Map<String, Object> getFeedbackAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        analytics.put("totalFeedback", feedbackRepository.count());
        analytics.put("averageOverallRating", feedbackRepository.getAverageOverallRating());
        analytics.put("averageFoodRating", feedbackRepository.getAverageFoodRating());
        analytics.put("averageServiceRating", feedbackRepository.getAverageServiceRating());
        analytics.put("averageAmbianceRating", feedbackRepository.getAverageAmbianceRating());
        analytics.put("positiveFeedbackCount", feedbackRepository.countPositiveFeedback());
        analytics.put("negativeFeedbackCount", feedbackRepository.countNegativeFeedback());
        
        return analytics;
    }
    
    public Map<String, Long> getFeedbackCountByType() {
        Map<String, Long> counts = new HashMap<>();
        for (Feedback.FeedbackType type : Feedback.FeedbackType.values()) {
            counts.put(type.name(), (long) feedbackRepository.findByFeedbackType(type).size());
        }
        return counts;
    }
    
    public Map<String, Long> getFeedbackCountByRating() {
        Map<String, Long> counts = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            counts.put(i + "_star", (long) feedbackRepository.findByOverallRating(i).size());
        }
        return counts;
    }
}
