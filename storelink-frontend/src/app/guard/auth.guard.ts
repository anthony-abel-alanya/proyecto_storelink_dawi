import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../service/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const adminLoggedIn = this.authService.isAdminLoggedIn();
    const customerLoggedIn = this.authService.isCustomerLoggedIn();
    const allowedRoles = route.data['roles']; // e.g., ['ADMIN', 'CUSTOMER']

    // If logged in person is admin, then they're authorized to go to any route
    if (adminLoggedIn) {
      return true;
    } else if (customerLoggedIn && allowedRoles.includes('CUSTOMER')) {
      return true; // if customer is logged in and route has customer access, then allow access
    } else {
      alert('Unauthorized access! Returning to homepage!');
      this.router.navigate(['/']); // Redirect to homepage because user is unauthorized
      return false;
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot): boolean {
    return this.canActivate(route); // Reuse same logic to activate authguard for child routes
  }
}
