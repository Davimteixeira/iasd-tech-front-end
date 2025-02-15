import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login user and store tokens', () => {
    const mockResponse = {
      access: 'mock-access-token',
      refresh: 'mock-refresh-token'
    };

    service.login('test@example.com', 'password').subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('access_token')).toBe(mockResponse.access);
      expect(localStorage.getItem('refresh_token')).toBe(mockResponse.refresh);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/login/');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should register user', () => {
    const mockUser = {
      username: 'testuser', // ✅ Adicionado
      email: 'test@example.com',
      password: 'password123'
    };
    
    service.register(mockUser).subscribe();
    

    const req = httpMock.expectOne('http://localhost:8000/api/register/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
  });

  it('should refresh token when expired', () => {
    const mockResponse = { access: 'new-access-token', refresh: 'new-refresh-token' };
    localStorage.setItem('refresh_token', 'valid-refresh-token');

    service.refreshToken().subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('access_token')).toBe(mockResponse.access);
      expect(localStorage.getItem('refresh_token')).toBe(mockResponse.refresh);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/token/refresh/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ refresh: 'valid-refresh-token' });
    req.flush(mockResponse);
  });

  it('should handle refresh token failure and logout user', () => {
    localStorage.setItem('refresh_token', 'invalid-token');

    service.refreshToken().subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
        expect(localStorage.getItem('access_token')).toBeNull();
        expect(localStorage.getItem('refresh_token')).toBeNull();
      }
    });

    const req = httpMock.expectOne('http://localhost:8000/api/token/refresh/');
    req.flush({ error: 'Invalid refresh token' }, { status: 401, statusText: 'Unauthorized' });
  });

  it('should clear tokens on logout', () => {
    localStorage.setItem('access_token', 'test-token');
    localStorage.setItem('refresh_token', 'test-refresh-token');

    service.logout();

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
  });
});
