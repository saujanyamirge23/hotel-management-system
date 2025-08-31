package com.hotelmanagement.tableservice.repository;

import com.hotelmanagement.tableservice.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {
    
    List<RestaurantTable> findByStatus(RestaurantTable.TableStatus status);
    
    List<RestaurantTable> findByCapacityGreaterThanEqual(Integer capacity);
    
    Optional<RestaurantTable> findByTableNumber(Integer tableNumber);
    
    @Query("SELECT t FROM RestaurantTable t WHERE t.status = 'AVAILABLE' AND t.capacity >= :minCapacity ORDER BY t.capacity ASC")
    List<RestaurantTable> findAvailableTablesByMinCapacity(Integer minCapacity);
    
    @Query("SELECT COUNT(t) FROM RestaurantTable t WHERE t.status = 'AVAILABLE'")
    Long countAvailableTables();
    
    @Query("SELECT COUNT(t) FROM RestaurantTable t WHERE t.status = 'OCCUPIED'")
    Long countOccupiedTables();
}
