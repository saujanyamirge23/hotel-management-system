package com.hotelmanagement.userservice.repository;

import com.hotelmanagement.userservice.entity.Chef;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChefRepository extends JpaRepository<Chef, Long> {
    
    List<Chef> findByIsActiveTrue();
    
    List<Chef> findByIsActiveFalse();
    
    Optional<Chef> findByEmail(String email);
    
    List<Chef> findBySpecialty(String specialty);
    
    @Query("SELECT c FROM Chef c WHERE c.isActive = true ORDER BY c.hireDate DESC")
    List<Chef> findActiveChefsByHireDate();
    
    @Query("SELECT c FROM Chef c WHERE c.experience >= :minExperience AND c.isActive = true")
    List<Chef> findActiveChefsByMinExperience(Integer minExperience);
}
