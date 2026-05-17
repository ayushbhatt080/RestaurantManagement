import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurant } from '../../model/restaurant';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { User } from '../../model/user';
import { AssignManagerRequest } from '../../model/loginrequest';
import { RestaurantManagerAssignmentDTO } from '../../model/restaurant-manager-assignment-dto';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  private apiUrl = `${environment.apiUrl}/api/restaurants`;

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
    getAssignments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/assignmanager`);
  }

  // ✅ get all
  getAll(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.apiUrl, this.getHeaders());
  }

  // ✅ get by id
  getRestaurantById(id: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(
      `${this.apiUrl}/${id}`,
      this.getHeaders()
    );
  }

  // ✅ create
  createRestaurant(details: Restaurant): Observable<Restaurant> {
    return this.http.post<Restaurant>(
      this.apiUrl,
      details,
      this.getHeaders()
    );
  }

  // ✅ update
  updateRestaurant(id: number, details: Restaurant): Observable<Restaurant> {
    return this.http.put<Restaurant>(
      `${this.apiUrl}/${id}`,
      details,
      this.getHeaders()
    );
  }

  // ✅ delete
  deleteRestaurant(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      this.getHeaders()
    );
  }

  // ✅ aliases (used in tests)
  create(data: Restaurant): Observable<Restaurant> {
    return this.createRestaurant(data);
  }

  update(id: number, data: Restaurant): Observable<Restaurant> {
    return this.updateRestaurant(id, data);
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  // ✅ user details (no auth required in test)
  getUserDetails(): Observable<User[]> {
  return this.http.get<User[]>(
    `${this.apiUrl}/users`,
    this.getHeaders()
  );
}

 assignManager(request: any): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/assignmanager`,
    request,
    this.getHeaders()
  );
}

getAllAssignments(): Observable<RestaurantManagerAssignmentDTO[]> {
  return this.http.get<RestaurantManagerAssignmentDTO[]>(
    `${this.apiUrl}/assignmanager`,
    this.getHeaders()
  );
}

}
