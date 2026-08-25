import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // 👈 1. Importa el RouterModule

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule], // 👈 2. AGRÉGALO AQUÍ en los imports
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  // Tu lógica de la barra de navegación...
}
