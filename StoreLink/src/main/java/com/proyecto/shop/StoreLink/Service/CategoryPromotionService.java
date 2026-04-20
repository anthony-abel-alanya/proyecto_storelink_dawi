package com.proyecto.shop.StoreLink.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.shop.StoreLink.Dto.CategoryPromotionResponse;
import com.proyecto.shop.StoreLink.Exception.ResourceNotFoundException;
import com.proyecto.shop.StoreLink.Model.Category;
import com.proyecto.shop.StoreLink.Model.CategoryPromotion;
import com.proyecto.shop.StoreLink.Model.PromotionStatus;
import com.proyecto.shop.StoreLink.Repository.ICategoryPromotionRepository;
import com.proyecto.shop.StoreLink.Repository.ICategoryRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryPromotionService {

    @Autowired
    private ICategoryPromotionRepository categoryPromotionDao;

    @Autowired
    private ICategoryRepository categoryDao;

    public CategoryPromotion createPromotion(CategoryPromotion promotion) {
        // Validamos que nos envíen la categoría y su ID
        if (promotion.getCategory() == null || promotion.getCategory().getId() <= 0) {
            throw new IllegalArgumentException("Se requiere una categoría válida con un ID existente.");
        }

        // Buscamos la categoría en la DB. Si no existe, la promoción no se puede crear.
        Category category = categoryDao.findById(promotion.getCategory().getId())
                .orElseThrow(() -> new ResourceNotFoundException("La categoría seleccionada no existe."));

        // Vinculamos la categoría encontrada (que ya viene de la DB) y guardamos
        promotion.setCategory(category);
        return categoryPromotionDao.save(promotion);
    }

    public List<CategoryPromotionResponse> getActivePromotions() {
        return categoryPromotionDao.findAll().stream()
                .filter(p -> calculateStatus(p) == PromotionStatus.ACTIVE)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get all promotions (active + inactive) with status calculated
    public List<CategoryPromotionResponse> getAllPromotions() {
        return categoryPromotionDao.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get promotion by ID
    public CategoryPromotionResponse getPromotionById(int id) {
        CategoryPromotion promo = categoryPromotionDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found with id: " + id));
        return mapToResponse(promo);
    }

    // Stop a promotion
    public CategoryPromotionResponse stopPromotion(int id) {
        CategoryPromotion promo = categoryPromotionDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found with id: " + id));
        promo.setActive(false);
        return mapToResponse(categoryPromotionDao.save(promo));
    }
    
    // Delete promotion by ID
    public void deletePromotion(int id) {
        if (!categoryPromotionDao.existsById(id)) {
            throw new ResourceNotFoundException("Promotion not found with id " + id);
        }
        categoryPromotionDao.deleteById(id);
    }

    // Calculate status based on active flag and dates - returns enum
    public PromotionStatus calculateStatus(CategoryPromotion promo) {
        if (!promo.isActive()) {
            return PromotionStatus.STOPPED;
        }
        
        LocalDateTime now = LocalDateTime.now();
        
        if (promo.getStartDate().isAfter(now)) {
            return PromotionStatus.PENDING;
        }
        
        if (promo.getEndDate().isBefore(now)) {
            return PromotionStatus.EXPIRED;
        }
        
        return PromotionStatus.ACTIVE;
    }

    // Map CategoryPromotion entity to CategoryPromotionResponse DTO
    private CategoryPromotionResponse mapToResponse(CategoryPromotion promo) {
        CategoryPromotionResponse response = new CategoryPromotionResponse();
        response.setId(promo.getId());
        response.setCategoryId(promo.getCategory() != null ? promo.getCategory().getId() : null);
        response.setCategoryName(promo.getCategory() != null ? promo.getCategory().getName() : null);
        response.setDiscountPercentage(promo.getDiscountPercentage());
        response.setStartDate(promo.getStartDate());
        response.setEndDate(promo.getEndDate());
        response.setActive(promo.isActive());
        response.setStatus(calculateStatus(promo));
        return response;
    }
}
