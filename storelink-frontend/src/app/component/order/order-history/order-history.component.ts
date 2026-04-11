import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from 'src/app/model/order/order';
import { OrderService } from 'src/app/service/order/order.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  userEmail: string | null = null;
  loading: boolean = true;
  cancellingOrderId: number | null = null; // Track which order is being cancelled

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail');

    if (!this.userEmail) {
      alert('Please log in again.');
      this.loading = false;
      return;
    }

    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrdersByCustomerEmail(this.userEmail!).subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
        console.log('Orders:', data);
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        alert('Failed to load your orders. Please try again later.');
        this.loading = false;
      },
    });
  }

  // Cancel order
  cancelOrder(orderId: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.cancellingOrderId = orderId;

      this.orderService.cancelOrder(orderId).subscribe({
        next: (updatedOrder) => {
          alert(
            `Order ID: ${updatedOrder.orderId} has been cancelled successfully.`
          );

          // Update local state to reflect change instantly
          const order = this.orders.find((o) => o.orderId === orderId);
          if (order) {
            order.orderStatus = 'CANCELLED';
          }

          this.cancellingOrderId = null;
        },
        error: (err) => {
          console.error('Error cancelling order:', err);
          alert('Failed to cancel the order. Please try again.');
          this.cancellingOrderId = null;
        },
      });
    }
  }
}
