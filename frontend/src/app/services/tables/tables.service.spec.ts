import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TablesService } from './tables.service';
import { environment } from '../../../environments/environment';
import { CreateTablesDto } from './dto/create-tables.dto';
import { UpdateTablesDto } from './dto/update-tables.dto';
import { Tables } from './entities/tables.entity';

describe('TablesService', () => {
  let service: TablesService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.backend_url}/tables`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TablesService]
    });
    service = TestBed.inject(TablesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#create', () => {
    it('should POST and return created table', async () => {
      const dto: CreateTablesDto = { name: 'Table 1' } as any;
      const mockResponse: Tables = { id: 1, name: 'Table 1' } as any;

      const promise = service.create(dto);

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);

      const result = await promise;
      expect(result).toEqual(mockResponse);
    });
  });

  describe('#findAll', () => {
    it('should GET and return array of tables', async () => {
      const mockTables: Tables[] = [{ id: 1, name: 'Table 1' }, { id: 2, name: 'Table 2' }] as any;

      const promise = service.findAll();

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockTables);

      const result = await promise;
      expect(result).toEqual(mockTables);
    });
  });

  describe('#findOne', () => {
    it('should GET and return a single table', async () => {
      const id = 42;
      const mockTable: Tables = { id, name: 'Table 42' } as any;

      const promise = service.findOne(id);

      const req = httpMock.expectOne(`${baseUrl}/${id}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockTable);

      const result = await promise;
      expect(result).toEqual(mockTable);
    });
  });

  describe('#update', () => {
    it('should PATCH and return updated table', async () => {
      const id = 7;
      const dto: UpdateTablesDto = { name: 'Updated Table' } as any;
      const mockUpdated: Tables = { id, name: 'Updated Table' } as any;

      const promise = service.update(id, dto);

      const req = httpMock.expectOne(`${baseUrl}/${id}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(dto);
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockUpdated);

      const result = await promise;
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('#remove', () => {
    it('should DELETE and return removed table', async () => {
      const id = 99;
      const mockDeleted: Tables = { id, name: 'Deleted Table' } as any;

      const promise = service.remove(id);

      const req = httpMock.expectOne(`${baseUrl}/${id}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockDeleted);

      const result = await promise;
      expect(result).toEqual(mockDeleted);
    });
  });

  describe('#handleError', () => {
    it('should handle client-side error correctly', (done) => {
      spyOn(console, 'error');

      const errorEvent = new ErrorEvent('Client Error', {
        message: 'Something went wrong on the client'
      });

      service['handleError']({ error: errorEvent } as any).subscribe({
        error: (err: Error) => {
          expect(err.message).toContain('Erreur client');
          done();
        }
      });
    });

    it('should handle server-side error correctly', (done) => {
      spyOn(console, 'error');

      service['handleError']({ status: 500, message: 'Internal Error', error: {} } as any).subscribe({
        error: (err: Error) => {
          expect(err.message).toContain('Erreur serveur');
          done();
        }
      });
    });
  });
});
