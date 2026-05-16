import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Feedback } from '../../model/feedback';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private baseUrl = `${environment.apiUrl}/api/feedback`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }
  replyFeedback(id: number, data: any): Observable<any> {
  return this.http.put(
    `${this.baseUrl}/${id}/reply`,
    data,
    { headers: this.getHeaders() }
  ).pipe(
    catchError(err => throwError(() => err))
  );
}
  // ✅ Used by DashboardComponent
  getAllFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(
      this.baseUrl,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(err => throwError(() => err))
    );
  }

  // ✅ Submit Feedback
  submitFeedback(feedback: any): Observable<any> {
    return this.http.post(
      this.baseUrl,
      feedback,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(err => throwError(() => err))
    );
  }

  // ✅ Tests require this name
  getFeedbackAllDetails(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(
      this.baseUrl,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(err => throwError(() => err))
    );
  }

  // ✅ Get feedback by menu item
  getFeedbackByMenuItem(menuItemId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(
      `${this.baseUrl}/menu/${menuItemId}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(err => throwError(() => err))
    );
  }

  // ✅ Used by DashboardComponent
  getFeedbackByUser(userId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(
      `${this.baseUrl}/user/${userId}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(err => throwError(() => err))
    );
  }

}