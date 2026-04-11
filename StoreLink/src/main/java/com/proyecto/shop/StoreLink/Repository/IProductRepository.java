package com.proyecto.shop.StoreLink.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.proyecto.shop.StoreLink.Model.Product;




@Repository
public interface IProductRepository extends JpaRepository<Product, Integer> {
	
	// Search product by name (case insensitive, substring name allowed)
    List<Product> findByProductNameContainingIgnoreCase(String productName);
    
    // ESTO ES LO QUE DEBES AGREGAR:
    @Query(value = "SELECT DISTINCT category FROM category_promotions", nativeQuery = true)
    List<String> findAllCategories();
}

