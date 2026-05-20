import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../shared/services/auth.service';
import { MenuItemService } from '../../shared/services/menu-item.service';
import { OrderService } from '../../shared/services/order.service';
import { RestaurantService } from '../../shared/services/restaurant.service';
import { PaymentService } from '../../shared/services/paymentservice';

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

  // ORDER TABLE SEARCH
  searchText = '';

  // MENU ITEM SEARCH (BEFORE ORDERING)
  menuSearchText = '';

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
    public authService: AuthService,
    public paymentService:PaymentService
  ) { }

  ngOnInit(): void {

    this.orderForm = this.fb.group({
      restaurantId: ['', Validators.required]
    });

    this.loadOrders();

    this.loadRestaurants();
  }

  // LOAD RESTAURANTS
  loadRestaurants(): void {

    if (
      this.authService.isCustomer() ||
      this.authService.isAdmin()
    ) {

      this.restaurantService.getAll().subscribe({

        next: (data: any) => {

          this.restaurants = Array.isArray(data)
            ? data
            : [];

        },

        error: () => {

          this.error = 'Failed to load restaurants';

        }

      });

    }
  }

  // LOAD ORDERS
  loadOrders(): void {

    this.error = '';

    if (this.authService.isCustomer()) {

      const userId = this.authService.getUserId();

      if (!userId) {

        this.orders = [];

        this.error =
          'User id not found. Please login again.';

        return;
      }

      this.orderService
        .getOrdersByUserId(userId)
        .subscribe({

          next: (data: any) => {

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
          },

          error: (err) => {

            this.orders = [];

            this.error =
              err.error?.error ||
              err.error?.message ||
              'Failed to load orders';

          }

        });

    } 
else if (this.authService.isManager()) {

  this.orderService
    .getMyOrders()   // ✅ sirf assigned restaurants ke orders
    .subscribe({

      next: (data: any) => {

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
      },

      error: (err) => {
        this.orders = [];
        this.error =
          err.error?.error ||
          err.error?.message ||
          'Failed to load orders';
      }

    });

  }else {

      this.orderService
        .getAllOrders()
        .subscribe({

          next: (data: any) => {

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
          },

          error: (err) => {

            this.orders = [];

            this.error =
              err.error?.error ||
              err.error?.message ||
              'Failed to load orders';

          }

        });
    }
  }

  // RESTAURANT CHANGE
  onRestaurantChange(event: any): void {

    const id = event.target.value;

    this.menuItems = [];

    this.selectedItems = [];

    this.menuSearchText = '';

    this.message = '';

    this.error = '';

    if (!id) return;

    this.menuItemService
      .getMenuItemsByRestaurant(+id)
      .subscribe({

        next: (data: any) => {

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

        },

        error: () => {

          this.menuItems = [];

          this.error =
            'Failed to load menu items for this restaurant.';

        }

      });
  }

  // FILTER MENU ITEMS BEFORE ORDERING
  filteredMenuItems(): any[] {

    if (!this.menuSearchText) {

      return this.menuItems;

    }

    const search =
      this.menuSearchText
        .toLowerCase()
        .trim();

    return this.menuItems.filter(item =>

      item.name
        ?.toLowerCase()
        .includes(search) ||

      item.menuType
        ?.toLowerCase()
        .includes(search)

    );
  }

  // SELECT / UNSELECT ITEM
  toggleItem(item: any): void {

    const idx =
      this.selectedItems.findIndex(
        i => i.id === item.id
      );

    if (idx > -1) {

      this.selectedItems.splice(idx, 1);

    } else {

      this.selectedItems.push(item);

    }
  }

  // CHECK SELECTED
  isSelected(item: any): boolean {

    return this.selectedItems.some(
      i => i.id === item.id
    );
  }

  // TOTAL
  getTotal(): number {

    return this.selectedItems.reduce(
      (sum, item) => {

        const qty =
          item.quantity
            ? item.quantity
            : 1;

        const price =
          item.price
            ? Number(item.price)
            : 0;

        // return sum + (price * qty);
        return sum + price;

      },
      0
    );
  }

  // PLACE ORDER
  placeOrder(): void {

    this.message = '';

    this.error = '';

    if (
      this.orderForm.invalid ||
      this.selectedItems.length === 0
    ) {

      this.error =
        'Please select a restaurant and at least one menu item.';

      return;
    }

    const payload = {

      customerName:
        this.authService.getUsername(),

      restaurantId:
        +this.orderForm.value.restaurantId,

      userId:
        this.authService.getUserId(),

      itemIds:
        this.selectedItems.map(i => i.id)

    };

    this.orderService
      .placeOrder(payload)
      .subscribe({

        next: () => {

          this.message = 'Order placed!';

          this.error = '';

          this.showForm = false;

          this.selectedItems = [];

          this.menuItems = [];

          this.menuSearchText = '';

          this.orderForm.reset();

          this.loadOrders();
        },

        error: (err) => {

          this.error =
            err.error?.error ||
            err.error?.message ||
            err.message ||
            'Order failed';

        }

      });
  }

  // CANCEL ORDER
  cancelOrder(id: number): void {

    if (!confirm('Cancel this order?')) {
      return;
    }

    this.message = '';

    this.error = '';

    this.orderService
      .cancelOrder(id)
      .subscribe({

        next: () => {

          this.message = 'Cancelled!';

          this.loadOrders();

        },

        error: (err) => {

          this.error =
            err.error?.error ||
            err.error?.message ||
            'Cannot cancel';

        }

      });
  }

  // UPDATE STATUS
  updateStatus(
    id: number,
    status: string
  ): void {

    if (!status) return;

    this.message = '';

    this.error = '';

    this.orderService
      .updateOrderStatus(id, status)
      .subscribe({

        next: () => {

          this.message = 'Status updated!';

          this.loadOrders();

        },

        error: (err) => {

          this.error =
            err.error?.error ||
            err.error?.message ||
            'Failed to update status';

        }

      });
  }

  // FILTER ORDERS TABLE
  get filteredOrders(): any[] {

    if (!this.searchText) {

      return this.orders;

    }

    const search =
      this.searchText
        .toLowerCase()
        .trim();

    return this.orders.filter(o =>

      o.customerName
        ?.toLowerCase()
        .includes(search) ||

      o.status
        ?.toLowerCase()
        .includes(search) ||

      o.restaurantName
        ?.toLowerCase()
        .includes(search) ||

      o.restaurant?.name
        ?.toLowerCase()
        .includes(search) ||

      o.menuItemNames?.some(
        (item: string) =>

          item
            .toLowerCase()
            .includes(search)
      )

    );
  }

  // PAGINATION
  get pagedOrders(): any[] {

    const filtered = this.filteredOrders;

    return filtered.slice(

      (this.currentPage - 1) * this.pageSize,

      this.currentPage * this.pageSize

    );
  }

  get totalPages(): number {

    return Math.ceil(
      this.filteredOrders.length / this.pageSize
    );
  }

  nextPage(): void {

    if (this.currentPage < this.totalPages) {

      this.currentPage++;

    }
  }

  prevPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

    }
  }

  goToPage(page: number): void {

    this.currentPage = page;
  }
  payNow(): void {
  this.message = '';
  this.error = '';

  if (this.orderForm.invalid || this.selectedItems.length === 0) {
    this.error = 'Please select a restaurant and at least one menu item.';
    return;
  }

  const totalPaise = this.getTotal(); 

  this.paymentService.createOrder(totalPaise).subscribe({
    next: (response: any) => {
      const options = {
        key: 'rzp_test_Sr3Wysqx5rbOFB', 
        amount: response.amount,
        currency: response.currency || 'INR',
        name: 'Restaurant System',
        description: 'Food Order',
        order_id: response.id,
        handler: (paymentResponse: any) => {
          console.log('Payment success:', paymentResponse);
          // Auto place the order after successful payment
          this.placeOrder();
        },
        modal: {
          ondismiss: () => {
            this.error = 'Payment was cancelled.';
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    },
    error: () => {
      this.error = 'Could not initiate payment. Please try again.';
    }
  });
}
}