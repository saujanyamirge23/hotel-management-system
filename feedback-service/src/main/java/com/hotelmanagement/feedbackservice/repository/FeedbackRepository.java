package com.hotelmanagement.feedbackservice.repository;

import com.hotelmanagement.feedbackservice.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
    List<Feedback> findByFeedbackType(Feedback.FeedbackType feedbackType);
    
    List<Feedback> findByOverallRating(Integer rating);
    
    List<Feedback> findByOverallRatingGreaterThanEqual(Integer minRating);
    
    List<Feedback> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT AVG(f.overallRating) FROM Feedback f")
    Double getAverageOverallRating();
    
    @Query("SELECT AVG(f.foodRating) FROM Feedback f WHERE f.foodRating IS NOT NULL")
    Double getAverageFoodRating();
    
    @Query("SELECT AVG(f.serviceRating) FROM Feedback f WHERE f.serviceRating IS NOT NULL")
    Double getAverageServiceRating();
    
    @Query("SELECT AVG(f.ambianceRating) FROM Feedback f WHERE f.ambianceRating IS NOT NULL")
    Double getAverageAmbianceRating();
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.overallRating >= 4")
    Long countPositiveFeedback();
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.overallRating <= 2")
    Long countNegativeFeedback();
    
    @Query("SELECT f FROM Feedback f WHERE f.createdAt >= :fromDate ORDER BY f.createdAt DESC")
    List<Feedback> findRecentFeedback(LocalDateTime fromDate);
}
