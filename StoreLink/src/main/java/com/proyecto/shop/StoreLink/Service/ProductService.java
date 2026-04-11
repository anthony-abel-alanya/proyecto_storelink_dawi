package com.proyecto.shop.StoreLink.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.shop.StoreLink.Exception.ResourceNotFoundException;
import com.proyecto.shop.StoreLink.Model.Product;
import com.proyecto.shop.StoreLink.Repository.IProductRepository;


@Service
public class ProductService {

    @Autowired
    private IProductRepository productDao;

    // Create a new product
    public Product createProduct(Product product) {
        return productDao.save(product);
    }

    // Get all products
    public List<Product> getAllProducts() {
        return productDao.findAll();
    }

    // Get product by ID
    public Optional<Product> getProductById(int id) {
        return productDao.findById(id);
    }

    // Update product
    public Product updateProduct(int id, Product updatedProduct) {
        return productDao.findById(id).map(product -> {
            product.setProductName(updatedProduct.getProductName());
            product.setDescription(updatedProduct.getDescription());
            product.setPrice(updatedProduct.getPrice());
            product.setQuantity(updatedProduct.getQuantity());
            product.setCategory(updatedProduct.getCategory());
            product.setImageUrl(updatedProduct.getImageUrl());
            return productDao.save(product);
        }).orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + id));
    }

    // Delete product by ID
    public void deleteProduct(int id) {
        if (!productDao.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id " + id);
        }
        productDao.deleteById(id);
    }
    
    // Search product by name (case-insensitive)
    public List<Product> searchProductsByName(String name) {
        return productDao.findByProductNameContainingIgnoreCase(name);
    }
    
    // Obtener la lista de categorías únicas directamente del repositorio
    public List<String> getAllCategories() {
        return productDao.findAllCategories();
    }
}
