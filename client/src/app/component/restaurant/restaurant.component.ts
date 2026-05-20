import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { forkJoin } from 'rxjs';

import { RestaurantService } from '../../shared/services/restaurant.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {

  restaurants: any[] = [];
  users: any[] = [];

  restaurantForm!: FormGroup;
  editingId: number | null = null;

  successMessage: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = false;

  // ✅ Theme state
  isLight: boolean = false;

  // ✅ Bulk selection state
  selectedIds: Set<number> = new Set<number>();

  constructor(
    private fb: FormBuilder,
    private restaurantService: RestaurantService,
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {

    // ✅ Restore saved theme
    const savedTheme = localStorage.getItem('restaurant-theme');

    if (savedTheme === 'light') {
      this.isLight = true;
    } else {
      this.isLight = false;
    }

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

  // ✅ Back button
  goBack(): void {
    this.location.back();
  }

  // ✅ Theme toggle
  toggleTheme(): void {
    this.isLight = !this.isLight;

    localStorage.setItem(
      'restaurant-theme',
      this.isLight ? 'light' : 'dark'
    );
  }

  // ✅ Easy access for validations in HTML
  get f() {
    return this.restaurantForm.controls;
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  loadRestaurants(): void {
    this.restaurantService.getAll().subscribe({
      next: (data: any) => {
        console.log('RESTAURANTS LOADED:', data);
        this.restaurants = data;

        // ✅ Reload ke baad selected checkbox clear
        this.selectedIds.clear();
      },
      error: (error: any) => {
        console.error('LOAD RESTAURANTS ERROR:', error);
        this.errorMessage = 'Unable to load restaurants from backend.';
      }
    });
  }

  onSubmit(): void {
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

      this.restaurantService.update(this.editingId, data).subscribe({
        next: (response: any) => {
          console.log('RESTAURANT UPDATED:', response);

          this.successMessage = 'Restaurant updated successfully.';
          this.loadRestaurants();
          this.cancelEdit();

          this.isSubmitting = false;
        },
        error: (error: any) => {
          console.error('UPDATE RESTAURANT ERROR:', error);

          this.errorMessage = 'Failed to update restaurant. Please try again.';
          this.isSubmitting = false;
        }
      });

    } else {

      this.restaurantService.create(data).subscribe({
        next: (response: any) => {
          console.log('RESTAURANT ADDED:', response);

          this.successMessage = 'Restaurant added successfully.';

          if (response) {
            this.restaurants.push(response);
          }

          this.loadRestaurants();

          this.restaurantForm.reset();
          this.isSubmitting = false;
        },
        error: (error: any) => {
          console.error('ADD RESTAURANT ERROR:', error);

          this.errorMessage = 'Failed to add restaurant. Please check backend connection.';
          this.isSubmitting = false;
        }
      });
    }
  }

  editRestaurant(restaurant: any): void {
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

  cancelEdit(): void {
    this.editingId = null;
    this.restaurantForm.reset();
  }

  deleteRestaurant(id: number): void {
    this.clearMessages();

    const confirmDelete = confirm('Are you sure you want to delete this restaurant?');

    if (!confirmDelete) {
      return;
    }

    this.restaurantService.deleteById(id).subscribe({
      next: () => {
        console.log('RESTAURANT DELETED:', id);

        this.restaurants = this.restaurants.filter(r => r.id !== id);

        // ✅ Agar selected hai to selectedIds se bhi remove
        this.selectedIds.delete(id);

        this.successMessage = 'Restaurant deleted successfully.';
      },
      error: (error: any) => {
        console.error('DELETE RESTAURANT ERROR:', error);

        this.errorMessage = 'Failed to delete restaurant. Please try again.';
      }
    });
  }

  // ✅ Select one restaurant
  toggleSelectItem(id: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedIds.add(id);
    } else {
      this.selectedIds.delete(id);
    }
  }

  // ✅ Select all restaurants
  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.selectedIds.clear();

    if (checked) {
      this.restaurants.forEach(r => {
        if (r.id !== undefined && r.id !== null) {
          this.selectedIds.add(r.id);
        }
      });
    }
  }

  // ✅ Check row selected or not
  isSelected(id: number): boolean {
    return this.selectedIds.has(id);
  }

  // ✅ Header checkbox checked state
  isAllSelected(): boolean {
    return this.restaurants.length > 0 && this.selectedIds.size === this.restaurants.length;
  }

  // ✅ Header checkbox indeterminate state
  isSomeSelected(): boolean {
    return this.selectedIds.size > 0 && !this.isAllSelected();
  }

  // ✅ Clear selected checkboxes
  clearSelection(): void {
    this.selectedIds.clear();
  }

  // ✅ Delete selected restaurants
  deleteSelected(): void {
    const ids = Array.from(this.selectedIds);

    if (ids.length === 0) {
      return;
    }

    const confirmDelete = confirm(`Delete ${ids.length} selected restaurant(s)?`);

    if (!confirmDelete) {
      return;
    }

    this.clearMessages();

    forkJoin(ids.map(id => this.restaurantService.deleteById(id))).subscribe({
      next: () => {
        this.successMessage = `${ids.length} restaurant(s) deleted successfully.`;

        this.restaurants = this.restaurants.filter(r => !this.selectedIds.has(r.id));

        this.selectedIds.clear();
      },
      error: (error: any) => {
        console.error('BULK DELETE RESTAURANTS ERROR:', error);

        this.errorMessage = 'Failed to delete selected restaurants. Please try again.';

        this.loadRestaurants();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUserRoleDetails(): void {
    this.restaurantService.getUserDetails()
      .subscribe({
        next: (data: any) => {
          this.users = data;
        },
        error: (error: any) => {
          // console.error('GET USERS ERROR:', error);
        }
      });
  }
}