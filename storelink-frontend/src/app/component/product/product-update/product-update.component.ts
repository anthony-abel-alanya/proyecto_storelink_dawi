import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from 'src/app/model/product/product';
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
  selectedProduct: Product | null = null;
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

  compareCategories(c1: Category, c2: Category): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
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
          this.selectedProduct = { ...product };
          // Nota: Al ser dinámico, si 'product.category' existe en 
          // 'this.categories', el combo se seleccionará solo.
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

    // Prepare product data for sending - only send category id
    const productToSend: any = {
      ...this.selectedProduct,
      category: this.selectedProduct.category ? { id: this.selectedProduct.category.id } : null
    };

    this.productService
      .updateProduct(this.productIdToEdit, productToSend)
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
