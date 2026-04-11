import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderRequest } from 'src/app/model/order/order-request';
import { Order } from 'src/app/model/order/order';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  //private baseUrl = 'http://localhost:55420/storelink/api/orders';
  private baseUrl = environment.apiUrl + '/orders';

  constructor(private http: HttpClient) {}

  // Create a new order (ADMIN or CUSTOMER)
  createOrder(orderRequest: OrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}`, orderRequest);
  }

  // Get all orders (ADMIN only)
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}`);
  }

  // Get order by ID (ADMIN only)
  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${orderId}`);
  }

  // Get all orders of a specific customer (ADMIN or CUSTOMER)
  getOrdersByCustomerId(customerId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/customer/${customerId}`);
  }

  // Update order status (ADMIN only)
  updateOrderStatus(orderId: number, orderStatus: string): Observable<Order> {
    return this.http.put<Order>(
      `${this.baseUrl}/${orderId}/status?orderStatus=${orderStatus}`,
      {}
    );
  }

  // Delete order (ADMIN only)
  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${orderId}`);
  }

  getOrdersByCustomerEmail(email: string): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${this.baseUrl}/customer/email/${encodeURIComponent(email)}`
    );
  }

  cancelOrder(orderId: number): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${orderId}/cancel`, {});
  }
}
