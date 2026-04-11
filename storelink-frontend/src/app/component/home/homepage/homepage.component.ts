import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CategoryPromotion } from 'src/app/model/category-promotions/category-promotion';
import { Product } from 'src/app/model/product/product';
import { AuthService } from 'src/app/service/auth/auth.service';
import { CategoryPromotionService } from 'src/app/service/category-promotions/category-promotion.service';
import { ProductService } from 'src/app/service/product/product.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  products: Product[] = [];
  promotions: CategoryPromotion[] = [];
  cart: {
    [productId: number]: {
      quantity: number;
      discountedPrice: number;
    };
  } = {};

  constructor(
    private productService: ProductService,
    private promotionService: CategoryPromotionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadPromotions();
    this.loadCart();
  }

  // Load all products
  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error('Failed to load products', err),
    });
  }

  // Load active promotions
  loadPromotions() {
    this.promotionService.getActivePromotions().subscribe({
      next: (data) => (this.promotions = data),
      error: (err) => console.error('Failed to load promotions', err),
    });
  }

  // Get discount % for a product based on its category
  getDiscountForProduct(product: Product): number | null {
    const promo = this.promotions.find(
      (p) =>
        p.category?.name?.toLowerCase() === product.category?.name?.toLowerCase()
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
