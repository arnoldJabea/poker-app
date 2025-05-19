import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  baseurl = `${environment.backend_url.replace(/\/$/, '')}/player`;

  constructor(private http: HttpClient) { }

  async findAll(): Promise<any> {
    return await lastValueFrom(this.http.get<any>(`${this.baseurl}`));
  }

  async findByUsername(username: string): Promise<any> {
    return await lastValueFrom(this.http.get<any>(`${this.baseurl}/${username}`));
  }

  async motherlode(playerId: number): Promise<any> {
    return await lastValueFrom(this.http.get<any>(`${this.baseurl}/motherlode/${playerId}`));
  }
   async getMe(): Promise<any> {
    return await lastValueFrom(this.http.get(`${this.baseurl}/me`));
  }
}
