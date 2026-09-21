import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Nav } from './nav/nav';
import { Footer } from './footer/footer';
import { AccesibilidadService } from './services/accesibilidad.service'; // 👈 1. Importación del servicio de accesibilidad

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, Nav, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('sistemac');
  terminoBusqueda: string = '';

  // 🆕 2. Variable para controlar el despliegue del menú flotante de accesibilidad
  mostrarMenu: boolean = false;

  // 🛠️ CORREGIDO: Unificamos los dos constructores en uno solo para evitar el error de duplicidad
  constructor(
    private router: Router,
    public srvAcc: AccesibilidadService, // 👈 3. Inyección del servicio de accesibilidad como público
  ) {}

  // 🆕 4. Método para abrir y cerrar el menú de accesibilidad
  toggleMenuAcceso(): void {
    this.mostrarMenu = !this.mostrarMenu;
  }

  irABuscador(): void {
    if (this.terminoBusqueda.trim() !== '') {
      this.router.navigate(['/buscador'], {
        queryParams: { buscar: this.terminoBusqueda },
      });
    }
  }

  filtrarPorModalidad(modalidad: string): void {
    this.router.navigate(['/buscador'], {
      queryParams: { modalidad: modalidad },
    });
  }
}
