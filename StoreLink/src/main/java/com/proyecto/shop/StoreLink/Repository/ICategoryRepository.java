package com.proyecto.shop.StoreLink.Repository;

import com.proyecto.shop.StoreLink.Model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ICategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findByName(String name);
}
