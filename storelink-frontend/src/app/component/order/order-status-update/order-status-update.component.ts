import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order } from 'src/app/model/order/order';
import { OrderService } from 'src/app/service/order/order.service';

type OrderRow = Order & { selectedStatus?: string; initialStatus?: string };

@Component({
  selector: 'app-order-status-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-status-update.component.html',
  styleUrls: ['./order-status-update.component.css'],
})
export class OrderStatusUpdateComponent implements OnInit {
  orders: OrderRow[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  orderStatuses = ['PENDING', 'PROCESSING', 'DELIVERED', 'CANCELLED'];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders.map((order) => ({
          ...order,
          selectedStatus: order.orderStatus,
          initialStatus: order.orderStatus,
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching orders', err);
        this.errorMessage = 'No se pudieron cargar las órdenes.';
        this.loading = false;
      },
    });
  }

  statusChanged(order: OrderRow): boolean {
    return order.selectedStatus !== order.initialStatus;
  }

  onStatusChange(order: OrderRow, newStatus: string): void {
    order.selectedStatus = newStatus;
  }

  updateStatus(orderId: number, newStatus: string): void {
    const order = this.orders.find((item) => item.orderId === orderId);
    if (!order || order.selectedStatus === order.initialStatus) {
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';

    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (updatedOrder) => {
        order.orderStatus = updatedOrder.orderStatus;
        order.initialStatus = updatedOrder.orderStatus;
        order.selectedStatus = updatedOrder.orderStatus;
        this.successMessage = `Estado de la orden ${orderId} actualizado a ${updatedOrder.orderStatus}.`;
      },
      error: (err) => {
        console.error('Error updating order status', err);
        this.errorMessage = 'No se pudo actualizar el estado de la orden.';
      },
    });
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'DELIVERED':
        return 'badge bg-success';
      case 'SHIPPED':
        return 'badge bg-info text-dark';
      case 'PENDING':
        return 'badge bg-warning text-dark';
      case 'CANCELLED':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }
}
