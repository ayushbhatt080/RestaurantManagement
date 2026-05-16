
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItemService } from '../../shared/services/menu-item.service';
import { RestaurantService } from '../../shared/services/restaurant.service';


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

  constructor(private fb: FormBuilder, private menuItemService: MenuItemService, private restaurantService: RestaurantService) { }

  ngOnInit(): void {
    this.menuForm = this.fb.group({
      name: ['', Validators.required],
      menuType: ['Veg', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      restaurantId: ['', Validators.required]
    });
    this.menuItemService.getAllMenuItems().subscribe({ next: d => this.menuItems = d });
    this.restaurantService.getAll().subscribe({ next: d => this.restaurants = d });
  }

  openAdd(): void { this.isEditing = false; this.selectedItem = null; this.menuForm.reset({ menuType: 'Veg' }); this.showForm = true; this.message = ''; this.error = ''; }

  openEdit(item: any): void {
    this.isEditing = true; this.selectedItem = item;
    this.menuForm.patchValue({ ...item, restaurantId: item.restaurant?.id });
    this.showForm = true;
  }

  save(): void {
    if (this.menuForm.invalid) return;
    const obs = this.isEditing
      ? this.menuItemService.updateMenuItem(this.selectedItem.id, this.menuForm.value)
      : this.menuItemService.addMenuItem(this.menuForm.value);
    obs.subscribe({
      next: () => { this.message = this.isEditing ? 'Updated!' : 'Added!'; this.menuItemService.getAllMenuItems().subscribe({ next: d => this.menuItems = d }); this.showForm = false; },
      error: () => this.error = 'Save failed'
    });
  }

  delete(id: number): void {
    if (!confirm('Delete?')) return;
    this.menuItemService.deleteMenuItem(id).subscribe({ next: () => { this.message = 'Deleted!'; this.menuItemService.getAllMenuItems().subscribe({ next: d => this.menuItems = d }); } });
  }
}