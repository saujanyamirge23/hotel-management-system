package com.hotelmanagement.menuservice.service;

import com.hotelmanagement.menuservice.entity.MenuItem;
import com.hotelmanagement.menuservice.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MenuService {
    
    @Autowired
    private MenuItemRepository menuItemRepository;
    
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }
    
    public List<MenuItem> getAvailableMenuItems() {
        return menuItemRepository.findByIsAvailableTrue();
    }
    
    public List<MenuItem> getMenuItemsByCategory(MenuItem.MenuCategory category) {
        return menuItemRepository.findByCategoryAndIsAvailableTrue(category);
    }
    
    public List<MenuItem> getVegetarianItems() {
        return menuItemRepository.findByIsVegetarianTrue();
    }
    
    public List<MenuItem> getVeganItems() {
        return menuItemRepository.findByIsVeganTrue();
    }
    
    public List<MenuItem> getSpicyItems() {
        return menuItemRepository.findByIsSpicyTrue();
    }
    
    public List<MenuItem> getItemsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return menuItemRepository.findByPriceBetween(minPrice, maxPrice);
    }
    
    public List<MenuItem> getItemsByMaxPrice(BigDecimal maxPrice) {
        return menuItemRepository.findAvailableItemsByMaxPrice(maxPrice);
    }
    
    public List<MenuItem> searchMenuItems(String keyword) {
        return menuItemRepository.searchByKeyword(keyword);
    }
    
    public List<MenuItem> getFilteredMenuItems(MenuItem.MenuCategory category, Boolean isVegetarian, Boolean isVegan, Boolean isSpicy) {
        return menuItemRepository.findByFilters(category, isVegetarian, isVegan, isSpicy);
    }
    
    public Optional<MenuItem> getMenuItemById(Long id) {
        return menuItemRepository.findById(id);
    }
    
    public MenuItem saveMenuItem(MenuItem menuItem) {
        if (menuItem.getId() == null) {
            menuItem.setCreatedAt(LocalDateTime.now());
        } else {
            menuItem.setUpdatedAt(LocalDateTime.now());
        }
        return menuItemRepository.save(menuItem);
    }
    
    public MenuItem updateMenuItem(Long id, MenuItem menuItemDetails) {
        Optional<MenuItem> optionalMenuItem = menuItemRepository.findById(id);
        if (optionalMenuItem.isPresent()) {
            MenuItem menuItem = optionalMenuItem.get();
            menuItem.setName(menuItemDetails.getName());
            menuItem.setDescription(menuItemDetails.getDescription());
            menuItem.setPrice(menuItemDetails.getPrice());
            menuItem.setCategory(menuItemDetails.getCategory());
            menuItem.setImageUrl(menuItemDetails.getImageUrl());
            menuItem.setPreparationTime(menuItemDetails.getPreparationTime());
            menuItem.setIsAvailable(menuItemDetails.getIsAvailable());
            menuItem.setIsVegetarian(menuItemDetails.getIsVegetarian());
            menuItem.setIsVegan(menuItemDetails.getIsVegan());
            menuItem.setIsSpicy(menuItemDetails.getIsSpicy());
            menuItem.setCalories(menuItemDetails.getCalories());
            menuItem.setIngredients(menuItemDetails.getIngredients());
            menuItem.setAllergens(menuItemDetails.getAllergens());
            menuItem.setUpdatedAt(LocalDateTime.now());
            return menuItemRepository.save(menuItem);
        }
        return null;
    }
    
    public boolean deleteMenuItem(Long id) {
        Optional<MenuItem> optionalMenuItem = menuItemRepository.findById(id);
        if (optionalMenuItem.isPresent()) {
            menuItemRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public MenuItem toggleAvailability(Long id) {
        Optional<MenuItem> optionalMenuItem = menuItemRepository.findById(id);
        if (optionalMenuItem.isPresent()) {
            MenuItem menuItem = optionalMenuItem.get();
            menuItem.setIsAvailable(!menuItem.getIsAvailable());
            menuItem.setUpdatedAt(LocalDateTime.now());
            return menuItemRepository.save(menuItem);
        }
        return null;
    }
}
