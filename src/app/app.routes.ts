import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio';
import { BusquedaComponent } from './busqueda/busqueda';
import { DetalleComponent } from './detalle/detalle'; // 👈 1. Importa el componente de detalle
import { LoginComponent } from './auth/login';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'buscador', component: BusquedaComponent },
  { path: 'curso/:id', component: DetalleComponent }, // 👈 2. Registra la ruta parametrizada
  { path: 'ingresar', component: LoginComponent },
  { path: '**', redirectTo: '' },
];
