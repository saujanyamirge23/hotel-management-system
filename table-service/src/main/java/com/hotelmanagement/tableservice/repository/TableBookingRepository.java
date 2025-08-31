package com.hotelmanagement.tableservice.repository;

import com.hotelmanagement.tableservice.entity.TableBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TableBookingRepository extends JpaRepository<TableBooking, Long> {
    
    List<TableBooking> findByStatus(TableBooking.BookingStatus status);
    
    List<TableBooking> findByCustomerPhone(String customerPhone);
    
    @Query("SELECT b FROM TableBooking b WHERE b.status = 'WAITING' ORDER BY b.bookingTime ASC")
    List<TableBooking> findWaitingBookingsOrderByTime();
    
    @Query("SELECT b FROM TableBooking b WHERE b.status = 'SEATED' AND b.table.id = :tableId")
    List<TableBooking> findSeatedBookingsByTableId(Long tableId);
    
    @Query("SELECT COUNT(b) FROM TableBooking b WHERE b.status = 'WAITING'")
    Long countWaitingBookings();
    
    @Query("SELECT AVG(TIMESTAMPDIFF(MINUTE, b.bookingTime, b.actualSeatTime)) FROM TableBooking b WHERE b.actualSeatTime IS NOT NULL AND b.bookingTime >= :fromDate")
    Double getAverageWaitTimeFromDate(LocalDateTime fromDate);
    
    @Query("SELECT b FROM TableBooking b WHERE b.bookingTime BETWEEN :startTime AND :endTime ORDER BY b.bookingTime ASC")
    List<TableBooking> findBookingsBetweenTimes(LocalDateTime startTime, LocalDateTime endTime);
}
