import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from 'src/app/model/product/product';
import { Category } from 'src/app/model/category/category';
import { environment } from 'src/environment/environment';


@Injectable({
  providedIn: 'root',
})
export class ProductService {
  //private baseUrl = 'http://localhost:55420/storelink/api/products';
  private baseUrl = environment.apiUrl + '/products';

  constructor(private http: HttpClient) {}

  // Get all products
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  // Get product by ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  // Search products by name
  searchProducts(name: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/search?name=${name}`);
  }

  //------------------------ADMIN ACTIONS------------------------------------
  // Create new product (admin only)
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  // Update existing product (admin only)
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product);
  }

  // Delete product by ID (admin only)
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Método para obtener las categorías únicas desde el backend
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }
}
