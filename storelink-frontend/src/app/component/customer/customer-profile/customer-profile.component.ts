import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer } from 'src/app/model/customer/customer';
import { CustomerService } from 'src/app/service/customer/customer-service.service';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css'],
})
export class CustomerProfileComponent implements OnInit {
  customer?: Customer;
  userEmail: string | null = null;
  loading = true;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail');

    if (this.userEmail) {
      this.customerService.getCustomerByEmail(this.userEmail).subscribe({
        next: (data) => {
          this.customer = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching customer:', err);
          this.loading = false;
        },
      });
    } else {
      alert('Please log in again.');
      this.loading = false;
    }
  }
}
