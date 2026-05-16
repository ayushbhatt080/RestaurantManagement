
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { MenuItemService } from '../../shared/services/menu-item.service';
import { OrderService } from '../../shared/services/order.service';
import { RestaurantService } from '../../shared/services/restaurant.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit {

  orders: any[] = [];
  restaurants: any[] = [];
  menuItems: any[] = [];
  selectedItems: any[] = [];

  orderForm!: FormGroup;

  searchText = '';
  showForm = false;

  message = '';
  error = '';

  currentPage = 1;
  pageSize = 10;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private restaurantService: RestaurantService,
    private menuItemService: MenuItemService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      restaurantId: ['', Validators.required]
    });

    this.loadOrders();

    if (this.authService.isCustomer() || this.authService.isAdmin()) {
      this.restaurantService.getAll()
        .subscribe({ next: d => this.restaurants = d });
    }
  }

  // ✅ Load orders based on role
  loadOrders(): void {
    if (this.authService.isCustomer()) {
      this.orderService.getOrdersByUserId(this.authService.getUserId()!)
        .subscribe({ next: d => this.orders = d });
    } else {
      this.orderService.getAllOrders()
        .subscribe({ next: d => this.orders = d });
    }
  }

  // ✅ Restaurant selection -> load items
  onRestaurantChange(event: any): void {
    const id = event.target.value;
    if (!id) return;

    this.menuItemService.getMenuItemsByRestaurant(+id)
      .subscribe({
        next: d => {
          this.menuItems = d;
          this.selectedItems = []; // reset
        }
      });
  }

  // ✅ Select / deselect item
  toggleItem(item: any): void {
    const idx = this.selectedItems.findIndex(i => i.id === item.id);
    if (idx > -1) {
      this.selectedItems.splice(idx, 1);
    } else {
      this.selectedItems.push(item);
    }
  }

  isSelected(item: any): boolean {
    return this.selectedItems.some(i => i.id === item.id);
  }

  // ✅ Improved total calculation (supports quantity if available)
  getTotal(): number {
    return this.selectedItems.reduce((sum, i) => {
      const qty = i.quantity ? i.quantity : 1;
      return sum + (i.price * qty);
    }, 0);
  }

  // ✅ Place order
  placeOrder(): void {
    if (this.orderForm.invalid || this.selectedItems.length === 0) return;

    const payload = {
      customerName: this.authService.getUsername(),
      restaurantId: +this.orderForm.value.restaurantId,
      userId: this.authService.getUserId(),
      itemIds: this.selectedItems.map(i => i.id)
    };

    this.orderService.placeOrder(payload).subscribe({
      next: () => {
        this.message = 'Order placed!';
        this.showForm = false;
        this.selectedItems = [];
        this.loadOrders();
      },
      error: err => this.error = err.error?.error || 'Order failed'
    });
  }

  // ✅ Cancel order
  cancelOrder(id: number): void {
    if (!confirm('Cancel this order?')) return;

    this.orderService.cancelOrder(id).subscribe({
      next: () => {
        this.message = 'Cancelled!';
        this.loadOrders();
      },
      error: err => this.error = err.error?.error || 'Cannot cancel'
    });
  }

  // ✅ Update order status
  updateStatus(id: number, status: string): void {
    if (!status) return;

    this.orderService.updateOrderStatus(id, status).subscribe({
      next: () => {
        this.message = 'Status updated!';
        this.loadOrders();
      }
    });
  }

  // ✅ Filter + Pagination combined
  get filteredOrders(): any[] {
    if (!this.searchText) return this.orders;

    return this.orders.filter(o =>
      o.customerName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      o.status?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get pagedOrders(): any[] {
    const filtered = this.filteredOrders;

    return filtered.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.pageSize);
  }

  // ✅ Pagination controls (NEW)
  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }
}

