import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TopNavBarComponent } from './component/nav/top-nav-bar/top-nav-bar.component';
import { FooterComponent } from './component/footer/footer.component';
import { isTokenExpired } from './util/jwt-util';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopNavBarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Online StoreLink';
  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('jwtToken');
    if (token && isTokenExpired(token)) {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('cart');
      this.router.navigate(['/']);
    }
  }
}
