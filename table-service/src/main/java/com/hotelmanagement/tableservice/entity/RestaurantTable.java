package com.hotelmanagement.tableservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "restaurant_tables")
public class RestaurantTable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Table number is required")
    @Column(name = "table_number", nullable = false, unique = true)
    private Integer tableNumber;
    
    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    @Column(nullable = false)
    private Integer capacity;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TableStatus status = TableStatus.AVAILABLE;
    
    @Column(name = "location_description")
    private String locationDescription;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum TableStatus {
        AVAILABLE, OCCUPIED, RESERVED, OUT_OF_ORDER
    }
    
    // Constructors
    public RestaurantTable() {
        this.createdAt = LocalDateTime.now();
    }
    
    public RestaurantTable(Integer tableNumber, Integer capacity, String locationDescription) {
        this();
        this.tableNumber = tableNumber;
        this.capacity = capacity;
        this.locationDescription = locationDescription;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Integer getTableNumber() {
        return tableNumber;
    }
    
    public void setTableNumber(Integer tableNumber) {
        this.tableNumber = tableNumber;
    }
    
    public Integer getCapacity() {
        return capacity;
    }
    
    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }
    
    public TableStatus getStatus() {
        return status;
    }
    
    public void setStatus(TableStatus status) {
        this.status = status;
    }
    
    public String getLocationDescription() {
        return locationDescription;
    }
    
    public void setLocationDescription(String locationDescription) {
        this.locationDescription = locationDescription;
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
