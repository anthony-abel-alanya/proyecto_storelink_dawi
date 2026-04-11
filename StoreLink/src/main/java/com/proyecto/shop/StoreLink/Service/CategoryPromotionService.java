package com.proyecto.shop.StoreLink.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.shop.StoreLink.Exception.ResourceNotFoundException;
import com.proyecto.shop.StoreLink.Model.Category;
import com.proyecto.shop.StoreLink.Model.CategoryPromotion;
import com.proyecto.shop.StoreLink.Repository.ICategoryPromotionRepository;
import com.proyecto.shop.StoreLink.Repository.ICategoryRepository;

import java.util.List;

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

    // Get all active promotions
    public List<CategoryPromotion> getActivePromotions() {
        return categoryPromotionDao.findByActiveTrue();
    }


    // Stop a promotion
    public CategoryPromotion stopPromotion(int id) {
        CategoryPromotion promo = categoryPromotionDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found with id: " + id));
        promo.setActive(false);
        return categoryPromotionDao.save(promo);
    }

    // Get promotion by ID
    public CategoryPromotion getPromotionById(int id) {
        return categoryPromotionDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found with id: " + id));
    }

    // Get all promotions (active + inactive)
    public List<CategoryPromotion> getAllPromotions() {
        return categoryPromotionDao.findAll();
    }
    
    // Delete promotion by ID
    public void deletePromotion(int id) {
        if (!categoryPromotionDao.existsById(id)) {
            throw new ResourceNotFoundException("Promotion not found with id " + id);
        }
        categoryPromotionDao.deleteById(id);
    }
}
