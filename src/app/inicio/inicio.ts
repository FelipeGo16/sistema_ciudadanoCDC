import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // 👈 Se agregó RouterModule
import { PROGRAMAS_DATA, Programa } from '../oferta/oferta'; // 👈 Importamos los datos centralizados

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // 👈 Importante incluir RouterModule aquí
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class InicioComponent implements OnInit {
  terminoBusqueda: string = '';

  // 🆕 Arreglo para almacenar exclusivamente los últimos 4 cursos del carrusel
  ultimosCursos: Programa[] = [];

  constructor(private router: Router) {}

  // Dentro del método ngOnInit() de tu inicio.ts cambia la asignación por esta:
  ngOnInit(): void {
    const ofertasValidas = PROGRAMAS_DATA.filter(
      (p) =>
        p.validada && (p.esPorDemanda || (p.cuposDisponibles !== null && p.cuposDisponibles > 0)),
    );
    this.ultimosCursos = ofertasValidas.slice(-4);
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

  controlCarrusel(direccion: 'prev' | 'next'): void {
    // 1. Buscamos el carrusel en la pantalla
    const carrusel = document.getElementById('carruselCursos');
    if (carrusel) {
      // 2. Localizamos las diapositivas (items)
      const items = Array.from(carrusel.querySelectorAll('.carousel-item'));
      // 3. Identificamos cuál es la diapositiva que se está mostrando actualmente
      const itemActivo = carrusel.querySelector('.carousel-item.active');

      if (itemActivo && items.length > 0) {
        let indiceActivo = items.indexOf(itemActivo);

        // 4. Quitamos la clase active a la diapositiva actual
        itemActivo.classList.remove('active');

        // 5. Calculamos matemáticamente cuál es el siguiente índice (manejando el bucle infinito)
        if (direccion === 'next') {
          indiceActivo = (indiceActivo + 1) % items.length;
        } else {
          indiceActivo = (indiceActivo - 1 + items.length) % items.length;
        }

        // 6. Le asignamos la clase active a la nueva diapositiva seleccionada
        items[indiceActivo].classList.add('active');

        // 7. Sincronizamos los indicadores de bolitas inferiores del carrusel
        const indicadores = Array.from(carrusel.querySelectorAll('.carousel-indicators button'));
        if (indicadores.length > 0) {
          carrusel.querySelector('.carousel-indicators button.active')?.classList.remove('active');
          indicadores[indiceActivo].classList.add('active');
        }
      }
    }
  }
}
