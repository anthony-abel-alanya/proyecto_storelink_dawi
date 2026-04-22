import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
})
export class AdminHomeComponent {
  constructor(private router: Router) {}

  addProduct() {
    this.router.navigate(['/add-product']);
  }

  updateProduct() {
    this.router.navigate(['/update-product']);
  }

  promotions() {
    this.router.navigate(['/promotions']);
  }

  categoryManagement() {
    this.router.navigate(['/categories']);
  }

  updateOrderStatus() {
    this.router.navigate(['/order-status-update']);
  }

  manageUsers() {
    this.router.navigate(['/user-management']);
  }
}
