import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  text = 'User Contact Form Example';
  contactForm!: FormGroup;
  
  contact = {
    name: '',
    email: '',
    designation: ''
  };
  submitted = false;

  constructor() {
    this.createForm();
  }

  createForm(): void {
    this.contactForm = new FormGroup({
      'name': new FormControl(this.contact.name, [
        Validators.required,
        Validators.minLength(4)
      ]),
      'email': new FormControl(this.contact.email, [
        Validators.required,
        Validators.email
      ]),
      'designation': new FormControl(this.contact.designation, Validators.required)
    });
  }

  onSubmit(): void {
    this.submitted = true;
  }
}