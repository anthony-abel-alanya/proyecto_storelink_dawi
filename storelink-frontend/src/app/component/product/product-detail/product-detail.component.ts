import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from 'src/app/model/product/product';
import { CategoryPromotion } from 'src/app/model/category-promotions/category-promotion';
import { ProductService } from 'src/app/service/product/product.service';
import { CategoryPromotionService } from 'src/app/service/category-promotions/category-promotion.service';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  promotions: CategoryPromotion[] = [];
  loading = true;
  errorMessage = '';

  // cart
  cart: {
    [productId: number]: {
      quantity: number;
      discountedPrice: number;
    };
  } = {};

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private promotionService: CategoryPromotionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.loadPromotions();
    this.loadProduct();
  }

  loadProduct(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(+productId).subscribe({
        next: (data) => {
          this.product = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading product', err);
          this.errorMessage = 'Producto no encontrado';
          this.loading = false;
        },
      });
    }
  }

  loadPromotions(): void {
    this.promotionService.getActivePromotions().subscribe({
      next: (data) => (this.promotions = data),
      error: (err) => console.error('Failed to load promotions', err),
    });
  }

  // Get discount % for this product
  getDiscountForProduct(): number | null {
    if (!this.product) return null;
    const promo = this.promotions.find(
      (p) => p.categoryId === this.product!.categoryId
    );
    return promo ? promo.discountPercentage : null;
  }

  // Calculate discounted price
  getDiscountedPrice(): number {
    if (!this.product) return 0;
    const discount = this.getDiscountForProduct();
    if (discount) {
      return this.product.price - this.product.price * (discount / 100);
    }
    return this.product.price;
  }

  // Cart management
  loadCart(): void {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
    }
  }

  saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  isInCart(): boolean {
    if (!this.product?.productId) return false;
    return (
      !!this.cart[this.product.productId] &&
      this.cart[this.product.productId].quantity > 0
    );
  }

  getCartQuantity(): number {
    if (!this.product?.productId) return 0;
    return this.cart[this.product.productId]?.quantity || 0;
  }

  addToCart(): void {
    if (!this.product || !this.product.productId) return;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const productId = this.product.productId;
    const discountedPrice = this.getDiscountedPrice();

    if (!this.cart[productId]) {
      this.cart[productId] = {
        quantity: 1,
        discountedPrice: discountedPrice,
      };
    } else {
      this.increment();
    }

    this.saveCart();
  }

  increment(): void {
    if (!this.product || !this.product.productId) return;

    const productId = this.product.productId;
    if (this.cart[productId].quantity < this.product.quantity) {
      this.cart[productId].quantity++;
      this.cart[productId].discountedPrice = this.getDiscountedPrice();
      this.saveCart();
    } else {
      alert(`Stock máximo alcanzado para ${this.product.productName}!`);
    }
  }

  decrement(): void {
    if (!this.product || !this.product.productId) return;

    const productId = this.product.productId;
    if (this.cart[productId].quantity > 1) {
      this.cart[productId].quantity--;
    } else {
      delete this.cart[productId];
    }
    this.saveCart();
  }

  removeFromCart(): void {
    if (!this.product || !this.product.productId) return;
    delete this.cart[this.product.productId];
    this.saveCart();
  }
}