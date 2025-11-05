import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

// Mock components for testing routing
@Component({
  template: '<div>Users Component</div>',
  selector: 'app-users',
  standalone: true
})
class MockUsersComponent { }

@Component({
  template: '<div>Display Users Component</div>',
  selector: 'app-displayusers',
  standalone: true
})
class MockDisplayUsersComponent { }

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, MockUsersComponent, MockDisplayUsersComponent],
      providers: [
        provideRouter([
          { path: 'users', component: MockUsersComponent },
          { path: 'display', component: MockDisplayUsersComponent },
          { path: '', redirectTo: '/users', pathMatch: 'full' }
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct title', () => {
    expect(component.title).toEqual('Component Testing Example');
  });

  it('should render title in template', () => {
    const titleElement = fixture.debugElement.query(By.css('h1'));
    expect(titleElement?.nativeElement.textContent).toContain('Component Testing Example NA Dated 10/28/2025');
  });

  it('should display navigation links', () => {
    const navLinks = fixture.debugElement.queryAll(By.css('nav a'));
    expect(navLinks.length).toBeGreaterThan(0);
  });

  it('should have router outlet', () => {
    const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).toBeTruthy();
  });

  it('should navigate to users route', async () => {
    await router.navigate(['/users']);
    expect(location.path()).toBe('/users');
  });

  it('should navigate to display route', async () => {
    await router.navigate(['/display']);
    expect(location.path()).toBe('/display');
  });

  it('should contain Users link in navigation', () => {
    const usersLink = fixture.debugElement.query(By.css('a[routerLink="/users"]'));
    expect(usersLink?.nativeElement.textContent.trim()).toBe('Users');
  });

  it('should contain Display Users link in navigation', () => {
    const displayUsersLink = fixture.debugElement.query(By.css('a[routerLink="/display"]'));
    expect(displayUsersLink?.nativeElement.textContent.trim()).toBe('Display Users');
  });
});
