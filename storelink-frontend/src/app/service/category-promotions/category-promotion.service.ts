import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryPromotion } from 'src/app/model/category-promotions/category-promotion';
import { environment } from 'src/environment/environment';


@Injectable({
  providedIn: 'root',
})
export class CategoryPromotionService {
  //private baseUrl = 'http://localhost:55420/storelink/api/category-promotions';
  private baseUrl = environment.apiUrl + '/category-promotions';

  constructor(private http: HttpClient) {}

  //-------------------ADMIN ACTIONS------------------------------
  // Get all promotions (active + inactive)
  getAllPromotions(): Observable<CategoryPromotion[]> {
    return this.http.get<CategoryPromotion[]>(this.baseUrl);
  }

  // Get all active promotions
  getActivePromotions(): Observable<CategoryPromotion[]> {
    return this.http.get<CategoryPromotion[]>(`${this.baseUrl}/active`);
  }

  // Get promotion by ID
  getPromotionById(id: number): Observable<CategoryPromotion> {
    return this.http.get<CategoryPromotion>(`${this.baseUrl}/${id}`);
  }

  // Create new promotion
  createPromotion(promotion: CategoryPromotion): Observable<CategoryPromotion> {
    return this.http.post<CategoryPromotion>(this.baseUrl, promotion);
  }

  // Stop a promotion
  stopPromotion(id: number): Observable<CategoryPromotion> {
    return this.http.patch<CategoryPromotion>(`${this.baseUrl}/${id}/stop`, {});
  }

  // Delete promotion by ID
  deletePromotion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
