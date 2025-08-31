package com.hotelmanagement.tableservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "table_bookings")
public class TableBooking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Customer name is required")
    @Column(name = "customer_name", nullable = false)
    private String customerName;
    
    @NotBlank(message = "Customer phone is required")
    @Column(name = "customer_phone", nullable = false)
    private String customerPhone;
    
    @NotNull(message = "Party size is required")
    @Column(name = "party_size", nullable = false)
    private Integer partySize;
    
    @NotNull(message = "Booking time is required")
    @Column(name = "booking_time", nullable = false)
    private LocalDateTime bookingTime;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_id")
    private RestaurantTable table;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.WAITING;
    
    @Column(name = "estimated_wait_time")
    private Integer estimatedWaitTime; // in minutes
    
    @Column(name = "actual_seat_time")
    private LocalDateTime actualSeatTime;
    
    @Column(name = "checkout_time")
    private LocalDateTime checkoutTime;
    
    @Column(name = "special_requests")
    private String specialRequests;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum BookingStatus {
        WAITING, SEATED, COMPLETED, CANCELLED
    }
    
    // Constructors
    public TableBooking() {
        this.createdAt = LocalDateTime.now();
    }
    
    public TableBooking(String customerName, String customerPhone, Integer partySize, LocalDateTime bookingTime) {
        this();
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.partySize = partySize;
        this.bookingTime = bookingTime;
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
    
    public String getCustomerPhone() {
        return customerPhone;
    }
    
    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }
    
    public Integer getPartySize() {
        return partySize;
    }
    
    public void setPartySize(Integer partySize) {
        this.partySize = partySize;
    }
    
    public LocalDateTime getBookingTime() {
        return bookingTime;
    }
    
    public void setBookingTime(LocalDateTime bookingTime) {
        this.bookingTime = bookingTime;
    }
    
    public RestaurantTable getTable() {
        return table;
    }
    
    public void setTable(RestaurantTable table) {
        this.table = table;
    }
    
    public BookingStatus getStatus() {
        return status;
    }
    
    public void setStatus(BookingStatus status) {
        this.status = status;
    }
    
    public Integer getEstimatedWaitTime() {
        return estimatedWaitTime;
    }
    
    public void setEstimatedWaitTime(Integer estimatedWaitTime) {
        this.estimatedWaitTime = estimatedWaitTime;
    }
    
    public LocalDateTime getActualSeatTime() {
        return actualSeatTime;
    }
    
    public void setActualSeatTime(LocalDateTime actualSeatTime) {
        this.actualSeatTime = actualSeatTime;
    }
    
    public LocalDateTime getCheckoutTime() {
        return checkoutTime;
    }
    
    public void setCheckoutTime(LocalDateTime checkoutTime) {
        this.checkoutTime = checkoutTime;
    }
    
    public String getSpecialRequests() {
        return specialRequests;
    }
    
    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
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
