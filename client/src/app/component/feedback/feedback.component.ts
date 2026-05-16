import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { FeedbackService } from '../../shared/services/feedback-service.service';
import { MenuItemService } from '../../shared/services/menu-item.service';
import { RestaurantService } from '../../shared/services/restaurant.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent 
implements OnInit
 {

  feedbacks: any[] = [];
  restaurants: any[] = [];
  menuItems: any[] = [];

  feedbackForm!: FormGroup;

  showForm = false;
  message = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private restaurantService: RestaurantService,
    private menuItemService: MenuItemService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {

    // ✅ Form Setup
    this.feedbackForm = this.fb.group({
      customerName: [this.authService.getUsername(), Validators.required],
      comment: ['', Validators.required],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      restaurantId: ['', Validators.required],
      menuItemId: ['']
    });

    // ✅ Load initial data
    this.loadFeedbacks();

    this.restaurantService.getAll().subscribe({
      next: d => this.restaurants = d,
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load restaurants';
      }
    });
  }

  // ✅ Load feedbacks
  loadFeedbacks(): void {
    this.feedbackService.getAllFeedbacks().subscribe({
      next: d => this.feedbacks = d,
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load feedbacks';
      }
    });
  }

  // ✅ Restaurant change → load menu
  onRestaurantChange(event: any): void {
    const id = event.target.value;

    if (!id) {
      this.menuItems = [];
      return;
    }

    this.menuItemService.getMenuItemsByRestaurant(+id).subscribe({
      next: d => this.menuItems = d,
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load menu items';
      }
    });
  }

  // ✅ Submit Feedback
  submit(): void {

    this.message = '';
    this.error = '';

    if (this.feedbackForm.invalid) return;

    this.feedbackService.submitFeedback(this.feedbackForm.value).subscribe({
      next: () => {

        this.message = '✅ Feedback submitted!';
        this.showForm = false;

        // ✅ Reset form properly
        this.feedbackForm.reset({
          customerName: this.authService.getUsername(),
          rating: null
        });

        // ✅ Reload feedback list
        this.loadFeedbacks();
      },
      error: (err) => {
        console.error(err);
        this.error = '❌ Failed to submit feedback';
      }
    });
  }

  // ✅ Convert rating to stars
  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  // ✅ ⭐ Set rating from UI
  setRating(value: number): void {
    this.feedbackForm.patchValue({ rating: value });
  }

  // ✅ ✅ ADMIN RESPONSE FUNCTION
  submitResponse(fb: any): void {

    // ✅ Restrict to ADMIN only
    if (this.authService.getRole() !== 'ADMIN') {
      this.error = '❌ Only admin can respond';
      return;
    }

    if (!fb.tempResponse) return;

    this.feedbackService.replyFeedback(fb.id, {
      response: fb.tempResponse
    }).subscribe({
      next: () => {

        // ✅ Instant UI update
        fb.response = fb.tempResponse;
        fb.tempResponse = '';

        this.message = '✅ Response added!';
        this.error = '';
      },
      error: (err) => {
        console.error(err);
        this.error = '❌ Failed to add response';
      }
    });
  }

}
