import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { lastValueFrom, BehaviorSubject } from 'rxjs';
import { AuthSession } from './auth-session.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseurl = `${environment.backend_url}/auth`;
  private accessTokenKey = 'access_token';

  private sessionSubject = new BehaviorSubject<AuthSession>({
    prenom: '',
    nom: '',
    role: '',
    isAuthenticated: false
  });

  public session$ = this.sessionSubject.asObservable();

  constructor(private http: HttpClient) { }

  async login(credentials: { username: string; password: string }): Promise<{ access_token: string }> {
    const response = await lastValueFrom(
      this.http.post<{ access_token: string }>(`${this.baseurl}/signIn`, credentials)
    );
    this.setSessionToken(response.access_token);
    this.sessionSubject.next({
      prenom: '',
      nom: '',
      role: '',
      isAuthenticated: true
    });
    return response;
  }

  async signUp(data: { username: string; password: string }): Promise<{ access_token: string }> {
    const response = await lastValueFrom(
      this.http.post<{ access_token: string }>(`${this.baseurl}/signUp`, data)
    );
    this.setSessionToken(response.access_token);
    this.sessionSubject.next({
      prenom: '',
      nom: '',
      role: '',
      isAuthenticated: true
    });
    return response;
  }
  async getProfile(): Promise<any> {
    const headers = {
      Authorization: `Bearer ${this.getToken()}`,
    };
    return await lastValueFrom(this.http.get(`${this.baseurl}/profile`, { headers }));
  }

  setSessionToken(token: string) {
    localStorage.setItem(this.accessTokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  logout() {
    localStorage.removeItem(this.accessTokenKey);
    this.sessionSubject.next({
      prenom: '',
      nom: '',
      role: '',
      isAuthenticated: false
    });
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}