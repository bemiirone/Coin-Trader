import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('forgotPassword', () => {
    it('should POST to /api/users/password-reset/forgot-password with email', () => {
      const email = 'test@example.com';
      const mockResponse = { message: 'If an account with that email exists, a reset link has been sent' };

      service.forgotPassword(email).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.backendUrl}/api/users/password-reset/forgot-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email });

      req.flush(mockResponse);
    });
  });

  describe('resetPassword', () => {
    it('should POST to /api/users/password-reset/reset-password with token and password', () => {
      const token = 'reset-token-123';
      const password = 'newpassword';
      const mockResponse = { message: 'Password reset successful' };

      service.resetPassword(token, password).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.backendUrl}/api/users/password-reset/reset-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ token, password });

      req.flush(mockResponse);
    });
  });
});
