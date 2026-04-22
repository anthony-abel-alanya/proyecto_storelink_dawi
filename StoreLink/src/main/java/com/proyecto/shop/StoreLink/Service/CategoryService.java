package com.proyecto.shop.StoreLink.Service;

import com.proyecto.shop.StoreLink.Exception.ResourceNotFoundException;
import com.proyecto.shop.StoreLink.Model.Category;
import com.proyecto.shop.StoreLink.Repository.ICategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.data.domain.Sort;

@Service
public class CategoryService {

    @Autowired
    private ICategoryRepository categoryDao;

    public Category createCategory(Category category) {
        return categoryDao.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryDao.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    public Category getCategoryById(int id) {
        return categoryDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    public Category updateCategory(int id, Category category) {
        Category existingCategory = getCategoryById(id);
        existingCategory.setName(category.getName());
        return categoryDao.save(existingCategory);
    }

    public void deleteCategory(int id) {
        if (!categoryDao.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryDao.deleteById(id);
    }
}
