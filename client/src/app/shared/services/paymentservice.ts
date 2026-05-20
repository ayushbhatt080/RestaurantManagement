import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  // Backend URL
  private baseUrl = `${environment.apiUrl}/api/payment`;

  constructor(private http: HttpClient) { }

  // Create Razorpay Order
  createOrder(amount: number): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/createOrder?amount=${amount * 100}`,
      {}
    );
  }

  // Optional: Verify Payment API
  verifyPayment(paymentData: any): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/verify`,
      paymentData
    );
  }
}
