import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudlogicService, User } from '../crudlogic.service';

@Component({
  selector: 'app-displayusers',
  imports: [CommonModule],
  templateUrl: './displayusers.component.html',
  styleUrl: './displayusers.component.css'
})
export class DisplayusersComponent implements OnInit {
  title = 'Display All Users';
  users: User[] = [];
  loading = false;
  error = '';
  private crudService = inject(CrudlogicService);

  ngOnInit(): void {
    this.loadAllUsers();
  }

  // Method to load all users from the service
  loadAllUsers(): void {
    this.loading = true;
    this.error = '';
    
    this.crudService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
        console.log('Users loaded successfully:', users);
      },
      error: (err) => {
        this.error = 'Failed to load users. Make sure JSON Server is running on port 3000.';
        this.loading = false;
        console.error('Error loading users:', err);
      }
    });
  }

  // Method to refresh the users list
  refreshUsers(): void {
    this.loadAllUsers();
  }

  // Method to delete a user
  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.crudService.deleteUser(id).subscribe({
        next: () => {
          console.log(`User with ID ${id} deleted successfully`);
          this.loadAllUsers(); // Reload the list after deletion
        },
        error: (err) => {
          this.error = 'Failed to delete user.';
          console.error('Error deleting user:', err);
        }
      });
    }
  }

  // TrackBy function for better performance with *ngFor
  trackByUserId(index: number, user: User): number {
    return user.id || index;
  }
}
