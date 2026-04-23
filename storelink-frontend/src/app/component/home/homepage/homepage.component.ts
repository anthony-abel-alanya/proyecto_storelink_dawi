import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CategoryPromotion } from 'src/app/model/category-promotions/category-promotion';
import { Product } from 'src/app/model/product/product';
import { Category } from 'src/app/model/category/category';
import { AuthService } from 'src/app/service/auth/auth.service';
import { CategoryPromotionService } from 'src/app/service/category-promotions/category-promotion.service';
import { ProductService } from 'src/app/service/product/product.service';
import { CategoryService } from 'src/app/service/category/category.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  // All products
  products: Product[] = [];
  // Filtered products for display
  filteredProducts: Product[] = [];
  // Active promotions
  promotions: CategoryPromotion[] = [];
  // List of categories for the filter
  categories: Category[] = [];
  // Shopping cart
  cart: {
    [productId: number]: {
      quantity: number;
      discountedPrice: number;
    };
  } = {};

  // Filter variables
  searchTerm = '';
  filterCategory = '';
  filterPriceMin: number | null = null;
  filterPriceMax: number | null = null;
  filterStockMin: number | null = null;
  filterStockMax: number | null = null;

  // PAGINATION
  currentPage = 1;
  pageSize = 9; // puedes usar 6, 9 o 12
  totalItems = 0;
  totalPages = 0;
  paginatedProducts: Product[] = [];

  pageSizeOptions = [6, 9, 12, 18];

  constructor(
    private productService: ProductService,
    private promotionService: CategoryPromotionService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadPromotions();
    this.loadCategories();
    this.loadCart();
  }

  // Load all products
  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
      },
      error: (err) => console.error('Failed to load products', err),
    });
  }

  // Load categories for filter
  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Failed to load categories', err),
    });
  }

  // Load active promotions
  loadPromotions() {
    this.promotionService.getActivePromotions().subscribe({
      next: (data) => (this.promotions = data),
      error: (err) => console.error('Failed to load promotions', err),
    });
  }

  // Apply filters in real-time
  applyFilters(): void {
    this.filteredProducts = this.products.filter((product) => {
      // Filter by name (partial search, case-insensitive)
      const matchesName =
        !this.searchTerm ||
        product.productName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (product.author && product.author.toLowerCase().includes(this.searchTerm.toLowerCase()));

      // Filter by category
      const matchesCategory =
        !this.filterCategory ||
        product.categoryName?.toLowerCase() === this.filterCategory.toLowerCase();

      // Filter by price range
      const matchesPriceMin =
        this.filterPriceMin === null || product.price >= this.filterPriceMin;
      const matchesPriceMax =
        this.filterPriceMax === null || product.price <= this.filterPriceMax;
      const matchesPrice = matchesPriceMin && matchesPriceMax;

      // Filter by stock range
      const matchesStockMin =
        this.filterStockMin === null || product.quantity >= this.filterStockMin;
      const matchesStockMax =
        this.filterStockMax === null || product.quantity <= this.filterStockMax;
      const matchesStock = matchesStockMin && matchesStockMax;

      return matchesName && matchesCategory && matchesPrice && matchesStock;
    });

    // IMPORTANT: reset paginación
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalItems = this.filteredProducts.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize) || 1;

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedProducts = this.filteredProducts.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Clear all filters
  clearFilters(): void {
    this.searchTerm = '';
    this.filterCategory = '';
    this.filterPriceMin = null;
    this.filterPriceMax = null;
    this.filterStockMin = null;
    this.filterStockMax = null;
    this.applyFilters();
  }

  // Get discount % for a product based on its categoryId (robust comparison)
  getDiscountForProduct(product: Product): number | null {
    const promo = this.promotions.find(
      (p) => p.categoryId === product.categoryId
    );
    return promo ? promo.discountPercentage : null;
  }

  // Calculate discounted price
  getDiscountedPrice(product: Product): number {
    const discount = this.getDiscountForProduct(product);
    if (discount) {
      return product.price - product.price * (discount / 100);
    }
    return product.price;
  }

  // Cart management
  loadCart() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
    }
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  isInCart(productId: number): boolean {
    return !!this.cart[productId] && this.cart[productId].quantity > 0;
  }

  addToCart(product: Product) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const discountedPrice = this.getDiscountedPrice(product);

    if (!this.cart[product.productId!]) {
      this.cart[product.productId!] = {
        quantity: 1,
        discountedPrice: discountedPrice,
      };
    } else {
      // If product already in cart, just increment
      this.increment(product.productId!);
    }

    this.saveCart();
  }

  increment(productId: number) {
    const product = this.products.find((p) => p.productId === productId);
    if (!product) return;

    if (this.cart[productId].quantity < product.quantity) {
      this.cart[productId].quantity++;
      this.cart[productId].discountedPrice = this.getDiscountedPrice(product);
      this.saveCart();
    } else {
      alert(`Maximum available stock reached for ${product.productName}!`);
    }
  }

  decrement(productId: number) {
    if (this.cart[productId].quantity > 1) {
      this.cart[productId].quantity--;
    } else {
      delete this.cart[productId];
    }
    this.saveCart();
  }

  removeFromCart(productId: number) {
    delete this.cart[productId];
    this.saveCart();
  }

  // Optional: calculate total for cart display
  getCartTotal(): number {
    return Object.values(this.cart).reduce(
      (total, item) => total + item.quantity * item.discountedPrice,
      0
    );
  }
}
