package com.hotelmanagement.tableservice.controller;

import com.hotelmanagement.tableservice.entity.RestaurantTable;
import com.hotelmanagement.tableservice.entity.TableBooking;
import com.hotelmanagement.tableservice.service.TableService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "http://localhost:3000")
public class TableController {
    
    @Autowired
    private TableService tableService;
    
    // Table Management Endpoints
    @GetMapping
    public ResponseEntity<List<RestaurantTable>> getAllTables() {
        List<RestaurantTable> tables = tableService.getAllTables();
        return ResponseEntity.ok(tables);
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<RestaurantTable>> getAvailableTables() {
        List<RestaurantTable> tables = tableService.getAvailableTables();
        return ResponseEntity.ok(tables);
    }
    
    @GetMapping("/available/{capacity}")
    public ResponseEntity<List<RestaurantTable>> getAvailableTablesByCapacity(@PathVariable Integer capacity) {
        List<RestaurantTable> tables = tableService.getAvailableTablesByCapacity(capacity);
        return ResponseEntity.ok(tables);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<RestaurantTable> getTableById(@PathVariable Long id) {
        Optional<RestaurantTable> table = tableService.getTableById(id);
        return table.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<RestaurantTable> createTable(@Valid @RequestBody RestaurantTable table) {
        try {
            RestaurantTable savedTable = tableService.saveTable(table);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedTable);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<RestaurantTable> updateTableStatus(@PathVariable Long id, 
                                                           @RequestParam RestaurantTable.TableStatus status) {
        RestaurantTable updatedTable = tableService.updateTableStatus(id, status);
        if (updatedTable != null) {
            return ResponseEntity.ok(updatedTable);
        }
        return ResponseEntity.notFound().build();
    }
    
    // Booking Management Endpoints
    @PostMapping("/book")
    public ResponseEntity<TableBooking> createBooking(@Valid @RequestBody TableBooking booking) {
        try {
            TableBooking savedBooking = tableService.createBooking(booking);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBooking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @GetMapping("/bookings")
    public ResponseEntity<List<TableBooking>> getAllBookings() {
        List<TableBooking> bookings = tableService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/bookings/waiting")
    public ResponseEntity<List<TableBooking>> getWaitingBookings() {
        List<TableBooking> bookings = tableService.getWaitingBookings();
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/bookings/{id}")
    public ResponseEntity<TableBooking> getBookingById(@PathVariable Long id) {
        Optional<TableBooking> booking = tableService.getBookingById(id);
        return booking.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/bookings/{bookingId}/seat/{tableId}")
    public ResponseEntity<TableBooking> seatCustomer(@PathVariable Long bookingId, @PathVariable Long tableId) {
        TableBooking seatedBooking = tableService.seatCustomer(bookingId, tableId);
        if (seatedBooking != null) {
            return ResponseEntity.ok(seatedBooking);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/bookings/{id}/complete")
    public ResponseEntity<TableBooking> completeBooking(@PathVariable Long id) {
        TableBooking completedBooking = tableService.completeBooking(id);
        if (completedBooking != null) {
            return ResponseEntity.ok(completedBooking);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        boolean cancelled = tableService.cancelBooking(id);
        if (cancelled) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // Waiting Time and Statistics Endpoints
    @GetMapping("/waiting-time")
    public ResponseEntity<Map<String, Object>> getWaitingTimeInfo() {
        Map<String, Object> waitingInfo = new HashMap<>();
        waitingInfo.put("averageWaitTime", tableService.getAverageWaitTime());
        waitingInfo.put("currentWaitingCount", tableService.getWaitingCount());
        waitingInfo.put("availableTableCount", tableService.getAvailableTableCount());
        waitingInfo.put("occupiedTableCount", tableService.getOccupiedTableCount());
        return ResponseEntity.ok(waitingInfo);
    }
    
    @GetMapping("/waiting-time/{partySize}")
    public ResponseEntity<Map<String, Integer>> getEstimatedWaitTime(@PathVariable Integer partySize) {
        Integer estimatedTime = tableService.calculateEstimatedWaitTime(partySize);
        Map<String, Integer> response = new HashMap<>();
        response.put("estimatedWaitTime", estimatedTime);
        return ResponseEntity.ok(response);
    }
}
