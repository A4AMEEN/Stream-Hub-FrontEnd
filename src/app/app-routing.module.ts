import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './component/landing/landing.component';
import { LoginComponent } from './component/login/login.component';
import { SignupComponent } from './component/signup/signup.component';
import { AdminHomeComponent } from './component/admin-home/admin-home.component';
import { AuthGuard } from './Guards/auth-guard.guard';
import { AdminGuard } from './Guards/admin-guard.guard';
import { ProfileComponent } from './component/profile/profile.component';
import { UsersComponent } from './component/admin/users/users.component';
import { CategoriesComponent } from './component/admin/categories/categories.component';
import { OtpComponent } from './component/otp/otp.component';

const routes: Routes = [
  { path: '', component: LandingComponent},
  { path: 'landing', component: LandingComponent},
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LoginComponent,canActivate: [AuthGuard]},
  { path: 'signup',component: SignupComponent,canActivate: [AuthGuard]},
  { path: 'adminHome', component: AdminHomeComponent, canActivate: [AdminGuard],children: [
    { path: 'users', component: UsersComponent },
    { path: 'categories', component: CategoriesComponent }
  ] },
  {path:'otp',component:OtpComponent}
  // Add more routes as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
