import { Component, OnInit } from '@angular/core';
import { Role, User } from '../../model/user';
import { RestaurantService } from '../../shared/services/restaurant.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; // ✅ ADD THIS

@Component({
  selector: 'app-customerdetails',
  templateUrl: './customerdetails.component.html',
  styleUrls: ['./customerdetails.component.scss']
})
export class CustomerdetailsComponent implements OnInit {

  customers: User[] = [];

  // ✅ Theme state
  isLight: boolean = false;

  constructor(
    private restaurantService: RestaurantService,
    private authService: AuthService,
    private router: Router,
    private location: Location   // ✅ ADD THIS
  ) {}

  ngOnInit(): void {
    this.loadCustomers();

    // ✅ Restore theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      this.isLight = true;
    }
  }

  // ✅ LOAD CUSTOMER DATA
  loadCustomers() {
    this.restaurantService.getUserDetails()
      .subscribe((data: User[]) => {
        this.customers = data.filter(user => user.role === Role.CUSTOMER);
      });
  }

  // ✅ THEME TOGGLE
  toggleTheme() {
    this.isLight = !this.isLight;
    localStorage.setItem('theme', this.isLight ? 'light' : 'dark');
  }

  // ✅ BACK BUTTON FUNCTION
  goBack() {
    this.location.back();
  }

  // ✅ LOGOUT
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}