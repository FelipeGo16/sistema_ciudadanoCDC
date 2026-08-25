import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router'; // 👈 1. Importa Router desde @angular/router
import { FormsModule } from '@angular/forms';
import { Nav } from './nav/nav';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  // 💡 Removemos "BusquedaComponent" de los imports de App, ya que ahora lo cargará el Router dinámicamente
  imports: [RouterOutlet, CommonModule, FormsModule, Nav, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('sistemac');
  terminoBusqueda: string = '';

  // 👈 2. Inyecta el Router en el constructor de la clase
  constructor(private router: Router) {}

  irABuscador(): void {
    if (this.terminoBusqueda.trim() !== '') {
      // 👈 3. Navegación nativa de Angular hacia /buscador con parámetros de consulta
      this.router.navigate(['/buscador'], {
        queryParams: { buscar: this.terminoBusqueda },
      });
    }
  }

  filtrarPorModalidad(modalidad: string): void {
    // 👈 4. Navegación por modalidad usando el Router nativo
    this.router.navigate(['/buscador'], {
      queryParams: { modalidad: modalidad },
    });
  }
}
