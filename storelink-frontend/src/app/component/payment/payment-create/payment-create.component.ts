import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Payment } from 'src/app/model/payment/payment';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OrderRequest } from 'src/app/model/order/order-request';
import { OrderService } from 'src/app/service/order/order.service';
import { PaymentService } from 'src/app/service/payment/payment.service';
import { Product } from 'src/app/model/product/product';
import { OrderItemRequest } from 'src/app/model/order-item/order-item-request';

@Component({
  selector: 'app-payment-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './payment-create.component.html',
  styleUrls: ['./payment-create.component.css'],
})
export class PaymentCreateComponent implements OnInit {
  payment: Payment = {
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    otp: '',
    amount: 0,
  };

  cart: { [productId: number]: { quantity: number; discountedPrice: number } } =
    {};
  cartProducts: Product[] = [];
  totalAmount: number = 0;
  orderId: number | null = null;
  loading = false;
  errorMessage: string | null = null;
  deliveryAddress: string = '';

  constructor(
    private paymentService: PaymentService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // Load cart from local storage
  loadCart() {
    const storedCart = localStorage.getItem('cart');
    this.cart = storedCart ? JSON.parse(storedCart) : {};
    const storedProducts = localStorage.getItem('cartProducts');
    this.cartProducts = storedProducts ? JSON.parse(storedProducts) : [];

    this.totalAmount = Object.keys(this.cart).reduce((sum, id) => {
      const item = this.cart[+id];
      return sum + item.discountedPrice * item.quantity;
    }, 0);

    this.payment.amount = this.totalAmount;
  }

  validateForm(): boolean {
    if (!this.payment.cardholderName.trim()) {
      this.errorMessage = 'Cardholder name is required.';
      return false;
    }
    if (!/^[0-9]{16}$/.test(this.payment.cardNumber || '')) {
      this.errorMessage = 'Card number must be 16 digits.';
      return false;
    }
    if (!/^(0[1-9]|1[0-2])$/.test(this.payment.expiryMonth || '')) {
      this.errorMessage = 'Expiry month must be between 01 and 12.';
      return false;
    }
    if (!/^[0-9]{2}$/.test(this.payment.expiryYear || '')) {
      this.errorMessage = 'Expiry year must be 2 digits (e.g., 26).';
      return false;
    }
    if (!/^[0-9]{3}$/.test(this.payment.cvv || '')) {
      this.errorMessage = 'CVV must be 3 digits.';
      return false;
    }
    if (!/^[0-9]{6}$/.test(this.payment.otp || '')) {
      this.errorMessage = 'OTP must be 6 digits.';
      return false;
    }
    this.errorMessage = null;
    return true;
  }

  submitPayment() {
    if (!this.validateForm()) return;

    this.loading = true;

    this.paymentService.processPayment(this.payment).subscribe({
      next: (paymentResponse) => {
        const paymentId = paymentResponse.id!;
        console.log('Payment success:', paymentResponse);

        // Prepare Order Request
        const orderItems: OrderItemRequest[] = Object.keys(this.cart).map(
          (id) => ({
            productId: +id,
            quantity: this.cart[+id].quantity,
            productPrice: this.cart[+id].discountedPrice,
          })
        );

        const orderRequest: OrderRequest = {
          paymentId: paymentId,
          customerEmail: localStorage.getItem('userEmail')!,
          deliveryAddress: this.deliveryAddress,
          totalAmount: this.totalAmount,
          orderItems: orderItems,
        };

        // Place the order after payment success
        this.orderService.createOrder(orderRequest).subscribe({
          next: (orderResponse) => {
            this.orderId = orderResponse.orderId!;
            localStorage.removeItem('cart');
            localStorage.removeItem('cartProducts');
            this.loading = false;

            // Save order details in sessionStorage
            sessionStorage.setItem(
              'orderDetails',
              JSON.stringify({
                orderId: orderResponse.orderId,
                totalAmount: this.totalAmount,
                deliveryAddress: this.deliveryAddress,
              })
            );

            // Navigate to confirmation page
            this.router.navigate(['/order-placed']);
          },
          error: (err) => {
            this.loading = false;
            this.errorMessage = 'Order placement failed. Please try again.';
            console.error(err);
          },
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Payment failed. Please check your details.';
        console.error(err);
      },
    });
  }
}
