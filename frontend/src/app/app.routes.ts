import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { PizzaListComponent } from './components/pizza-list/pizza-list.component';
import { MisPedidosComponent } from './components/mis-pedidos/mis-pedidos.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '',            redirectTo: 'pizzas', pathMatch: 'full' },
  { path: 'login',       component: LoginComponent },
  { path: 'registro',    component: RegistroComponent },
  { path: 'pizzas',      component: PizzaListComponent },
  { path: 'mis-pedidos', component: MisPedidosComponent, canActivate: [authGuard] },
  { path: 'pedido',      component: PizzaListComponent,  canActivate: [authGuard] }
];
