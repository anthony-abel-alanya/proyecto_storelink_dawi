import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from 'src/app/model/payment/payment';
import { environment } from 'src/environment/environment';


@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  //private baseUrl = 'http://localhost:55420/storelink/api/payments';
  private baseUrl = environment.apiUrl + '/payments';

  constructor(private http: HttpClient) {}

  // Process a new payment (POST /api/payments)
  processPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.baseUrl, payment);
  }

  // Get all payments
  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.baseUrl);
  }

  // Get payment by ID
  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/${id}`);
  }
}
