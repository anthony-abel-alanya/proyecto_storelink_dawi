import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductService } from 'src/app/service/product/product.service';
import { CategoryService } from 'src/app/service/category/category.service';
import { Product } from 'src/app/model/product/product';
import { Category } from 'src/app/model/category/category';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
})
export class ProductCreateComponent implements OnInit { 
  product: Product = {
    productName: '',
    description: '',
    price: 0,
    quantity: 0,
    category: null,
    imageUrl: '',
  };

  //Ahora recibimos objetos
  categories: Category[] = [];

  successMessage = '';
  errorMessage = '';
  submitted = false;

  constructor(private productService: ProductService, private categoryService: CategoryService) {}

  // el ngOnInit para cargar las categorías al abrir el formulario
  ngOnInit(): void {
    this.loadCategories();
  }

  // Método para traer las categorías de la tabla de promociones
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

    // Prepare product data for sending - only send category id to avoid validation issues
    const productToSend: any = {
      ...this.product,
      category: this.product.category ? { id: this.product.category.id } : null
    };

    this.productService.createProduct(productToSend).subscribe({
      next: (response) => {
        this.successMessage = `Product "${response.productName}" created successfully!`;
        form.resetForm();
        this.submitted = false;
        // Reset the product object
        this.product = {
          productName: '',
          description: '',
          price: 0,
          quantity: 0,
          category: null,
          imageUrl: '',
        };
        // Opcional: recargar categorías 
        this.loadCategories(); 
      },
      error: (err) => {
        console.error('Error creating product:', err);
        this.errorMessage = 'Failed to create product. Please try again.';
      },
    });
  }
}