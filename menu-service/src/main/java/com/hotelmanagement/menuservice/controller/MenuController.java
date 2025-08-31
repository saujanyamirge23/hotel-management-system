package com.hotelmanagement.menuservice.controller;

import com.hotelmanagement.menuservice.entity.MenuItem;
import com.hotelmanagement.menuservice.service.MenuService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "http://localhost:3000")
public class MenuController {
    
    @Autowired
    private MenuService menuService;
    
    @GetMapping
    public ResponseEntity<List<MenuItem>> getAllMenuItems() {
        List<MenuItem> menuItems = menuService.getAllMenuItems();
        return ResponseEntity.ok(menuItems);
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<MenuItem>> getAvailableMenuItems() {
        List<MenuItem> menuItems = menuService.getAvailableMenuItems();
        return ResponseEntity.ok(menuItems);
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<MenuItem>> getMenuItemsByCategory(@PathVariable MenuItem.MenuCategory category) {
        List<MenuItem> menuItems = menuService.getMenuItemsByCategory(category);
        return ResponseEntity.ok(menuItems);
    }
    
    @GetMapping("/vegetarian")
    public ResponseEntity<List<MenuItem>> getVegetarianItems() {
        List<MenuItem> menuItems = menuService.getVegetarianItems();
        return ResponseEntity.ok(menuItems);
    }
    
    @GetMapping("/vegan")
    public ResponseEntity<List<MenuItem>> getVeganItems() {
        List<MenuItem> menuItems = menuService.getVeganItems();
        return ResponseEntity.ok(menuItems);
    }
    
    @GetMapping("/spicy")
    public ResponseEntity<List<MenuItem>> getSpicyItems() {
        List<MenuItem> menuItems = menuService.getSpicyItems();
        return ResponseEntity.ok(menuItems);
    }
    
    @GetMapping("/price-range")
    public ResponseEntity<List<MenuItem>> getItemsByPriceRange(@RequestParam BigDecimal minPrice, 
                                                              @RequestParam BigDecimal maxPrice) {
        List<MenuItem> menuItems = menuService.getItemsByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(menuItems);
    }
    
    @GetMapping("/max-price/{maxPrice}")
    public ResponseEntity<List<MenuItem>> getItemsByMaxPrice(@PathVariable BigDecimal maxPrice) {
        List<MenuItem> menuItems = menuService.getItemsByMaxPrice(maxPrice);
        return ResponseEntity.ok(menuItems);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<MenuItem>> searchMenuItems(@RequestParam String keyword) {
        List<MenuItem> menuItems = menuService.searchMenuItems(keyword);
        return ResponseEntity.ok(menuItems);
    }
    
    @GetMapping("/filter")
    public ResponseEntity<List<MenuItem>> getFilteredMenuItems(
            @RequestParam(required = false) MenuItem.MenuCategory category,
            @RequestParam(required = false) Boolean isVegetarian,
            @RequestParam(required = false) Boolean isVegan,
            @RequestParam(required = false) Boolean isSpicy) {
        List<MenuItem> menuItems = menuService.getFilteredMenuItems(category, isVegetarian, isVegan, isSpicy);
        return ResponseEntity.ok(menuItems);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id) {
        Optional<MenuItem> menuItem = menuService.getMenuItemById(id);
        return menuItem.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<MenuItem> createMenuItem(@Valid @RequestBody MenuItem menuItem) {
        try {
            MenuItem savedMenuItem = menuService.saveMenuItem(menuItem);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedMenuItem);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long id, @Valid @RequestBody MenuItem menuItemDetails) {
        MenuItem updatedMenuItem = menuService.updateMenuItem(id, menuItemDetails);
        if (updatedMenuItem != null) {
            return ResponseEntity.ok(updatedMenuItem);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        boolean deleted = menuService.deleteMenuItem(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/toggle-availability")
    public ResponseEntity<MenuItem> toggleAvailability(@PathVariable Long id) {
        MenuItem updatedMenuItem = menuService.toggleAvailability(id);
        if (updatedMenuItem != null) {
            return ResponseEntity.ok(updatedMenuItem);
        }
        return ResponseEntity.notFound().build();
    }
}
