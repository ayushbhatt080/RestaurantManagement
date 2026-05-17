import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestaurantService } from '../../shared/services/restaurant.service';
import { OrderService } from '../../shared/services/order.service';
import { FeedbackService } from '../../shared/services/feedback-service.service';
import { MenuItemService } from '../../shared/services/menu-item.service';

// ─── Import your services ────────────────────────────────────────────────────
// Replace paths with your actual service locations if different


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

  constructor(private router: Router,
              private restaurantService: RestaurantService,
              private orderService: OrderService,
              private feedbackService: FeedbackService,
              private menuItemService: MenuItemService) { }

  ngOnInit(): void {
    this.resolveUserAndRole();
    this.setActiveTabForRole();
    this.setCurrentDate();
    this.loadDashboardData();
  }

  // ─── Resolve username and role from localStorage (supports multiple key names + JWT) ───
  private resolveUserAndRole(): void {
    // Username: try multiple possible keys
    this.username =
      localStorage.getItem('username') ||
      localStorage.getItem('userName') ||
      'User';

    // Role: try multiple possible keys
    const rawRole =
      localStorage.getItem('role') ||
      localStorage.getItem('userRole') ||
      '';

    this.currentRole = this.normalizeRole(rawRole);

    // If role still not resolved, try decoding JWT token
    if (!this.currentRole || this.currentRole === 'CUSTOMER') {
      const token = localStorage.getItem('token') || localStorage.getItem('jwtToken') || '';
      if (token) {
        const decoded = this.decodeJwt(token);
        if (decoded) {
          // Common JWT claim keys for role
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

          // Also try username from JWT if not found yet
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

  // ─── Normalize role string to uppercase plain role ───────────────────────
  private normalizeRole(raw: string): string {
    if (!raw) return 'CUSTOMER';
    const upper = raw.trim().toUpperCase();
    // Strip ROLE_ prefix if present
    const stripped = upper.startsWith('ROLE_') ? upper.replace('ROLE_', '') : upper;
    if (['ADMIN', 'MANAGER', 'CUSTOMER'].includes(stripped)) {
      return stripped;
    }
    return 'CUSTOMER';
  }

  // ─── Decode JWT without a library ────────────────────────────────────────
  private decodeJwt(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  // ─── Set the default active tab based on role ─────────────────────────────
  private setActiveTabForRole(): void {
    if (this.isAdmin()) {
      this.activeTab = 'admin-overview';
    } else if (this.isManager()) {
      this.activeTab = 'manager-overview';
    } else {
      this.activeTab = 'customer-order';
    }
  }

  // ─── Set current date string ──────────────────────────────────────────────
  private setCurrentDate(): void {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // ─── Fetch all backend data ───────────────────────────────────────────────
  private loadDashboardData(): void {
    // ── Restaurants + Assignments (Admin / Manager) ──
    if (this.isAdmin() || this.isManager()) {
      // NOTE: Replace 'getAll()' with the actual method name in your RestaurantService
      this.restaurantService.getAll().subscribe({
        next: (data: any[]) => { this.restaurants = data || []; },
        error: (err: any) => { console.error('RestaurantService error:', err); this.restaurants = []; }
      });

      // NOTE: Replace 'getAssignments()' with the actual method name for manager assignments
      if (this.isAdmin()) {
        this.restaurantService.getAssignments().subscribe({
          next: (data: any[]) => { this.assignments = data || []; },
          error: (err: any) => { console.error('Assignments error:', err); this.assignments = []; }
        });
      }
    }

    // ── Orders (Admin + Manager + Customer) ──
    // NOTE: Replace 'getAll()' or 'getOrders()' with the actual method name in your OrderService
    this.orderService.getAllOrders().subscribe({
      next: (data: any[]) => { this.orders = data || []; },
      error: (err: any) => { console.error('OrderService error:', err); this.orders = []; }
    });

    // ── Feedback (Admin + Manager) ──
    if (this.isAdmin() || this.isManager()) {
      // NOTE: Replace 'getAll()' with the actual method name in your FeedbackService
      this.feedbackService.getAllFeedbacks().subscribe({
        next: (data: any[]) => { this.feedback = data || []; },
        error: (err: any) => { console.error('FeedbackService error:', err); this.feedback = []; }
      });
    }

    // ── Menu Items (Manager) ──
    if (this.isManager()) {
      // NOTE: Replace 'getAll()' with the actual method name in your MenuItemService
      this.menuItemService.getAll().subscribe({
        next: (data: any[]) => { this.menuItems = data || []; },
        error: (err: any) => { console.error('MenuItemService error:', err); this.menuItems = []; }
      });
    }
  }

  // ─── Role checks ─────────────────────────────────────────────────────────
  isAdmin(): boolean {
    return this.currentRole === 'ADMIN';
  }

  isManager(): boolean {
    return this.currentRole === 'MANAGER';
  }

  isCustomer(): boolean {
    return this.currentRole === 'CUSTOMER';
  }

  // ─── Navigation ───────────────────────────────────────────────────────────
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

  // ─── Computed getters ─────────────────────────────────────────────────────
  get userInitial(): string {
    return this.username ? this.username.charAt(0).toUpperCase() : 'U';
  }

  get roleBadgeLabel(): string {
    switch (this.currentRole) {
      case 'ADMIN': return 'Administrator';
      case 'MANAGER': return 'Manager';
      case 'CUSTOMER': return 'Customer';
      default: return this.currentRole;
    }
  }

  get pageTitle(): string {
    if (this.isAdmin()) return 'Admin Control Center';
    if (this.isManager()) return 'Manager Operations';
    return 'My Dashboard';
  }

  // ─── Recent lists (sliced from full arrays) ───────────────────────────────
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

  // ─── Order status counts ──────────────────────────────────────────────────
  get pendingOrdersCount(): number {
    return this.orders.filter(o => o.status?.toUpperCase() === 'PENDING').length;
  }

  get processingOrdersCount(): number {
    return this.orders.filter(o => o.status?.toUpperCase() === 'PROCESSING').length;
  }

  get deliveredOrdersCount(): number {
    return this.orders.filter(o => o.status?.toUpperCase() === 'DELIVERED').length;
  }

  get cancelledOrdersCount(): number {
    return this.orders.filter(o => o.status?.toUpperCase() === 'CANCELLED').length;
  }

  // ─── Order status percentages ─────────────────────────────────────────────
  get pendingOrdersPercent(): number {
    return this.orders.length ? Math.round((this.pendingOrdersCount / this.orders.length) * 100) : 0;
  }

  get processingOrdersPercent(): number {
    return this.orders.length ? Math.round((this.processingOrdersCount / this.orders.length) * 100) : 0;
  }

  get deliveredOrdersPercent(): number {
    return this.orders.length ? Math.round((this.deliveredOrdersCount / this.orders.length) * 100) : 0;
  }

  get cancelledOrdersPercent(): number {
    return this.orders.length ? Math.round((this.cancelledOrdersCount / this.orders.length) * 100) : 0;
  }
}
