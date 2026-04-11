import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from 'src/app/model/product/product';
import { ProductService } from 'src/app/service/product/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: {
    [productId: number]: { quantity: number; discountedPrice: number };
  } = {};
  cartProducts: Product[] = [];
  totalAmount: number = 0;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    const storedCart = localStorage.getItem('cart');
    this.cart = storedCart ? JSON.parse(storedCart) : {};

    const productIds = Object.keys(this.cart).map((id) => +id);

    if (productIds.length === 0) {
      this.cartProducts = [];
      this.totalAmount = 0;
      return;
    }

    this.productService.getAllProducts().subscribe((products) => {
      this.cartProducts = products.filter((p) =>
        productIds.includes(p.productId!)
      );
      this.calculateTotal();
    });
  }

  calculateTotal() {
    this.totalAmount = this.cartProducts.reduce((sum, product) => {
      const cartItem = this.cart[product.productId!];
      if (!cartItem) return sum;
      return sum + cartItem.discountedPrice * cartItem.quantity;
    }, 0);
  }

  increment(productId: number) {
    const product = this.cartProducts.find((p) => p.productId === productId);
    if (!product) return;

    const cartItem = this.cart[productId];
    if (cartItem.quantity < product.quantity) {
      cartItem.quantity++;
      this.saveCart();
    } else {
      alert(`Maximum available stock reached for ${product.productName}!`);
    }
  }

  decrement(productId: number) {
    const cartItem = this.cart[productId];
    if (!cartItem) return;

    if (cartItem.quantity > 1) {
      cartItem.quantity--;
    } else {
      delete this.cart[productId];
      // Cart isn't a service so no subscribe option there
      // So real-time update it's not doing by removing product row from cart page ASAP
      window.location.reload();
    }
    this.saveCart();
  }

  remove(productId: number) {
    delete this.cart[productId];
    this.saveCart();
    window.location.reload(); // Same reason as decrement function above
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.calculateTotal();
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }
}
