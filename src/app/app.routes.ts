import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio';
import { BusquedaComponent } from './busqueda/busqueda';
import { DetalleComponent } from './detalle/detalle';
import { LoginComponent } from './auth/login';
import { HistorialComponent } from './historial/historial';
import { PerfilComponent } from './perfil/perfil';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'buscador', component: BusquedaComponent },
  { path: 'curso/:id', component: DetalleComponent },
  { path: 'ingresar', component: LoginComponent },
  { path: 'historial', component: HistorialComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: '**', redirectTo: '' },
];
