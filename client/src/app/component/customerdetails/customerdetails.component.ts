import { Component, OnInit } from '@angular/core';
import { Role, User } from '../../model/user';
import { RestaurantService } from '../../shared/services/restaurant.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

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
    private location: Location
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
loadCustomers(): void {
  console.log('LOAD CUSTOMERS CALLED ✅');

  this.restaurantService.getUserDetails().subscribe({
    next: (data: any[]) => {
      console.log('✅ API RESPONSE:', data);

      this.customers = data.filter((user: any) =>
        user.role?.toString().includes('CUSTOMER')
      );

      console.log('✅ FILTERED:', this.customers);
    },
    error: (error) => {
      console.error('❌ API ERROR:', error);
      console.error('STATUS:', error.status);
      console.error('BODY:', error.error);
    }
  });
}



  // ✅ THEME TOGGLE
  toggleTheme(): void {
    this.isLight = !this.isLight;
    localStorage.setItem('theme', this.isLight ? 'light' : 'dark');
  }

  // ✅ BACK BUTTON FUNCTION
  goBack(): void {
    this.location.back();
  }

  // ✅ LOGOUT
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}