import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductService } from 'src/app/service/product/product.service';
import { CategoryService } from 'src/app/service/category/category.service';
import { ProductRequest } from 'src/app/model/product/product';
import { Category } from 'src/app/model/category/category';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
})
export class ProductCreateComponent implements OnInit { 
  // Use ProductRequest - send categoryId instead of category object
  product: ProductRequest = {
    productName: '',
    description: '',
    author: '',
    price: 0,
    quantity: 0,
    imageUrl: '',
    categoryId: 0,
  };

  // Store categories for the dropdown
  categories: Category[] = [];

  successMessage = '';
  errorMessage = '';
  submitted = false;

  constructor(private productService: ProductService, private categoryService: CategoryService) {}

  // Use ngOnInit to load the categories when the form opens
  ngOnInit(): void {
    this.loadCategories();
  }

  // Method for retrieving categories from the promotions table
  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Categorías dinámicas cargadas en registro:', this.categories);
      },
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (form.invalid) {
      this.errorMessage = 'Please correct the errors before submitting.';
      return;
    }

    // Send ProductRequest directly - categoryId is already set from the form
    this.productService.createProduct(this.product).subscribe({
      next: (response) => {
        this.successMessage = `Product "${response.productName}" created successfully!`;
        form.resetForm();
        this.submitted = false;
        // Reset the product object
        this.product = {
          productName: '',
          description: '',
          author: '',
          price: 0,
          quantity: 0,
          imageUrl: '',
          categoryId: 0,
        };
        // Optional: Reload categories 
        this.loadCategories(); 
      },
      error: (err) => {
        console.error('Error creating product:', err);
        this.errorMessage = 'Failed to create product. Please try again.';
      },
    });
  }
}