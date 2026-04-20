package com.proyecto.shop.StoreLink.Controller;



import jakarta.validation.Valid;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.proyecto.shop.StoreLink.Dto.CategoryPromotionRequest;
import com.proyecto.shop.StoreLink.Dto.CategoryPromotionResponse;
import com.proyecto.shop.StoreLink.Exception.ResourceNotFoundException;
import com.proyecto.shop.StoreLink.Model.Category;
import com.proyecto.shop.StoreLink.Model.CategoryPromotion;
import com.proyecto.shop.StoreLink.Repository.ICategoryRepository;
import com.proyecto.shop.StoreLink.Service.CategoryPromotionService;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/category-promotions")
public class CategoryPromotionController {

    private static final Logger logger = LoggerFactory.getLogger(CategoryPromotionController.class);

    private final CategoryPromotionService promotionService;
    private final ICategoryRepository categoryRepository;

    @Autowired
    public CategoryPromotionController(CategoryPromotionService promotionService, ICategoryRepository categoryRepository) {
        this.promotionService = promotionService;
        this.categoryRepository = categoryRepository;
    }

    // Create a new category promotion
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<CategoryPromotionResponse> createPromotion(
            @Valid @RequestBody CategoryPromotionRequest request) {

        logger.info("Creating new category promotion for category ID: {}", request.getCategoryId());
        
        // Build CategoryPromotion entity from request DTO
        CategoryPromotion promotion = new CategoryPromotion();
        promotion.setDiscountPercentage(request.getDiscountPercentage());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        promotion.setActive(request.isActive());
        
        // Set category from categoryId
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));
        promotion.setCategory(category);
        
        CategoryPromotion savedPromotion = promotionService.createPromotion(promotion);
        logger.info("Category promotion created successfully with ID: {}", savedPromotion.getId());
        
        // Return the created promotion as DTO
        return ResponseEntity.ok(promotionService.getPromotionById(savedPromotion.getId()));
    }

    // Get all active category promotions 
    // (don't restrict access here, everyone should be able to see discounts)
    @GetMapping("/active")
    public ResponseEntity<List<CategoryPromotionResponse>> getActivePromotions() {
        logger.info("Fetching all active category promotions...");
        List<CategoryPromotionResponse> activePromotions = promotionService.getActivePromotions();

        if (activePromotions.isEmpty()) {
            logger.info("No active category promotions found.");
            return ResponseEntity.ok(Collections.emptyList());
        }

        logger.info("Found {} active promotions.", activePromotions.size());
        return ResponseEntity.ok(activePromotions);
    }

    // Get all promotions (admin view)
    @GetMapping
    public ResponseEntity<List<CategoryPromotionResponse>> getAllPromotions() {
        logger.info("Fetching all category promotions...");
        List<CategoryPromotionResponse> promotions = promotionService.getAllPromotions();
        return ResponseEntity.ok(promotions);
    }

    // Stop a category promotion
    @PreAuthorize("hasAuthority('ADMIN')")
    @PatchMapping("/{id}/stop")
    public ResponseEntity<CategoryPromotionResponse> stopPromotion(@PathVariable int id) {
        logger.info("Stopping category promotion with ID: {}", id);
        CategoryPromotionResponse stoppedPromotion = promotionService.stopPromotion(id);
        logger.info("Category promotion with ID {} stopped successfully.", id);
        return ResponseEntity.ok(stoppedPromotion);
    }

    // Get promotion by ID
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<CategoryPromotionResponse> getPromotionById(@PathVariable int id) {
        logger.info("Fetching category promotion with ID: {}", id);
        CategoryPromotionResponse promotion = promotionService.getPromotionById(id);

        if (promotion == null) {
            logger.warn("Category promotion not found with ID: {}", id);
            throw new ResourceNotFoundException("Category promotion not found with ID: " + id);
        }

        logger.info("Category promotion found with ID: {}", id);
        return ResponseEntity.ok(promotion);
    }

    // Delete promotion
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable int id) {
        logger.info("Deleting promotion with ID: {}", id);
        promotionService.deletePromotion(id);
        logger.info("Promotion deleted successfully with ID: {}", id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}
