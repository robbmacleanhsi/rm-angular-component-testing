import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { CrudlogicService, User } from './crudlogic.service';

describe('CrudlogicService', () => {
  let service: CrudlogicService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CrudlogicService]
    });
    service = TestBed.inject(CrudlogicService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllUsers', () => {
    it('should fetch all users', () => {
      const mockUsers: User[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com', designation: 'Developer' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', designation: 'Designer' }
      ];

      service.getAllUsers().subscribe(users => {
        expect(users.length).toBe(2);
        expect(users).toEqual(mockUsers);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });

    it('should handle error when fetching users fails', () => {
      service.getAllUsers().subscribe({
        next: () => fail('Should have failed with 404 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
          expect(error.error).toBe('Users not found');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Users not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getUserById', () => {
    it('should fetch user by id', () => {
      const mockUser: User = { id: 1, name: 'John Doe', email: 'john@example.com', designation: 'Developer' };
      const userId = 1;

      service.getUserById(userId).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${apiUrl}/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should handle error when user not found', () => {
      const userId = 999;

      service.getUserById(userId).subscribe({
        next: () => fail('Should have failed with 404 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${userId}`);
      req.flush('User not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createUser', () => {
    it('should create a new user', () => {
      const newUser: User = { name: 'New User', email: 'new@example.com', designation: 'Manager' };
      const createdUser: User = { id: 3, ...newUser };

      service.createUser(newUser).subscribe(user => {
        expect(user).toEqual(createdUser);
        expect(user.id).toBeDefined();
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);
      req.flush(createdUser);
    });

    it('should handle error when creating user fails', () => {
      const newUser: User = { name: 'Test User', email: 'invalid-email', designation: 'Developer' };

      service.createUser(newUser).subscribe({
        next: () => fail('Should have failed with 400 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Invalid user data', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', () => {
      const userId = 1;
      const updatedUser: User = { id: 1, name: 'Updated User', email: 'updated@example.com', designation: 'Senior Developer' };

      service.updateUser(userId, updatedUser).subscribe(user => {
        expect(user).toEqual(updatedUser);
        expect(user.name).toBe('Updated User');
      });

      const req = httpMock.expectOne(`${apiUrl}/${userId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedUser);
      req.flush(updatedUser);
    });

    it('should handle error when updating non-existent user', () => {
      const userId = 999;
      const updateData: User = { name: 'Test', email: 'test@test.com', designation: 'Tester' };

      service.updateUser(userId, updateData).subscribe({
        next: () => fail('Should have failed with 404 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${userId}`);
      req.flush('User not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', () => {
      const userId = 1;

      service.deleteUser(userId).subscribe(response => {
        // DELETE operations typically return void or null
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/${userId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle error when deleting non-existent user', () => {
      const userId = 999;

      service.deleteUser(userId).subscribe({
        next: () => fail('Should have failed with 404 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${userId}`);
      req.flush('User not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle server error when deleting user', () => {
      const userId = 1;

      service.deleteUser(userId).subscribe({
        next: () => fail('Should have failed with 500 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${userId}`);
      req.flush('Internal server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });



});
