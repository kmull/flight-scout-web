import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SearchComponent } from './components/search.component/search.component';
import { authGuard } from './guards/auth-guard';
import { noAuthGuard } from './guards/no-auth.guard';
import { LandingComponent } from './components/landing/landing.component';
import { SidebarLayoutComponent } from './components/layout/sidebar-layout/sidebar-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [noAuthGuard] },
  {
    path: '',
    component: SidebarLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent }
    ]
  }
  // { path: 'search', component: SearchComponent, canActivate: [authGuard] },
  // { path: '', redirectTo: '/login', pathMatch: 'full' }
];
