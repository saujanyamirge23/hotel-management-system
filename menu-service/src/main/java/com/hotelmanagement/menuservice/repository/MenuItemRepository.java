package com.hotelmanagement.menuservice.repository;

import com.hotelmanagement.menuservice.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    
    List<MenuItem> findByIsAvailableTrue();
    
    List<MenuItem> findByCategory(MenuItem.MenuCategory category);
    
    List<MenuItem> findByCategoryAndIsAvailableTrue(MenuItem.MenuCategory category);
    
    List<MenuItem> findByIsVegetarianTrue();
    
    List<MenuItem> findByIsVeganTrue();
    
    List<MenuItem> findByIsSpicyTrue();
    
    List<MenuItem> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    @Query("SELECT m FROM MenuItem m WHERE m.isAvailable = true AND m.price <= :maxPrice ORDER BY m.price ASC")
    List<MenuItem> findAvailableItemsByMaxPrice(BigDecimal maxPrice);
    
    @Query("SELECT m FROM MenuItem m WHERE m.name LIKE %:keyword% OR m.description LIKE %:keyword%")
    List<MenuItem> searchByKeyword(String keyword);
    
    @Query("SELECT m FROM MenuItem m WHERE m.isAvailable = true AND " +
           "(:category IS NULL OR m.category = :category) AND " +
           "(:isVegetarian IS NULL OR m.isVegetarian = :isVegetarian) AND " +
           "(:isVegan IS NULL OR m.isVegan = :isVegan) AND " +
           "(:isSpicy IS NULL OR m.isSpicy = :isSpicy)")
    List<MenuItem> findByFilters(MenuItem.MenuCategory category, Boolean isVegetarian, Boolean isVegan, Boolean isSpicy);
}
