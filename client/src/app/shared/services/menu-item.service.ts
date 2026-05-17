import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItem } from '../../model/menu-item';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MenuItemService {


  private apiUrl = `${environment.apiUrl}/api/menuItems`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`
      })
    };
  }

  // Get all menu items
  getAllMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(
      this.apiUrl,
      this.getHeaders()
    );
  }
  getAll():Observable<MenuItem[]>{
    return this.http.get<MenuItem[]>(
      this.apiUrl,
      this.getHeaders()
    )
  }

  // Get menu items by restaurant
  getMenuItemsByRestaurant(restaurantId: number): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(
      `${this.apiUrl}/restaurant/${restaurantId}`,
      this.getHeaders()
    );
  }


  // Get menu item by ID
  getMenuItemById(id: number): Observable<MenuItem> {
    return this.http.get<MenuItem>(
      `${this.apiUrl}/${id}`,
      this.getHeaders()
    );
  }
  
addMenuItem(data: any): Observable<any> {
  return this.createMenuItem(data);
}


  // Create menu item
  createMenuItem(menuItem: MenuItem): Observable<MenuItem> {
    return this.http.post<MenuItem>(
      this.apiUrl,
      menuItem,
      this.getHeaders()
    );
  }

  // Update menu item
  updateMenuItem(id: number, menuItem: MenuItem): Observable<MenuItem> {
    return this.http.put<MenuItem>(
      `${this.apiUrl}/${id}`,
      menuItem,
      this.getHeaders()
    );
  }

  // Delete menu item
  deleteMenuItem(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      this.getHeaders()
    );
  }
  

}

