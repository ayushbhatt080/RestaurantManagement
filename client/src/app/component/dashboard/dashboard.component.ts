import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || 'User';
    const role = localStorage.getItem('role') || 'ADMIN';
    this.currentRole = role.toUpperCase();

    if (this.isAdmin()) {
      this.activeTab = 'admin-overview';
    } else if (this.isManager()) {
      this.activeTab = 'manager-overview';
    } else {
      this.activeTab = 'customer-order';
    }

    const now = new Date();
    this.currentDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
}