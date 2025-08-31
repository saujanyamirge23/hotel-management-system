package com.hotelmanagement.feedbackservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
public class Feedback {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Customer name is required")
    @Column(name = "customer_name", nullable = false)
    private String customerName;
    
    @Column(name = "customer_email")
    private String customerEmail;
    
    @Column(name = "customer_phone")
    private String customerPhone;
    
    @NotNull(message = "Overall rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    @Column(name = "overall_rating", nullable = false)
    private Integer overallRating;
    
    @Min(value = 1, message = "Food rating must be at least 1")
    @Max(value = 5, message = "Food rating must be at most 5")
    @Column(name = "food_rating")
    private Integer foodRating;
    
    @Min(value = 1, message = "Service rating must be at least 1")
    @Max(value = 5, message = "Service rating must be at most 5")
    @Column(name = "service_rating")
    private Integer serviceRating;
    
    @Min(value = 1, message = "Ambiance rating must be at least 1")
    @Max(value = 5, message = "Ambiance rating must be at most 5")
    @Column(name = "ambiance_rating")
    private Integer ambianceRating;
    
    @Column(name = "comments", length = 2000)
    private String comments;
    
    @Column(name = "suggestions", length = 2000)
    private String suggestions;
    
    @Column(name = "visit_date")
    private LocalDateTime visitDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "feedback_type", nullable = false)
    private FeedbackType feedbackType = FeedbackType.GENERAL;
    
    @Column(name = "is_anonymous", nullable = false)
    private Boolean isAnonymous = false;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum FeedbackType {
        GENERAL, COMPLAINT, COMPLIMENT, SUGGESTION
    }
    
    // Constructors
    public Feedback() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Feedback(String customerName, Integer overallRating, String comments) {
        this();
        this.customerName = customerName;
        this.overallRating = overallRating;
        this.comments = comments;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getCustomerName() {
        return customerName;
    }
    
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
    
    public String getCustomerEmail() {
        return customerEmail;
    }
    
    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }
    
    public String getCustomerPhone() {
        return customerPhone;
    }
    
    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }
    
    public Integer getOverallRating() {
        return overallRating;
    }
    
    public void setOverallRating(Integer overallRating) {
        this.overallRating = overallRating;
    }
    
    public Integer getFoodRating() {
        return foodRating;
    }
    
    public void setFoodRating(Integer foodRating) {
        this.foodRating = foodRating;
    }
    
    public Integer getServiceRating() {
        return serviceRating;
    }
    
    public void setServiceRating(Integer serviceRating) {
        this.serviceRating = serviceRating;
    }
    
    public Integer getAmbianceRating() {
        return ambianceRating;
    }
    
    public void setAmbianceRating(Integer ambianceRating) {
        this.ambianceRating = ambianceRating;
    }
    
    public String getComments() {
        return comments;
    }
    
    public void setComments(String comments) {
        this.comments = comments;
    }
    
    public String getSuggestions() {
        return suggestions;
    }
    
    public void setSuggestions(String suggestions) {
        this.suggestions = suggestions;
    }
    
    public LocalDateTime getVisitDate() {
        return visitDate;
    }
    
    public void setVisitDate(LocalDateTime visitDate) {
        this.visitDate = visitDate;
    }
    
    public FeedbackType getFeedbackType() {
        return feedbackType;
    }
    
    public void setFeedbackType(FeedbackType feedbackType) {
        this.feedbackType = feedbackType;
    }
    
    public Boolean getIsAnonymous() {
        return isAnonymous;
    }
    
    public void setIsAnonymous(Boolean isAnonymous) {
        this.isAnonymous = isAnonymous;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
