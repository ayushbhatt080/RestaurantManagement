import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { RestaurantService } from '../../shared/services/restaurant.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {
  //Write your logic here

  // ✅ REQUIRED VARIABLES
  restaurants: any[] = [];
  users: any[] = [];

  restaurantForm!: FormGroup;
  editingId: number | null = null;

  // ✅ MESSAGE VARIABLES
  successMessage: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private restaurantService: RestaurantService,
    private authService: AuthService,
    private router: Router
  ) { }

  // ✅ REQUIRED
  ngOnInit(): void {

    this.restaurantForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cusine: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });

    this.loadRestaurants();
    this.getUserRoleDetails();
  }

  toggleTheme() {
    document.body.classList.toggle('light-theme');
  }

  // ✅ EASY ACCESS FOR VALIDATIONS IN HTML
  get f() {
    return this.restaurantForm.controls;
  }

  // ✅ CLEAR MESSAGE
  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  // ✅ LOAD RESTAURANTS - READ OPERATION
  loadRestaurants() {
    this.restaurantService.getAll().subscribe({
      next: (data: any) => {
        console.log('RESTAURANTS LOADED:', data);
        this.restaurants = data;
      },
      error: (error) => {
        console.error('LOAD RESTAURANTS ERROR:', error);
        this.errorMessage = 'Unable to load restaurants from backend.';
      }
    });
  }

  // ✅ CREATE / UPDATE
  onSubmit() {
    this.clearMessages();

    if (this.restaurantForm.invalid) {
      this.restaurantForm.markAllAsTouched();
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    this.isSubmitting = true;

    const data = this.restaurantForm.value;

    console.log('SENDING RESTAURANT DATA:', data);

    if (this.editingId !== null) {
      // ✅ UPDATE OPERATION
      this.restaurantService.update(this.editingId, data).subscribe({
        next: (response: any) => {
          console.log('RESTAURANT UPDATED:', response);

          this.successMessage = 'Restaurant updated successfully.';
          this.loadRestaurants();
          this.cancelEdit();

          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('UPDATE RESTAURANT ERROR:', error);

          this.errorMessage = 'Failed to update restaurant. Please try again.';
          this.isSubmitting = false;
        }
      });
    } else {
      // ✅ CREATE OPERATION
      this.restaurantService.create(data).subscribe({
        next: (response: any) => {
          console.log('RESTAURANT ADDED:', response);

          this.successMessage = 'Restaurant added successfully.';

          // If backend returns saved restaurant, add it instantly
          if (response) {
            this.restaurants.push(response);
          }

          // Also reload from backend to keep list fresh
          this.loadRestaurants();

          this.restaurantForm.reset();
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('ADD RESTAURANT ERROR:', error);

          this.errorMessage = 'Failed to add restaurant. Please check backend connection.';
          this.isSubmitting = false;
        }
      });
    }
  }

  // ✅ EDIT
  editRestaurant(restaurant: any) {
    this.clearMessages();

    this.editingId = restaurant.id;

    this.restaurantForm.patchValue({
      name: restaurant.name,
      location: restaurant.location,
      address: restaurant.address,
      email: restaurant.email,
      cusine: restaurant.cusine,
      phoneNumber: restaurant.phoneNumber
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ✅ CANCEL EDIT
  cancelEdit() {
    this.editingId = null;
    this.restaurantForm.reset();
  }

  // ✅ DELETE OPERATION
  deleteRestaurant(id: number) {
    this.clearMessages();

    const confirmDelete = confirm('Are you sure you want to delete this restaurant?');

    if (!confirmDelete) {
      return;
    }

    this.restaurantService.deleteById(id).subscribe({
      next: () => {
        console.log('RESTAURANT DELETED:', id);

        this.restaurants = this.restaurants.filter(r => r.id !== id);
        this.successMessage = 'Restaurant deleted successfully.';
      },
      error: (error) => {
        console.error('DELETE RESTAURANT ERROR:', error);

        this.errorMessage = 'Failed to delete restaurant. Please try again.';
      }
    });
  }

  // ✅ LOGOUT
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // ✅ GET USERS
  getUserRoleDetails() {
    this.restaurantService.getUserDetails()
      .subscribe({
        next: (data: any) => {
          this.users = data;
        },
        error: (error) => {
          // console.error('GET USERS ERROR:', error);
        }
      });
  }
}