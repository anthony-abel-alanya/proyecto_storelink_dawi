import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-top-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './top-nav-bar.component.html',
})
export class TopNavBarComponent {
  cart: { [key: number]: number } = {};
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Load cart from localStorage if available
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
    }
  }

  isCustomerLoggedIn(): boolean {
    return this.authService.isCustomerLoggedIn();
  }

  isAdminLoggedIn(): boolean {
    return this.authService.isAdminLoggedIn();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']).then(() => {
      window.location.reload(); // refresh after navigation
    });
  }

  cartItemCount(): number {
    return Object.values(this.cart).reduce((total, qty) => total + qty, 0);
  }
}
