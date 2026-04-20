package com.proyecto.shop.StoreLink.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.shop.StoreLink.Dto.ProductRequest;
import com.proyecto.shop.StoreLink.Dto.ProductResponse;
import com.proyecto.shop.StoreLink.Exception.ResourceNotFoundException;
import com.proyecto.shop.StoreLink.Model.Category;
import com.proyecto.shop.StoreLink.Model.Product;
import com.proyecto.shop.StoreLink.Repository.ICategoryRepository;
import com.proyecto.shop.StoreLink.Repository.IProductRepository;


@Service
public class ProductService {

    @Autowired
    private IProductRepository productDao;

    @Autowired
    private ICategoryRepository categoryRepository;

    // Create a new product from ProductRequest
    public ProductResponse createProduct(ProductRequest request) {
        Product product = mapToEntity(request);
        Product savedProduct = productDao.save(product);
        return mapToResponse(savedProduct);
    }

    // Get all products as ProductResponse list
    public List<ProductResponse> getAllProducts() {
        return productDao.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get product by ID as ProductResponse
    public Optional<ProductResponse> getProductById(int id) {
        return productDao.findById(id).map(this::mapToResponse);
    }

    // Update product from ProductRequest
    public ProductResponse updateProduct(int id, ProductRequest request) {
        return productDao.findById(id).map(product -> {
            product.setProductName(request.getProductName());
            product.setDescription(request.getDescription());
            product.setPrice(request.getPrice());
            product.setQuantity(request.getQuantity());
            product.setImageUrl(request.getImageUrl());
            
            if (request.getCategoryId() != null) {
                Category category = categoryRepository.findById(request.getCategoryId())
                        .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + request.getCategoryId()));
                product.setCategory(category);
            }
            
            Product updated = productDao.save(product);
            return mapToResponse(updated);
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
    public List<ProductResponse> searchProductsByName(String name) {
        return productDao.findByProductNameContainingIgnoreCase(name).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    // Obtener la lista de categorías únicas directamente del repositorio
    public List<String> getAllCategories() {
        return productDao.findAllCategories();
    }

    // Map Product entity to ProductResponse
    private ProductResponse mapToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setProductId(product.getProductId());
        response.setProductName(product.getProductName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setQuantity(product.getQuantity());
        response.setImageUrl(product.getImageUrl());
        if (product.getCategory() != null) {
            response.setCategoryId(product.getCategory().getId());
            response.setCategoryName(product.getCategory().getName());
        }
        return response;
    }

    // Map ProductRequest to Product entity
    private Product mapToEntity(ProductRequest request) {
        Product product = new Product();
        product.setProductName(request.getProductName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setImageUrl(request.getImageUrl());
        
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + request.getCategoryId()));
            product.setCategory(category);
        }
        
        return product;
    }
}
