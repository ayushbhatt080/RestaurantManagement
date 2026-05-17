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
    this.loadRestaurants();
  }

  loadRestaurants(): void {
    if (this.authService.isCustomer() || this.authService.isAdmin()) {
      this.restaurantService.getAll().subscribe({
        next: (data: any) => {
          console.log('RESTAURANTS RESPONSE:', data);
          this.restaurants = Array.isArray(data) ? data : [];
          console.log('FINAL RESTAURANTS:', this.restaurants);
        },
        error: (err) => {
          console.error('FAILED TO LOAD RESTAURANTS:', err);
          this.error = 'Failed to load restaurants';
        }
      });
    }
  }

  loadOrders(): void {
    this.error = '';

    if (this.authService.isCustomer()) {
      const userId = this.authService.getUserId();

      console.log('LOADING ORDERS FOR USER ID:', userId);

      if (!userId) {
        this.orders = [];
        this.error = 'User id not found. Please login again.';
        return;
      }

      this.orderService.getOrdersByUserId(userId).subscribe({
        next: (data: any) => {
          console.log('CUSTOMER ORDERS RESPONSE:', data);

          if (Array.isArray(data)) {
            this.orders = data;
          } else if (Array.isArray(data?.data)) {
            this.orders = data.data;
          } else if (Array.isArray(data?.content)) {
            this.orders = data.content;
          } else if (Array.isArray(data?.orders)) {
            this.orders = data.orders;
          } else {
            this.orders = [];
          }

          this.currentPage = 1;
          console.log('FINAL CUSTOMER ORDERS:', this.orders);
        },
        error: (err) => {
          console.error('FAILED TO LOAD CUSTOMER ORDERS:', err);
          console.error('STATUS:', err.status);
          console.error('ERROR BODY:', err.error);

          this.orders = [];
          this.error = err.error?.error || err.error?.message || 'Failed to load orders';
        }
      });

    } else {
      this.orderService.getAllOrders().subscribe({
        next: (data: any) => {
          console.log('ALL ORDERS RESPONSE:', data);

          if (Array.isArray(data)) {
            this.orders = data;
          } else if (Array.isArray(data?.data)) {
            this.orders = data.data;
          } else if (Array.isArray(data?.content)) {
            this.orders = data.content;
          } else if (Array.isArray(data?.orders)) {
            this.orders = data.orders;
          } else {
            this.orders = [];
          }

          this.currentPage = 1;
          console.log('FINAL ALL ORDERS:', this.orders);
        },
        error: (err) => {
          console.error('FAILED TO LOAD ORDERS:', err);
          console.error('STATUS:', err.status);
          console.error('ERROR BODY:', err.error);

          this.orders = [];
          this.error = err.error?.error || err.error?.message || 'Failed to load orders';
        }
      });
    }
  }

  onRestaurantChange(event: any): void {
    const id = event.target.value;

    this.menuItems = [];
    this.selectedItems = [];
    this.message = '';
    this.error = '';

    if (!id) return;

    console.log('SELECTED RESTAURANT ID:', id);

    this.menuItemService.getMenuItemsByRestaurant(+id).subscribe({
      next: (data: any) => {
        console.log('MENU ITEMS RESPONSE:', data);

        if (Array.isArray(data)) {
          this.menuItems = data;
        } else if (Array.isArray(data?.data)) {
          this.menuItems = data.data;
        } else if (Array.isArray(data?.content)) {
          this.menuItems = data.content;
        } else if (Array.isArray(data?.menuItems)) {
          this.menuItems = data.menuItems;
        } else if (Array.isArray(data?.items)) {
          this.menuItems = data.items;
        } else {
          this.menuItems = [];
        }

        console.log('FINAL MENU ITEMS:', this.menuItems);
      },
      error: (err) => {
        console.error('FAILED TO LOAD MENU ITEMS:', err);
        console.error('STATUS:', err.status);
        console.error('ERROR BODY:', err.error);

        this.menuItems = [];
        this.error = 'Failed to load menu items for this restaurant.';
      }
    });
  }

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

  getTotal(): number {
    return this.selectedItems.reduce((sum, item) => {
      const qty = item.quantity ? item.quantity : 1;
      const price = item.price ? Number(item.price) : 0;
      return sum + (price * qty);
    }, 0);
  }

  placeOrder(): void {
    this.message = '';
    this.error = '';

    if (this.orderForm.invalid || this.selectedItems.length === 0) {
      this.error = 'Please select a restaurant and at least one menu item.';
      return;
    }

    const payload = {
      customerName: this.authService.getUsername(),
      restaurantId: +this.orderForm.value.restaurantId,
      userId: this.authService.getUserId(),
      itemIds: this.selectedItems.map(i => i.id)
    };

    console.log('ORDER PAYLOAD:', payload);

    this.orderService.placeOrder(payload).subscribe({
      next: (response: any) => {
        console.log('ORDER PLACED RESPONSE:', response);

        this.message = 'Order placed!';
        this.error = '';

        this.showForm = false;
        this.selectedItems = [];
        this.menuItems = [];
        this.orderForm.reset();

        this.loadOrders();
      },
      error: (err) => {
        console.error('ORDER ERROR:', err);
        console.error('STATUS:', err.status);
        console.error('ERROR BODY:', err.error);

        this.error = err.error?.error || err.error?.message || err.message || 'Order failed';
      }
    });
  }

  cancelOrder(id: number): void {
    if (!confirm('Cancel this order?')) return;

    this.message = '';
    this.error = '';

    this.orderService.cancelOrder(id).subscribe({
      next: () => {
        this.message = 'Cancelled!';
        this.loadOrders();
      },
      error: err => {
        console.error('CANCEL ORDER ERROR:', err);
        this.error = err.error?.error || err.error?.message || 'Cannot cancel';
      }
    });
  }

  updateStatus(id: number, status: string): void {
    if (!status) return;

    this.message = '';
    this.error = '';

    this.orderService.updateOrderStatus(id, status).subscribe({
      next: () => {
        this.message = 'Status updated!';
        this.loadOrders();
      },
      error: err => {
        console.error('UPDATE STATUS ERROR:', err);
        this.error = err.error?.error || err.error?.message || 'Failed to update status';
      }
    });
  }

  get filteredOrders(): any[] {
    if (!this.searchText) return this.orders;

    return this.orders.filter(o =>
      o.customerName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      o.status?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      o.restaurantName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      o.restaurant?.name?.toLowerCase().includes(this.searchText.toLowerCase())
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