import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PROGRAMAS_DATA, Programa } from '../oferta/oferta'; // 👈 1. Traemos los datos unificados desde oferta

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css',
})
export class DetalleComponent implements OnInit {
  curso: Programa | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // 2. Captura el ID de la URL parametrizada de Angular
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = parseInt(idParam, 10);

      // 3. Buscamos el curso directamente en el arreglo centralizado PROGRAMAS_DATA
      this.curso = PROGRAMAS_DATA.find((p) => p.id === id);
    }
  }
}
