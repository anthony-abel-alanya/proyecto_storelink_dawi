// src/app/service/order-item.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderItem } from 'src/app/model/order-item/order-item';
import { environment } from 'src/environment/environment';


@Injectable({
  providedIn: 'root',
})
export class OrderItemService {
  //private baseUrl = 'http://localhost:55420/storelink/api/order-items';
  private baseUrl = environment.apiUrl + '/order-items';

  constructor(private http: HttpClient) {}

  // Create new order item (ADMIN or CUSTOMER)
  createOrderItem(orderItem: OrderItem): Observable<OrderItem> {
    return this.http.post<OrderItem>(`${this.baseUrl}`, orderItem);
  }

  // Get all order items (ADMIN only)
  getAllOrderItems(): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.baseUrl}`);
  }

  // Get order item by ID (ADMIN only)
  getOrderItemById(id: number): Observable<OrderItem> {
    return this.http.get<OrderItem>(`${this.baseUrl}/${id}`);
  }

  // Get all order items for a specific order (ADMIN or CUSTOMER)
  getItemsByOrderId(orderId: number): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.baseUrl}/order/${orderId}`);
  }

  // Get all order items for a specific product (ADMIN only)
  getItemsByProductId(productId: number): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.baseUrl}/product/${productId}`);
  }

  // Update an order item (ADMIN only)
  updateOrderItem(id: number, orderItem: OrderItem): Observable<OrderItem> {
    return this.http.put<OrderItem>(`${this.baseUrl}/${id}`, orderItem);
  }

  // Delete an order item (ADMIN only)
  deleteOrderItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
