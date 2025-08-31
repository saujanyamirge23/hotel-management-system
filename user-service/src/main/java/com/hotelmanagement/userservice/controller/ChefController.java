package com.hotelmanagement.userservice.controller;

import com.hotelmanagement.userservice.entity.Chef;
import com.hotelmanagement.userservice.service.ChefService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chefs")
@CrossOrigin(origins = "http://localhost:3000")
public class ChefController {
    
    @Autowired
    private ChefService chefService;
    
    @GetMapping
    public ResponseEntity<List<Chef>> getAllChefs() {
        List<Chef> chefs = chefService.getAllChefs();
        return ResponseEntity.ok(chefs);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<Chef>> getActiveChefs() {
        List<Chef> chefs = chefService.getActiveChefs();
        return ResponseEntity.ok(chefs);
    }
    
    @GetMapping("/inactive")
    public ResponseEntity<List<Chef>> getInactiveChefs() {
        List<Chef> chefs = chefService.getInactiveChefs();
        return ResponseEntity.ok(chefs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Chef> getChefById(@PathVariable Long id) {
        Optional<Chef> chef = chefService.getChefById(id);
        return chef.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<Chef> getChefByEmail(@PathVariable String email) {
        Optional<Chef> chef = chefService.getChefByEmail(email);
        return chef.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/specialty/{specialty}")
    public ResponseEntity<List<Chef>> getChefsBySpecialty(@PathVariable String specialty) {
        List<Chef> chefs = chefService.getChefsBySpecialty(specialty);
        return ResponseEntity.ok(chefs);
    }
    
    @GetMapping("/experience/{minExperience}")
    public ResponseEntity<List<Chef>> getChefsByMinExperience(@PathVariable Integer minExperience) {
        List<Chef> chefs = chefService.getChefsByMinExperience(minExperience);
        return ResponseEntity.ok(chefs);
    }
    
    @PostMapping
    public ResponseEntity<Chef> createChef(@Valid @RequestBody Chef chef) {
        try {
            Chef savedChef = chefService.saveChef(chef);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedChef);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Chef> updateChef(@PathVariable Long id, @Valid @RequestBody Chef chefDetails) {
        Chef updatedChef = chefService.updateChef(id, chefDetails);
        if (updatedChef != null) {
            return ResponseEntity.ok(updatedChef);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChef(@PathVariable Long id) {
        boolean deleted = chefService.deleteChef(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/reactivate")
    public ResponseEntity<Void> reactivateChef(@PathVariable Long id) {
        boolean reactivated = chefService.reactivateChef(id);
        if (reactivated) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
