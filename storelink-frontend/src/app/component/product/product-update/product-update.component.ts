import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductRequest } from 'src/app/model/product/product';
import { ProductService } from 'src/app/service/product/product.service';
import { CategoryService } from 'src/app/service/category/category.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Category } from 'src/app/model/category/category';

@Component({
  selector: 'app-product-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css'],
})
export class ProductUpdateComponent implements OnInit {
  allProducts: Product[] = [];
  productIdToEdit: number | null = null;
  // Use ProductRequest - contains categoryId (number) instead of category object
  selectedProduct: ProductRequest | null = null;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  //Inicializamos como array vacío para llenarlo desde el Back
  categories: Category[] = [];

  constructor(private productService: ProductService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadAllProducts();
    this.loadCategories();
  }

  // Método para obtener las categorías del servidor
  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Categorías dinámicas cargadas:', this.categories);
      },
      error: (err) => console.error('Error fetching categories', err),
    });
  }

  loadAllProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => (this.allProducts = products),
      error: (err) => console.error('Error fetching products', err),
    });
  }

  fetchProduct(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.selectedProduct = null;
    this.submitted = false;

    if (this.productIdToEdit != null) {
      this.productService.getProductById(this.productIdToEdit).subscribe({
        next: (product) => {
          // Convert ProductResponse (categoryName) to ProductRequest (categoryId)
          this.selectedProduct = {
            productName: product.productName,
            description: product.description || '',
            price: product.price,
            quantity: product.quantity,
            imageUrl: product.imageUrl,
            categoryId: 0 // Will be set below
          };
          
          // Find category id by name from the categories list
          const category = this.categories.find(c => c.name === product.categoryName);
          if (category && category.id) {
            this.selectedProduct.categoryId = category.id;
          }
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Product not found!';
        },
      });
    }
  }

  onSubmit(form: NgForm): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (form.invalid || !this.selectedProduct || !this.productIdToEdit) return;

    // Send ProductRequest directly - categoryId is already set
    this.productService
      .updateProduct(this.productIdToEdit, this.selectedProduct)
      .subscribe({
        next: (updatedProduct) => {
          this.successMessage = `Product "${updatedProduct.productName}" updated successfully!`;
          this.selectedProduct = null;
          this.productIdToEdit = null;
          form.resetForm();
          this.loadAllProducts(); // refresh table
          this.loadCategories();
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Failed to update product!';
        },
      });
  }
}
