import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { MenuItemComponent } from './component/menu-item/menu-item.component';
import { OrderComponent } from './component/order/order.component';
import { RestaurantComponent } from './component/restaurant/restaurant.component';
import { AuthGuard } from './auth.guard';
import { AssignmanagerComponent } from './component/assignmanager/assignmanager.component';
import { FeedbackComponent } from './component/feedback/feedback.component';
import { CustomerdetailsComponent } from './component/customerdetails/customerdetails.component';
import { LandingpageComponent } from './landingpage/landingpage';

const routes: Routes = [

  { path: '', redirectTo: '/landingpage', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard', component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'restaurant', component: RestaurantComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'assign-manager', component: AssignmanagerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'menu-item', component: MenuItemComponent,
    canActivate: [AuthGuard]
  },
  { path: 'customerdetails', component: CustomerdetailsComponent },
  { path: 'order', component: OrderComponent, canActivate: [AuthGuard] },
  { path: 'feedback', component: FeedbackComponent, canActivate: [AuthGuard] },
  { path: 'landingpage', component: LandingpageComponent },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
