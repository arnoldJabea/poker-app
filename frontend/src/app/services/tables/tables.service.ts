import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CreateTablesDto } from './dto/create-tables.dto';
import { UpdateTablesDto } from './dto/update-tables.dto';
import { Tables } from './entities/tables.entity';

@Injectable({
  providedIn: 'root'
})
export class TablesService {
  baseUrl = `${environment.backend_url}/tables`;

  constructor(private http: HttpClient) {}

  httpOptions = { withCredentials: true };

  create(createTablesDto: CreateTablesDto): Promise<Tables> {
    return lastValueFrom(
      this.http.post<Tables>(this.baseUrl, createTablesDto, this.httpOptions).pipe(
        catchError(this.handleError)
      )
    );
  }

  findAll(): Promise<Tables[]> {
    return lastValueFrom(
      this.http.get<Tables[]>(this.baseUrl, this.httpOptions).pipe(
        catchError(this.handleError)
      )
    );
  }

  findOne(id_tables: number): Promise<Tables> {
    return lastValueFrom(
      this.http.get<Tables>(`${this.baseUrl}/${id_tables}`, this.httpOptions).pipe(
        catchError(this.handleError)
      )
    );
  }

  update(id_tables: number, updateTablesDto: UpdateTablesDto): Promise<Tables> {
    return lastValueFrom(
      this.http.patch<Tables>(`${this.baseUrl}/${id_tables}`, updateTablesDto, this.httpOptions).pipe(
        catchError(this.handleError)
      )
    );
  }

  remove(id_tables: number): Promise<Tables> {
    return lastValueFrom(
      this.http.delete<Tables>(`${this.baseUrl}/${id_tables}`, this.httpOptions).pipe(
        catchError(this.handleError)
      )
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue!';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur client : ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Erreur serveur : ${error.status} - ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
