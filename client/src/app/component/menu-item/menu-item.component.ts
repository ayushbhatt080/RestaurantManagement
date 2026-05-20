import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MenuItemService } from '../../shared/services/menu-item.service';
import { RestaurantService } from '../../shared/services/restaurant.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {

  menuItems: any[] = [];
  restaurants: any[] = [];
  menuForm!: FormGroup;
  selectedItem: any = null;
  searchText = '';
  showForm = false;
  isEditing = false;
  message = '';
  error = '';

  selectedIds: Set<number> = new Set<number>();

  constructor(
    private fb: FormBuilder,
    private menuItemService: MenuItemService,
    private restaurantService: RestaurantService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.menuForm = this.fb.group({
      name: ['', Validators.required],
      menuType: ['Veg', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      restaurantId: ['', Validators.required]
    });

    this.loadMenuItems();
    this.loadRestaurants();
  }

  loadMenuItems(): void {
    this.menuItemService.getMyMenuItems().subscribe({
      next: d => {
        this.menuItems = d;
        this.selectedIds.clear();
      },
      error: err => {
        console.error('LOAD MENU ITEMS ERROR:', err);
        this.error = 'Failed to load menu items';
      }
    });
  }

  loadRestaurants(): void {
    this.restaurantService.getMyRestaurants().subscribe({
      next: d => this.restaurants = d,
      error: err => {
        console.error('LOAD RESTAURANTS ERROR:', err);
        this.error = 'Failed to load restaurants';
      }
    });
  }

  openAdd(): void {
    this.isEditing = false;
    this.selectedItem = null;
    this.menuForm.reset({ menuType: 'Veg' });
    this.showForm = true;
    this.message = '';
    this.error = '';
  }

  openEdit(item: any): void {
    this.isEditing = true;
    this.selectedItem = item;
    this.menuForm.patchValue({
      ...item,
      restaurantId: item.restaurant?.id
    });
    this.showForm = true;
  }

  save(): void {
    if (this.menuForm.invalid) return;

    const payload: any = {
      name: this.menuForm.value.name,
      menuType: this.menuForm.value.menuType,
      price: this.menuForm.value.price,
      quantity: this.menuForm.value.quantity,
      restaurant: {
        id: this.menuForm.value.restaurantId
      }
    };

    const obs = this.isEditing
      ? this.menuItemService.updateMenuItem(this.selectedItem.id, payload)
      : this.menuItemService.addMenuItem(payload);

    obs.subscribe({
      next: () => {
        this.message = this.isEditing ? 'Updated!' : 'Added!';
        this.error = '';
        this.showForm = false;
        this.loadMenuItems();
      },
      error: (err) => {
        console.error('SAVE ERROR:', err);
        this.error = err.error?.error || 'Save failed';
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this menu item?')) return;

    this.message = '';
    this.error = '';

    this.menuItemService.deleteMenuItem(id).subscribe({
      next: () => {
        this.message = 'Deleted!';
        this.selectedIds.delete(id);
        this.menuItems = this.menuItems.filter(item => item.id !== id);
      },
      error: (err) => {
        console.error('DELETE ERROR:', err);
        this.error = err.error?.error || 'Delete failed';
        this.loadMenuItems();
      }
    });
  }

  toggleSelectItem(id: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedIds.add(id);
    } else {
      this.selectedIds.delete(id);
    }
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.selectedIds.clear();

    if (checked) {
      this.menuItems.forEach(item => {
        if (item.id !== undefined && item.id !== null) {
          this.selectedIds.add(item.id);
        }
      });
    }
  }

  isSelected(id: number): boolean {
    return this.selectedIds.has(id);
  }

  isAllSelected(): boolean {
    return this.menuItems.length > 0 && this.selectedIds.size === this.menuItems.length;
  }

  isSomeSelected(): boolean {
    return this.selectedIds.size > 0 && !this.isAllSelected();
  }

  clearSelection(): void {
    this.selectedIds.clear();
  }

  deleteSelected(): void {
    const ids = Array.from(this.selectedIds);

    if (ids.length === 0) return;

    if (!confirm(`Delete ${ids.length} selected menu item(s)?`)) return;

    this.message = '';
    this.error = '';

    forkJoin(ids.map(id => this.menuItemService.deleteMenuItem(id))).subscribe({
      next: () => {
        this.message = `${ids.length} item(s) deleted!`;
        this.menuItems = this.menuItems.filter(item => !this.selectedIds.has(item.id));
        this.selectedIds.clear();
      },
      error: (err) => {
        console.error('BULK DELETE ERROR:', err);
        this.error = err.error?.error || 'Bulk delete failed';
        this.loadMenuItems();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}