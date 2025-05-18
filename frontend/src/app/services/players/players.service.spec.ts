import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PlayersService } from './players.service';
import { environment } from '../../../environments/environment';

describe('PlayersService', () => {
  let service: PlayersService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.backend_url}/player`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlayersService]
    });

    service = TestBed.inject(PlayersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#findAll', () => {
    it('should return data from GET /player', async () => {
      const mockData = [{ username: 'user1' }, { username: 'user2' }];

      const promise = service.findAll();

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);

      const result = await promise;
      expect(result).toEqual(mockData);
    });
  });

  describe('#findByUsername', () => {
    it('should return data from GET /player/:username', async () => {
      const username = 'john123';
      const mockPlayer = { username: 'john123', score: 100 };

      const promise = service.findByUsername(username);

      const req = httpMock.expectOne(`${baseUrl}/${username}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPlayer);

      const result = await promise;
      expect(result).toEqual(mockPlayer);
    });
  });

  describe('#motherlode', () => {
    it('should return data from GET /player/motherlode', async () => {
      const mockResult = { success: true, bonus: 1000 };

      const promise = service.motherlode();

      const req = httpMock.expectOne(`${baseUrl}/motherlode`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResult);

      const result = await promise;
      expect(result).toEqual(mockResult);
    });
  });

  describe('#handleError', () => {
    it('should handle client error properly', (done) => {
      spyOn(console, 'error');

      service['handleError']({ error: new ErrorEvent('ClientError', { message: 'Échec' }) } as any)
        .subscribe({
          error: (err: Error) => {
            expect(err.message).toContain('Erreur client : Échec');
            done();
          }
        });
    });

    it('should handle server error properly', (done) => {
      spyOn(console, 'error');

      service['handleError']({ status: 500, message: 'Erreur serveur', error: {} } as any)
        .subscribe({
          error: (err: Error) => {
            expect(err.message).toContain('Erreur serveur: 500 - Erreur serveur');
            done();
          }
        });
    });
  });
});
