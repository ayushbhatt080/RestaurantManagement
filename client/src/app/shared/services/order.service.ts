import { Injectable } from '@angular/core';
// import { Httpimport { Observable } from 'rxjs';import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = `${environment.apiUrl}/api/orders`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // private getHeaders() {
  //   return {
  //     headers: new HttpHeaders({
  //       Authorization: `Bearer ${this.authService.getToken()}`
  //     })
  //   };
  // }
  private getHeaders() {

    const token = this.authService.getToken();

    if (!token) {
      return {}; // ❗ header hi mat bhej
    }

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };

  }

  // ✅ Place order
  placeOrder(data: any): Observable<any> {
    return this.http.post<any>(
      this.baseUrl,
      data,
      this.getHeaders()
    );
  }

  // ✅ Get all orders
  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(
      this.baseUrl
      ,this.getHeaders()
    );
  }

  // ✅ Get order by ID
  getOrderById(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/${id}`,
      this.getHeaders()
    );
  }

  // ✅ Get orders by user ID
  getOrdersByUserId(id: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/userId/${id}`,
      this.getHeaders()
    );
  }

  // ✅ Alias
  getOrdersByCustomer(id: number): Observable<any[]> {
    return this.getOrdersByUserId(id);
  }

  // ✅ Cancel order
  cancelOrder(id: number): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/${id}/cancel`,
      {},
      this.getHeaders()
    );
  }

  // ✅ Update status
  // Backend endpoint: PUT /api/orders/{id}/status/{status}
  updateOrderStatus(orderId: any, status: string): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/${orderId}/status/${status}`,
      {},
      this.getHeaders()
    );
  }
  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/my`
      ,this.getHeaders()
    );
  }

}






// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Order } from '../../model/order';
// import { environment } from '../../../environments/environment';
// import { AuthService } from './auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class OrderService {

//   private baseUrl = `${environment.apiUrl}/api/orders`;

//   constructor(
//     private http: HttpClient,
//     private authService: AuthService   // ✅ ADD THIS
//   ) {}

//   // ✅ ADD THIS METHOD
//   private getHeaders() {
//     return {
//       headers: new HttpHeaders({
//         Authorization: `Bearer ${this.authService.getToken()}`
//       })
//     };
//   }

//   // ✅ FIXED
//   placeOrder(data: any): Observable<Order> {
//     return this.http.post<Order>(
//       this.baseUrl,
//       data,
//       this.getHeaders()   // ✅ THIS IS THE FINAL FIX
//     );
//   }

//   getAllOrders(): Observable<Order[]> {
//     return this.http.get<Order[]>(
//       this.baseUrl,
//       this.getHeaders()
//     );
//   }

//   getOrderById(id: number): Observable<Order> {
//     return this.http.get<Order>(
//       `${this.baseUrl}/${id}`,
//       this.getHeaders()
//     );
//   }

//   getOrdersByCustomer(id: number): Observable<any> {
//     return this.http.get(
//       `${this.baseUrl}/userId/${id}`,
//       this.getHeaders()
//     );
//   }

//   cancelOrder(id: number) {
//     return this.http.put(
//       `${this.baseUrl}/${id}/cancel`,
//       {},
//       this.getHeaders()
//     );
//   }
// }