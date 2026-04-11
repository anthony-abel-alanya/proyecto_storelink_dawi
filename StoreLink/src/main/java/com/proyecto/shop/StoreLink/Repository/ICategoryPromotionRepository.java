package com.proyecto.shop.StoreLink.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyecto.shop.StoreLink.Model.CategoryPromotion;



public interface ICategoryPromotionRepository extends JpaRepository<CategoryPromotion, Integer> {
    List<CategoryPromotion> findByActiveTrue();
}
