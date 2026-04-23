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

  // Edition
  editingCategory: Category | null = null;
  editedName: string = '';
  isEditing = false;

  // Messages
  successMessage = '';
  errorMessage = '';

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
    this.successMessage = '';
    this.errorMessage = '';

    if (form.invalid) {
      this.errorMessage = 'Por favor ingrese un nombre de categoría.';
      return;
    }

    this.categoryService.createCategory(this.newCategory).subscribe({
      next: (category) => {
        this.successMessage = `Categoría "${category.name}" creada exitosamente!`;
        this.newCategory = { name: '' };
        form.resetForm();
        this.loadCategories();
      },
      error: (err) => {
        console.error('Failed to create category', err);
        this.errorMessage = 'Error al crear categoría. Ya podría existir.';
      },
    });
  }

  // Start editing
  startEdit(category: Category): void {
    this.editingCategory = category;
    this.editedName = category.name;
    this.isEditing = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Cancel edit
  cancelEdit(): void {
    this.editingCategory = null;
    this.editedName = '';
    this.isEditing = false;
  }

  // Save edit
  saveEdit(): void {
    if (!this.editingCategory || !this.editingCategory.id) {
      return;
    }

    if (!this.editedName.trim()) {
      this.errorMessage = 'El nombre no puede estar vacío.';
      return;
    }

    const updatedCategory: Category = {
      id: this.editingCategory.id,
      name: this.editedName.trim()
    };

    this.categoryService.updateCategory(this.editingCategory.id, updatedCategory).subscribe({
      next: (category) => {
        this.successMessage = `Categoría "${category.name}" actualizada exitosamente!`;
        this.cancelEdit();
        this.loadCategories();
      },
      error: (err) => {
        console.error('Failed to update category', err);
        this.errorMessage = 'Error al actualizar categoría. Ya podría existir otro con ese nombre.';
      },
    });
  }

  deleteCategory(category: Category): void {
    if (!category.id) {
      return;
    }

    if (!confirm(`¿Eliminar categoría "${category.name}"?`)) {
      return;
    }

    this.categoryService.deleteCategory(category.id).subscribe({
      next: () => {
        this.successMessage = `Categoría "${category.name}" eliminada exitosamente.`;
        this.loadCategories();
      },
      error: (err) => console.error('Failed to delete category', err),
    });
  }
}
