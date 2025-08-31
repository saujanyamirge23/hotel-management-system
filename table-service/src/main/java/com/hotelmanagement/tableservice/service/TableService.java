package com.hotelmanagement.tableservice.service;

import com.hotelmanagement.tableservice.entity.RestaurantTable;
import com.hotelmanagement.tableservice.entity.TableBooking;
import com.hotelmanagement.tableservice.repository.RestaurantTableRepository;
import com.hotelmanagement.tableservice.repository.TableBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class TableService {
    
    @Autowired
    private RestaurantTableRepository tableRepository;
    
    @Autowired
    private TableBookingRepository bookingRepository;
    
    // Table Management
    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }
    
    public List<RestaurantTable> getAvailableTables() {
        return tableRepository.findByStatus(RestaurantTable.TableStatus.AVAILABLE);
    }
    
    public List<RestaurantTable> getAvailableTablesByCapacity(Integer minCapacity) {
        return tableRepository.findAvailableTablesByMinCapacity(minCapacity);
    }
    
    public Optional<RestaurantTable> getTableById(Long id) {
        return tableRepository.findById(id);
    }
    
    public RestaurantTable saveTable(RestaurantTable table) {
        return tableRepository.save(table);
    }
    
    public RestaurantTable updateTableStatus(Long tableId, RestaurantTable.TableStatus status) {
        Optional<RestaurantTable> optionalTable = tableRepository.findById(tableId);
        if (optionalTable.isPresent()) {
            RestaurantTable table = optionalTable.get();
            table.setStatus(status);
            return tableRepository.save(table);
        }
        return null;
    }
    
    // Booking Management
    public TableBooking createBooking(TableBooking booking) {
        booking.setEstimatedWaitTime(calculateEstimatedWaitTime(booking.getPartySize()));
        return bookingRepository.save(booking);
    }
    
    public List<TableBooking> getWaitingBookings() {
        return bookingRepository.findWaitingBookingsOrderByTime();
    }
    
    public List<TableBooking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    public Optional<TableBooking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }
    
    public TableBooking seatCustomer(Long bookingId, Long tableId) {
        Optional<TableBooking> optionalBooking = bookingRepository.findById(bookingId);
        Optional<RestaurantTable> optionalTable = tableRepository.findById(tableId);
        
        if (optionalBooking.isPresent() && optionalTable.isPresent()) {
            TableBooking booking = optionalBooking.get();
            RestaurantTable table = optionalTable.get();
            
            // Update booking
            booking.setTable(table);
            booking.setStatus(TableBooking.BookingStatus.SEATED);
            booking.setActualSeatTime(LocalDateTime.now());
            
            // Update table status
            table.setStatus(RestaurantTable.TableStatus.OCCUPIED);
            
            tableRepository.save(table);
            return bookingRepository.save(booking);
        }
        return null;
    }
    
    public TableBooking completeBooking(Long bookingId) {
        Optional<TableBooking> optionalBooking = bookingRepository.findById(bookingId);
        if (optionalBooking.isPresent()) {
            TableBooking booking = optionalBooking.get();
            booking.setStatus(TableBooking.BookingStatus.COMPLETED);
            booking.setCheckoutTime(LocalDateTime.now());
            
            // Free up the table
            if (booking.getTable() != null) {
                RestaurantTable table = booking.getTable();
                table.setStatus(RestaurantTable.TableStatus.AVAILABLE);
                tableRepository.save(table);
            }
            
            return bookingRepository.save(booking);
        }
        return null;
    }
    
    public boolean cancelBooking(Long bookingId) {
        Optional<TableBooking> optionalBooking = bookingRepository.findById(bookingId);
        if (optionalBooking.isPresent()) {
            TableBooking booking = optionalBooking.get();
            booking.setStatus(TableBooking.BookingStatus.CANCELLED);
            bookingRepository.save(booking);
            return true;
        }
        return false;
    }
    
    // Waiting Time Calculations
    public Integer calculateEstimatedWaitTime(Integer partySize) {
        Long waitingCount = bookingRepository.countWaitingBookings();
        Long availableTables = tableRepository.countAvailableTables();
        
        // Base wait time calculation
        int baseWaitTime = 15; // minutes per party ahead
        int partyAdjustment = partySize > 4 ? 10 : 0; // larger parties wait longer
        
        if (availableTables > 0) {
            return Math.max(5, (int) (waitingCount * baseWaitTime / Math.max(1, availableTables)) + partyAdjustment);
        } else {
            return (int) (waitingCount * baseWaitTime) + partyAdjustment + 20;
        }
    }
    
    public Double getAverageWaitTime() {
        LocalDateTime weekAgo = LocalDateTime.now().minus(7, ChronoUnit.DAYS);
        Double avgWaitTime = bookingRepository.getAverageWaitTimeFromDate(weekAgo);
        return avgWaitTime != null ? avgWaitTime : 0.0;
    }
    
    public Long getWaitingCount() {
        return bookingRepository.countWaitingBookings();
    }
    
    public Long getAvailableTableCount() {
        return tableRepository.countAvailableTables();
    }
    
    public Long getOccupiedTableCount() {
        return tableRepository.countOccupiedTables();
    }
}
