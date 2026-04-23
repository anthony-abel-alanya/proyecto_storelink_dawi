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
  // Original data
  allProducts: Product[] = [];
  categories: Category[] = [];

  // Product selected for editing
  selectedProduct: ProductRequest | null = null;
  selectedProductId: number | null = null;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  // Search filters
  filterName = '';
  filterCategory = '';
  filterPriceMin: number | null = null;
  filterPriceMax: number | null = null;
  filterStockMin: number | null = null;
  filterStockMax: number | null = null;

  // Filtered products (to display in the table)
  filteredProducts: Product[] = [];

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  paginatedProducts: Product[] = [];

  // Page size options
  pageSizeOptions = [5, 10, 25, 50];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadAllProducts();
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Error fetching categories', err),
    });
  }

  loadAllProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.applyFilters();
      },
      error: (err) => console.error('Error fetching products', err),
    });
  }

  // Reset pagination when editing (to update the table)
  refreshTable(): void {
    this.loadAllProducts();
  }

  // Apply filters in real time
  applyFilters(): void {
    this.filteredProducts = this.allProducts.filter(product => {
      // Filter by name (partial search, case-insensitive)
      const matchesName = !this.filterName || 
        product.productName.toLowerCase().includes(this.filterName.toLowerCase());

      // Filter by category
      const matchesCategory = !this.filterCategory || 
        product.categoryName?.toLowerCase() === this.filterCategory.toLowerCase();

      // Filter by price range
      const matchesPriceMin = this.filterPriceMin === null || 
        product.price >= this.filterPriceMin;
      const matchesPriceMax = this.filterPriceMax === null || 
        product.price <= this.filterPriceMax;
      const matchesPrice = matchesPriceMin && matchesPriceMax;

      // Filter by stock range
      const matchesStockMin = this.filterStockMin === null || 
        product.quantity >= this.filterStockMin;
      const matchesStockMax = this.filterStockMax === null || 
        product.quantity <= this.filterStockMax;
      const matchesStock = matchesStockMin && matchesStockMax;

      return matchesName && matchesCategory && matchesPrice && matchesStock;
    });

    // Reset pagination when applying filters
    this.currentPage = 1;
    this.updatePagination();
  }

  // Update pagination
  updatePagination(): void {
    this.totalItems = this.filteredProducts.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize) || 1;
    
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  // Change page
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  // Change page size
  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  // Get page numbers to display
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Clear all filters
  clearFilters(): void {
    this.filterName = '';
    this.filterCategory = '';
    this.filterPriceMin = null;
    this.filterPriceMax = null;
    this.filterStockMin = null;
    this.filterStockMax = null;
    this.applyFilters();
  }

  // Select product to edit
  editProduct(product: Product): void {
    this.selectedProductId = product.productId ?? null;
    this.selectedProduct = {
      productName: product.productName,
      description: product.description || '',
      author: product.author || '',
      price: product.price,
      quantity: product.quantity,
      imageUrl: product.imageUrl,
      categoryId: 0
    };

    // Search for category ID by name
    const category = this.categories.find(c => c.name === product.categoryName);
    if (category && category.id) {
      this.selectedProduct.categoryId = category.id;
    }

    this.successMessage = '';
    this.errorMessage = '';
    this.submitted = false;

    // Scroll to the form
    setTimeout(() => {
      document.getElementById('edit-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  // Cancel edit
  cancelEdit(): void {
    this.selectedProduct = null;
    this.selectedProductId = null;
    this.submitted = false;
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Save changes
  onSubmit(form: NgForm): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (form.invalid || !this.selectedProduct || !this.selectedProductId) {
      return;
    }

    this.productService
      .updateProduct(this.selectedProductId, this.selectedProduct)
      .subscribe({
        next: (updatedProduct) => {
          this.successMessage = `Producto "${updatedProduct.productName}" actualizado exitosamente!`;
          this.selectedProduct = null;
          this.selectedProductId = null;
          form.resetForm();
          this.refreshTable();
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al actualizar el producto.';
        },
      });
  }
}
