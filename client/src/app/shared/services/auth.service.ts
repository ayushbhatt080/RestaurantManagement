import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../model/user';
import { Observable, of } from 'rxjs';
import { LoginRequest } from '../../model/loginrequest';
import { LoginResponse } from '../../model/login-response';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    };
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/api/auth/register`, user);
  }

  registerUser(user: User): Observable<User> {
    return this.register(user);
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/api/auth/login`,
      loginRequest
    );
  }

  saveLoginData(response: any): void {
    const normalizedRole = this.normalizeRole(response.role);

    localStorage.setItem('token', response.token);
    localStorage.setItem('userId', String(response.userId || response.id));
    localStorage.setItem('username', response.username);
    localStorage.setItem('email', response.email || '');

    if (normalizedRole) {
      localStorage.setItem('role', normalizedRole);
    }
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/api/auth/users`,
      this.getAuthHeaders()
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return this.normalizeRole(localStorage.getItem('role'));
  }

  getUserId(): number {
    return Number(localStorage.getItem('userId') || 0);
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getLoginStatus(): boolean {
    return this.isLoggedIn();
  }

  getLoggedInUser(): Observable<any> {
    return of({
      id: this.getUserId(),
      userId: this.getUserId(),
      username: this.getUsername(),
      email: localStorage.getItem('email'),
      role: this.getRole()
    });
  }

  logout(): void {
    localStorage.clear();
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isManager(): boolean {
    return this.getRole() === 'MANAGER';
  }

  isCustomer(): boolean {
    return this.getRole() === 'CUSTOMER';
  }

  private normalizeRole(role: string | null): string | null {
    if (!role) return null;

    const cleaned = role.startsWith('ROLE_') ? role.slice(5) : role;
    return cleaned.toUpperCase();
  }
}