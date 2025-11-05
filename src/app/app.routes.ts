import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { DisplayusersComponent } from './displayusers/displayusers.component';

export const routes: Routes = [
    { path: 'users', component: UsersComponent },
    {path:'display',component:DisplayusersComponent}
];
