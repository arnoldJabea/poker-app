import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.backend_url}/auth`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('login', () => {
    it('should send POST request and return access_token', async () => {
      const mockToken = { access_token: 'abc123' };
      const credentials = { username: 'test', password: 'pass' };

      const promise = service.login(credentials);

      const req = httpMock.expectOne(`${baseUrl}/signIn`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);

      req.flush(mockToken);

      const result = await promise;
      expect(result).toEqual(mockToken);
    });
  });

  describe('signUp', () => {
    it('should send POST request and return access_token', async () => {
      const mockToken = { access_token: 'xyz789' };
      const signUpData = {
        username: 'newuser',
        password: 'password',
        email: 'test@example.com',
        nom: 'Doe',
        prenom: 'John',
        pays: 'France',
        date_naissance: '2000-01-01'
      };

      const promise = service.signUp(signUpData);

      const req = httpMock.expectOne(`${baseUrl}/signUp`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(signUpData);

      req.flush(mockToken);

      const result = await promise;
      expect(result).toEqual(mockToken);
    });
  });

  describe('Token Storage', () => {
    it('should store token with setSessionToken', () => {
      service.setSessionToken('mytoken123');
      expect(localStorage.getItem('access_token')).toBe('mytoken123');
    });

    it('should retrieve token with getToken', () => {
      localStorage.setItem('access_token', 'mytoken456');
      expect(service.getToken()).toBe('mytoken456');
    });

    it('should remove token with logout', () => {
      localStorage.setItem('access_token', 'toremove');
      service.logout();
      expect(localStorage.getItem('access_token')).toBeNull();
    });

    it('should return true when token exists in isAuthenticated', () => {
      localStorage.setItem('access_token', 'exists');
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('should return false when no token in isAuthenticated', () => {
      localStorage.removeItem('access_token');
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('session$', () => {
    it('should emit default session initially', (done) => {
      service.session$.subscribe((session) => {
        expect(session).toEqual({
          prenom: '',
          nom: '',
          role: '',
          isAuthenticated: false
        });
        done();
      });
    });
  });
});
