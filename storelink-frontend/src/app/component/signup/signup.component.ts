import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer } from 'src/app/model/customer/customer';
import { CustomerService } from 'src/app/service/customer/customer-service.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  newCustomer: Customer = {
    name: '',
    email: '',
    phone: '',
    password: '',
  };

  password = '';
  confirmPassword = '';

  successMessage = '';
  errorMessage = '';

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  onSubmit() {
    if (!this.passwordsMatch()) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.newCustomer.password = this.password;

    this.customerService.createCustomer(this.newCustomer).subscribe({
      next: (res) => {
        this.successMessage = 'Account created successfully!';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Signup failed. Please try again.';
      },
    });
  }
}
