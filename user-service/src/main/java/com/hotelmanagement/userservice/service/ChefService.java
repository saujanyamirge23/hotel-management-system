package com.hotelmanagement.userservice.service;

import com.hotelmanagement.userservice.entity.Chef;
import com.hotelmanagement.userservice.repository.ChefRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ChefService {
    
    @Autowired
    private ChefRepository chefRepository;
    
    public List<Chef> getAllChefs() {
        return chefRepository.findAll();
    }
    
    public List<Chef> getActiveChefs() {
        return chefRepository.findByIsActiveTrue();
    }
    
    public List<Chef> getInactiveChefs() {
        return chefRepository.findByIsActiveFalse();
    }
    
    public Optional<Chef> getChefById(Long id) {
        return chefRepository.findById(id);
    }
    
    public Optional<Chef> getChefByEmail(String email) {
        return chefRepository.findByEmail(email);
    }
    
    public List<Chef> getChefsBySpecialty(String specialty) {
        return chefRepository.findBySpecialty(specialty);
    }
    
    public Chef saveChef(Chef chef) {
        if (chef.getId() == null) {
            chef.setCreatedAt(LocalDateTime.now());
            chef.setHireDate(LocalDateTime.now());
        } else {
            chef.setUpdatedAt(LocalDateTime.now());
        }
        return chefRepository.save(chef);
    }
    
    public Chef updateChef(Long id, Chef chefDetails) {
        Optional<Chef> optionalChef = chefRepository.findById(id);
        if (optionalChef.isPresent()) {
            Chef chef = optionalChef.get();
            chef.setName(chefDetails.getName());
            chef.setEmail(chefDetails.getEmail());
            chef.setPhone(chefDetails.getPhone());
            chef.setSpecialty(chefDetails.getSpecialty());
            chef.setExperience(chefDetails.getExperience());
            chef.setUpdatedAt(LocalDateTime.now());
            return chefRepository.save(chef);
        }
        return null;
    }
    
    public boolean deleteChef(Long id) {
        Optional<Chef> optionalChef = chefRepository.findById(id);
        if (optionalChef.isPresent()) {
            Chef chef = optionalChef.get();
            chef.setIsActive(false);
            chef.setUpdatedAt(LocalDateTime.now());
            chefRepository.save(chef);
            return true;
        }
        return false;
    }
    
    public boolean reactivateChef(Long id) {
        Optional<Chef> optionalChef = chefRepository.findById(id);
        if (optionalChef.isPresent()) {
            Chef chef = optionalChef.get();
            chef.setIsActive(true);
            chef.setUpdatedAt(LocalDateTime.now());
            chefRepository.save(chef);
            return true;
        }
        return false;
    }
    
    public List<Chef> getChefsByMinExperience(Integer minExperience) {
        return chefRepository.findActiveChefsByMinExperience(minExperience);
    }
}
