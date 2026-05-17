import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RestaurantService } from '../../shared/services/restaurant.service';
import { OrderService } from '../../shared/services/order.service';
import { FeedbackService } from '../../shared/services/feedback-service.service';
import { MenuItemService } from '../../shared/services/menu-item.service';

import { User } from '../../model/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  username: string = 'User';
  currentRole: string = 'CUSTOMER';
  activeTab: string = 'customer-order';
  sidebarCollapsed: boolean = false;
  currentDate: string = '';

  restaurants: any[] = [];
  orders: any[] = [];
  feedback: any[] = [];
  menuItems: any[] = [];
  assignments: any[] = [];

  // ✅ NEW: Customers
  customers: User[] = [];

  constructor(
    private router: Router,
    private restaurantService: RestaurantService,
    private orderService: OrderService,
    private feedbackService: FeedbackService,
    private menuItemService: MenuItemService
  ) {}

  ngOnInit(): void {
    this.resolveUserAndRole();
    this.setActiveTabForRole();
    this.setCurrentDate();
    this.loadDashboardData();
  }

  private resolveUserAndRole(): void {
    this.username =
      localStorage.getItem('username') ||
      localStorage.getItem('userName') ||
      'User';

    const rawRole =
      localStorage.getItem('role') ||
      localStorage.getItem('userRole') ||
      '';

    this.currentRole = this.normalizeRole(rawRole);

    if (!this.currentRole || this.currentRole === 'CUSTOMER') {
      const token =
        localStorage.getItem('token') ||
        localStorage.getItem('jwtToken') ||
        '';

      if (token) {
        const decoded = this.decodeJwt(token);

        if (decoded) {
          const jwtRole =
            decoded['role'] ||
            decoded['roles'] ||
            decoded['userRole'] ||
            decoded['authorities'] ||
            '';

          const resolvedFromJwt = this.normalizeRole(
            Array.isArray(jwtRole) ? jwtRole[0] : jwtRole
          );

          if (resolvedFromJwt) {
            this.currentRole = resolvedFromJwt;
          }

          if (this.username === 'User') {
            this.username =
              decoded['sub'] ||
              decoded['username'] ||
              decoded['name'] ||
              'User';
          }
        }
      }
    }
  }

  private normalizeRole(raw: string): string {
    if (!raw) return 'CUSTOMER';

    const upper = String(raw).trim().toUpperCase();
    const stripped = upper.startsWith('ROLE_')
      ? upper.replace('ROLE_', '')
      : upper;

    if (['ADMIN', 'MANAGER', 'CUSTOMER'].includes(stripped)) {
      return stripped;
    }

    return 'CUSTOMER';
  }

  private decodeJwt(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  private setActiveTabForRole(): void {
    if (this.isAdmin()) {
      this.activeTab = 'admin-overview';
    } else if (this.isManager()) {
      this.activeTab = 'manager-overview';
    } else {
      this.activeTab = 'customer-order';
    }
  }

  private setCurrentDate(): void {
    const now = new Date();

    this.currentDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private loadDashboardData(): void {
    if (this.isAdmin() || this.isManager()) {
      this.restaurantService.getAll().subscribe({
        next: (data: any[]) => {
          this.restaurants = data || [];
        },
        error: (err: any) => {
          console.error('RestaurantService error:', err);
          this.restaurants = [];
        }
      });

      // ✅ NEW: Load customers for Admin and Manager
      this.loadCustomers();

      if (this.isAdmin()) {
        this.restaurantService.getAssignments().subscribe({
          next: (data: any[]) => {
            this.assignments = data || [];
          },
          error: (err: any) => {
            console.error('Assignments error:', err);
            this.assignments = [];
          }
        });
      }
    }

    this.orderService.getAllOrders().subscribe({
      next: (data: any[]) => {
        this.orders = data || [];
      },
      error: (err: any) => {
        console.error('OrderService error:', err);
        this.orders = [];
      }
    });

    if (this.isAdmin() || this.isManager()) {
      this.feedbackService.getAllFeedbacks().subscribe({
        next: (data: any[]) => {
          this.feedback = data || [];
        },
        error: (err: any) => {
          console.error('FeedbackService error:', err);
          this.feedback = [];
        }
      });
    }

    if (this.isManager()) {
      this.menuItemService.getAll().subscribe({
        next: (data: any[]) => {
          this.menuItems = data || [];
        },
        error: (err: any) => {
          console.error('MenuItemService error:', err);
          this.menuItems = [];
        }
      });
    }
  }

  // ✅ NEW: Load only customer users
  private loadCustomers(): void {
  this.restaurantService.getUserDetails().subscribe({
    next: (data: User[]) => {
      console.log('All users from backend:', data);

      this.customers = data.filter((user: User) => {
        const role = String(user.role || '')
          .trim()
          .toUpperCase()
          .replace('ROLE_', '');

        return role === 'CUSTOMER';
      });

      console.log('Filtered customers:', this.customers);
    },
    error: (err: any) => {
      console.error('Customer loading error:', err);
      this.customers = [];
    }
  });
}

  isAdmin(): boolean {
    return this.currentRole === 'ADMIN';
  }

  isManager(): boolean {
    return this.currentRole === 'MANAGER';
  }

  isCustomer(): boolean {
    return this.currentRole === 'CUSTOMER';
  }

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  goToRestaurant(): void {
    this.router.navigate(['/restaurant']);
  }

  goToAssignManager(): void {
    this.router.navigate(['/assign-manager']);
  }

  goToMenuItems(): void {
    this.router.navigate(['/menu-item']);
  }

  goToOrders(): void {
    this.router.navigate(['/order']);
  }

  goToFeedback(): void {
    this.router.navigate(['/feedback']);
  }

  // ✅ Optional route if you have separate Customer Details page
  goToCustomers(): void {
    this.activeTab = 'manager-customers';
  }

  get userInitial(): string {
    return this.username ? this.username.charAt(0).toUpperCase() : 'U';
  }

  get roleBadgeLabel(): string {
    switch (this.currentRole) {
      case 'ADMIN':
        return 'Administrator';
      case 'MANAGER':
        return 'Manager';
      case 'CUSTOMER':
        return 'Customer';
      default:
        return this.currentRole;
    }
  }

  get pageTitle(): string {
    if (this.isAdmin()) return 'Admin Control Center';
    if (this.isManager()) return 'Manager Operations';
    return 'Let Me Dine';
  }

  get recentRestaurants(): any[] {
    return this.restaurants.slice(0, 5);
  }

  get recentOrders(): any[] {
    return this.orders.slice(0, 5);
  }

  get recentFeedback(): any[] {
    return this.feedback.slice(0, 5);
  }

  get recentMenuItems(): any[] {
    return this.menuItems.slice(0, 5);
  }

  // ✅ NEW
  get recentCustomers(): User[] {
    return this.customers.slice(0, 5);
  }

  get pendingOrdersCount(): number {
    return this.orders.filter(
      o => o.status?.toUpperCase() === 'PENDING'
    ).length;
  }

  get processingOrdersCount(): number {
    return this.orders.filter(
      o => o.status?.toUpperCase() === 'PROCESSING'
    ).length;
  }

  get deliveredOrdersCount(): number {
    return this.orders.filter(
      o => o.status?.toUpperCase() === 'DELIVERED'
    ).length;
  }

  get cancelledOrdersCount(): number {
    return this.orders.filter(
      o => o.status?.toUpperCase() === 'CANCELLED'
    ).length;
  }

  get pendingOrdersPercent(): number {
    return this.orders.length
      ? Math.round((this.pendingOrdersCount / this.orders.length) * 100)
      : 0;
  }

  get processingOrdersPercent(): number {
    return this.orders.length
      ? Math.round((this.processingOrdersCount / this.orders.length) * 100)
      : 0;
  }

  get deliveredOrdersPercent(): number {
    return this.orders.length
      ? Math.round((this.deliveredOrdersCount / this.orders.length) * 100)
      : 0;
  }

  get cancelledOrdersPercent(): number {
    return this.orders.length
      ? Math.round((this.cancelledOrdersCount / this.orders.length) * 100)
      : 0;
  }
}
