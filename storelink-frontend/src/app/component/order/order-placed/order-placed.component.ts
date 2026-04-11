import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-placed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-placed.component.html',
  styleUrls: ['./order-placed.component.css'],
})
export class OrderPlacedComponent implements OnInit {
  orderId: number | null = null;
  totalAmount: number = 0;
  deliveryAddress: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const storedDetails = sessionStorage.getItem('orderDetails');

    if (storedDetails) {
      const { orderId, totalAmount, deliveryAddress } =
        JSON.parse(storedDetails);
      this.orderId = orderId;
      this.totalAmount = totalAmount;
      this.deliveryAddress = deliveryAddress;

      // Clear it so user can’t reload infinitely
      sessionStorage.removeItem('orderDetails');
    } else {
      // If reloaded or directly visited go home
      this.router.navigate(['/']);
    }
  }
}
