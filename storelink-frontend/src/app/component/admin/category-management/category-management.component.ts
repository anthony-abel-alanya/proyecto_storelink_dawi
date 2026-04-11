import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Category } from 'src/app/model/category/category';
import { CategoryService } from 'src/app/service/category/category.service';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css'],
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  newCategory: Category = { name: '' };

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Failed to load categories', err),
    });
  }

  createCategory(form: NgForm): void {
    if (form.invalid) {
      alert('Please enter a category name.');
      return;
    }

    this.categoryService.createCategory(this.newCategory).subscribe({
      next: (category) => {
        alert(`Category "${category.name}" created successfully!`);
        this.newCategory = { name: '' };
        form.resetForm();
        this.loadCategories();
      },
      error: (err) => {
        console.error('Failed to create category', err);
        alert('Error creating category. It may already exist.');
      },
    });
  }

  deleteCategory(category: Category): void {
    if (!category.id) {
      return;
    }

    if (!confirm(`Delete category "${category.name}"?`)) {
      return;
    }

    this.categoryService.deleteCategory(category.id).subscribe({
      next: () => {
        alert(`Category "${category.name}" deleted successfully.`);
        this.loadCategories();
      },
      error: (err) => console.error('Failed to delete category', err),
    });
  }
}
