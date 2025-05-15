import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { CreateTablesDto } from './dto/create-tables.dto';
import { UpdateTablesDto } from './dto/update-tables.dto';
import { Tables } from './entities/tables.entity';

@Injectable({
  providedIn: 'root',
})
export class TablesService {
  baseurl = `${environment.backend_url}/tables`;

  constructor(private http: HttpClient) {}

  httpOptions = {
    withCredentials: true,
  };

	create(createTablesDto: CreateTablesDto): Promise<Tables> {
		return lastValueFrom(this.http.post<Tables>(this.baseurl, createTablesDto, this.httpOptions));
	}

	findAll(): Promise<Tables[]> {
		return lastValueFrom(this.http.get<Tables[]>(this.baseurl, this.httpOptions));
	}

	findOne(id_tables: number): Promise<Tables> {
		return lastValueFrom(this.http.get<Tables>(`${this.baseurl}/${id_tables}`, this.httpOptions));
	}

	update(id_tables: number, updateTablesDto: UpdateTablesDto): Promise<Tables> {
		return lastValueFrom(this.http.patch<Tables>(`${this.baseurl}/${id_tables}`, updateTablesDto, this.httpOptions));
	}

	remove(id_tables: number): Promise<Tables> {
		return lastValueFrom(this.http.delete<Tables>(`${this.baseurl}/${id_tables}`, this.httpOptions));
	}

}
