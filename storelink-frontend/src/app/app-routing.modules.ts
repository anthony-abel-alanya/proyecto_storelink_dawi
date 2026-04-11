import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { SignupComponent } from './component/signup/signup.component';
import { HomepageComponent } from './component/home/homepage/homepage.component';
import { NotFoundComponent } from './component/not-found/not-found/not-found.component';
import { CartComponent } from './component/cart/cart/cart.component';
import { AuthGuard } from './guard/auth.guard';
import { AdminHomeComponent } from './component/admin/admin-home/admin-home.component';
import { ProductCreateComponent } from './component/product/product-create/product-create.component';
import { ProductUpdateComponent } from './component/product/product-update/product-update.component';
import { ManageProductsComponent } from './component/product/manage-products/manage-products.component';
import { OrderStatusUpdateComponent } from './component/order/order-status-update/order-status-update.component';
import { PromotionsComponent } from './component/admin/promotions/promotions.component';
import { CategoryManagementComponent } from './component/admin/category-management/category-management.component';
import { PaymentCreateComponent } from './component/payment/payment-create/payment-create.component';
import { OrderPlacedComponent } from './component/order/order-placed/order-placed.component';
import { CustomerProfileComponent } from './component/customer/customer-profile/customer-profile.component';
import { OrderHistoryComponent } from './component/order/order-history/order-history.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomepageComponent },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'CUSTOMER'] },
  },
  {
    path: 'checkout',
    component: PaymentCreateComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'CUSTOMER'] },
  },
  {
    path: 'order-placed',
    component: OrderPlacedComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'CUSTOMER'] },
  },
  {
    path: 'profile',
    component: CustomerProfileComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'CUSTOMER'] },
  },
  {
    path: 'order-history',
    component: OrderHistoryComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'CUSTOMER'] },
  },
  {
    path: 'admin-home',
    component: AdminHomeComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'add-product',
    component: ProductCreateComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'update-product',
    component: ProductUpdateComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'manage-products',
    component: ManageProductsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'order-status-update',
    component: OrderStatusUpdateComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'promotions',
    component: PromotionsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'categories',
    component: CategoryManagementComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];
