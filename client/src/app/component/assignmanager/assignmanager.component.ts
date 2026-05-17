import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantService } from '../../shared/services/restaurant.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assign-manager',
  templateUrl: './assignmanager.component.html',
  styleUrls: ['./assignmanager.component.scss']
})
export class AssignmanagerComponent implements OnInit {

  assignments: any[] = [];
  restaurants: any[] = [];
  managers: any[] = [];
  assignForm!: FormGroup;

  message = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private restaurantService: RestaurantService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    // ✅ Form initialization
    this.assignForm = this.fb.group({
      restaurantId: ['', Validators.required],
      managerId: ['', Validators.required]
    });

    // ✅ Load initial data
    this.loadAssignments();

    this.restaurantService.getAll().subscribe({
      next: d => this.restaurants = d,
      error: () => this.error = 'Failed to load restaurants'
    });

    this.authService.getAllUsers().subscribe({
      next: (users: any) => {
        this.managers = users.filter((u: any) => u.role === 'MANAGER');
      },
      error: () => this.error = 'Failed to load managers'
    });
  }

  // ✅ Load assignments
  loadAssignments(): void {
    this.restaurantService.getAssignments().subscribe({
      next: d => this.assignments = d,
      error: () => this.error = 'Failed to load assignments'
    });
  }

  // ✅ Assign manager
  assign(): void {

    this.message = '';
    this.error = '';

    if (this.assignForm.invalid) return;

    const req = {
      restaurantId: +this.assignForm.value.restaurantId,
      managerId: +this.assignForm.value.managerId,
      assignedBy: this.authService.getUserId()
    };

    this.restaurantService.assignManager(req).subscribe({
      next: () => {
        this.message = '✅ Manager assigned successfully!';

        // ✅ Reset form
        this.assignForm.reset();

        // ✅ Reload table
        this.loadAssignments();

        // ✅ Redirect to dashboard after short delay
        // setTimeout(() => {
        //   this.router.navigate(['/dashboard']);
        // }, 1500);
      },
      error: err => {
        this.error = err?.error?.error || '❌ Assignment failed';
      }
    });
  }

  // ✅ Manual navigation button
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

}

