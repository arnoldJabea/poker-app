import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseurl = `${environment.backend_url}/auth`;

  constructor(private http: HttpClient) { }

  private accessTokenKey = 'access_token';

  private sessionSubject = new BehaviorSubject<{
    prenom: string;
    nom: string;
    role: string;
    isAuthenticated: boolean;
  }>({
    prenom: '',
    nom: '',
    role: '',
    isAuthenticated: false
  });

  public session$ = this.sessionSubject.asObservable();

  async login(credentials: { username: string; password: string }): Promise<{ access_token: string }> {
    const response = await lastValueFrom(this.http.post<{ access_token: string }>(
      `${this.baseurl}/signIn`, credentials
    ));
    return response;
  }

  async signUp(data: {
    username: string;
    password: string;
    email: string;
    nom: string;
    prenom: string;
    pays: string;
    date_naissance: string;
  }): Promise<{ access_token: string }> {
    const response = await lastValueFrom(this.http.post<{ access_token: string }>(
      `${this.baseurl}/signUp`, data
    ));
    return response;
  }

  setSessionToken(token: string) {
    localStorage.setItem(this.accessTokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  logout() {
    localStorage.removeItem(this.accessTokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
