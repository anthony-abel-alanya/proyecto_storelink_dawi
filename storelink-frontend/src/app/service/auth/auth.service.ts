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
    return this.http.post<any>(this.loginUrl, credentials).pipe(
      tap((response) => {
        const roles = response.user.allRoles.map((role: any) => role.roleName);
        localStorage.setItem('jwtToken', response.token); // Save JWT
        localStorage.setItem('userRole', roles); // Save user role (for now one user can't have multiple roles)

        if (localStorage.getItem('userRole') === 'CUSTOMER') {
          localStorage.setItem('userEmail', response.user.email); // Store customer email
        }
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
