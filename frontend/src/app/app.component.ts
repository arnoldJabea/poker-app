import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment'; // adapte le chemin si nécessaire

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true
})
export class AppComponent implements OnInit {
  title = 'Poker-Front';
  tables: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>(`${environment.backend_url}/tables`).subscribe({
      next: (data) => {
        this.tables = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des tables', err);
      }
    });
  }
}