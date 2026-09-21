import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule], // 👈 Requeridos de forma estricta para ngClass y routerLink
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  // Estado inicial de la barra de navegación en celulares (Cerrado por defecto)
  menuColapsado: boolean = true;

  // Alterna la apertura y cierre al presionar el icono de hamburguesa
  toggleNavbar(): void {
    this.menuColapsado = !this.menuColapsado;
  }

  // Cierra automáticamente el menú desplegable al hacer clic en un enlace (Mejora la experiencia en celulares)
  cerrarMenuMovi(): void {
    this.menuColapsado = true;
  }
}
