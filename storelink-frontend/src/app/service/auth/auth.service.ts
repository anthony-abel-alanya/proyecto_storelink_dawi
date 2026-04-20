import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from 'src/app/model/login/login-request';
import { SignupRequest } from 'src/app/model/signup/signup-request';
import { environment } from 'src/environment/environment';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //private loginUrl = 'http://localhost:55420/storelink/api/auth';
  private loginUrl = environment.apiUrl + '/auth';

  //private signupUrl = 'http://localhost:55420/storelink/api/customers';
  private signupUrl = environment.apiUrl + '/customers';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<any> {
    // Now response is AuthResponse: { token, email, roles }
    return this.http.post<any>(this.loginUrl, credentials).pipe(
      tap((response) => {
        // Store only token, email, and role - no password or user object
        localStorage.setItem('jwtToken', response.token);
        localStorage.setItem('userEmail', response.email);
        
        // Get the first role (assuming single role for now)
        const role = response.roles && response.roles.length > 0 ? response.roles[0] : null;
        localStorage.setItem('userRole', role);
      })
    );
  }

  signup(customer: SignupRequest): Observable<any> {
    return this.http.post<any>(this.signupUrl, customer);
  }

  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('cart');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  isAdminLoggedIn(): boolean {
    return this.isLoggedIn() && this.getRole() === 'ADMIN';
  }

  isCustomerLoggedIn(): boolean {
    return this.isLoggedIn() && this.getRole() === 'CUSTOMER';
  }
}
