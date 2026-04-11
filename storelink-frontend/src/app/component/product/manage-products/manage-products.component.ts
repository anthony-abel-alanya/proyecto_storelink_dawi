import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/model/product/product';
import { ProductService } from 'src/app/service/product/product.service';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css'],
})
export class ManageProductsComponent implements OnInit {
  allProducts: Product[] = [];
  displayedProducts: Product[] = [];
  searchTerm = '';
  loading = false;
  errorMessage = '';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.displayedProducts = products;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products', err);
        this.errorMessage = 'No se pudo cargar la lista de productos.';
        this.loading = false;
      },
    });
  }

  search(): void {
    const query = this.searchTerm.trim();
    if (!query) {
      this.displayedProducts = [...this.allProducts];
      return;
    }

    this.productService.searchProducts(query).subscribe({
      next: (products) => {
        this.displayedProducts = products;
      },
      error: (err) => {
        console.error('Error searching products', err);
        this.displayedProducts = this.allProducts.filter((product) =>
          product.productName.toLowerCase().includes(query.toLowerCase())
        );
      },
    });
  }

  deleteProduct(id: number): void {
    const confirmed = window.confirm('¿Estás seguro de eliminar este producto?');
    if (!confirmed) {
      return;
    }

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (err) => {
        console.error('Error deleting product', err);
        this.errorMessage = 'No se pudo eliminar el producto.';
      },
    });
  }

  editProduct(id: number): void {
    this.router.navigate(['/update-product'], { queryParams: { id } });
  }
}
