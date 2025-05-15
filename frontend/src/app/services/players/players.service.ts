import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { lastValueFrom, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  baseurl = `${environment.backend_url}/player`;

  constructor(private http: HttpClient) {}

  async findAll(): Promise<any> {
    return await lastValueFrom(this.http.get<any>(`${this.baseurl}`));
  }

  async findByUsername(username: string): Promise<any> {
    return await lastValueFrom(this.http.get<any>(`${this.baseurl}/${username}`));
  }

  async motherlode(): Promise<any> {
    return await lastValueFrom(this.http.get<any>(`${this.baseurl}/motherlode`));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Erreur inconnue!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur client : ${error.error.message}`;
    } else {
      errorMessage = `Erreur serveur: ${error.status} - ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
