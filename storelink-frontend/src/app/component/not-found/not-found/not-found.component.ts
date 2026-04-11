import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
})
export class NotFoundComponent {
  constructor(private authService: AuthService, private router: Router) {}

  redirect() {
    if (this.authService.isAdminLoggedIn()) {
      this.router.navigate(['/admin-home']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
