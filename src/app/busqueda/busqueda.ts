import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Oferta, Programa, PROGRAMAS_DATA } from '../oferta/oferta';

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [CommonModule, FormsModule, Oferta],
  templateUrl: './busqueda.html',
  styleUrl: './busqueda.css',
})
export class BusquedaComponent implements OnInit {
  programas: Programa[] = PROGRAMAS_DATA.filter(
    (p) =>
      p.validada && (p.esPorDemanda || (p.cuposDisponibles !== null && p.cuposDisponibles > 0)),
  );
  programasMostrados: Programa[] = [];
  textoBuscar: string = '';
  paginaActual: number = 1;
  registrosPorPagina: number = 5;
  totalResultados: number = 0;

  // 1. Arreglos para poblar visualmente los grupos de filtros
  filtroModalidad: string[] = [];
  filtroLocalidad: string[] = [];
  filtroCDC: string[] = [];
  filtroTematica: string[] = [];
  filtroOferente: string[] = [];
  filtroMes: string[] = [];

  // 2. Estructura que almacena los filtros que se marcan activamente (Sincronizada con el HTML)
  filtrosSeleccionados: { [key: string]: string[] } = {
    modalidad: [],
    localidad: [],
    unidadOperativaCDC: [],
    area: [],
    tipoOferente: [],
    mesRealizacion: [],
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.crearFiltros();

    this.route.queryParams.subscribe((params) => {
      const buscar = params['buscar'];
      const modalidad = params['modalidad'];

      this.textoBuscar = buscar ? buscar : '';

      // Reseteamos el almacenamiento activo
      Object.keys(this.filtrosSeleccionados).forEach((k) => (this.filtrosSeleccionados[k] = []));

      if (modalidad) {
        this.filtrosSeleccionados['modalidad'].push(modalidad);
      }

      this.paginaActual = 1;
      this.filtrarProgramas();
    });
  }

  // 3. Generación automática y sin duplicados de opciones basadas en los datos reales
  crearFiltros(): void {
    this.filtroModalidad = [...new Set(this.programas.map((p) => p.modalidad))];
    this.filtroLocalidad = [...new Set(this.programas.map((p) => p.localidad))];
    this.filtroCDC = [...new Set(this.programas.map((p) => p.unidadOperativaCDC))];
    this.filtroTematica = [...new Set(this.programas.map((p) => p.area))];
    this.filtroOferente = [...new Set(this.programas.map((p) => p.tipoOferente))];
    this.filtroMes = [...new Set(this.programas.map((p) => p.mesRealizacion))];
  }

  // 4. Motor matricial de filtrado acumulativo
  filtrarProgramas(): void {
    let filtrados = this.programas.filter((programa) =>
      programa.nombre.toLowerCase().includes(this.textoBuscar.toLowerCase()),
    );

    // Evalúa consecutivamente cada grupo de filtros activos
    Object.keys(this.filtrosSeleccionados).forEach((campo) => {
      const valoresSeleccionados = this.filtrosSeleccionados[campo];
      if (valoresSeleccionados.length > 0) {
        filtrados = filtrados.filter((programa) =>
          valoresSeleccionados.includes(String(programa[campo as keyof Programa])),
        );
      }
    });

    this.totalResultados = filtrados.length;

    // Segmentador por páginas
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    this.programasMostrados = filtrados.slice(inicio, fin);
  }

  onCheckboxChange(campo: string, valor: string, evento: Event): void {
    const checkbox = evento.target as HTMLInputElement;
    if (checkbox.checked) {
      this.filtrosSeleccionados[campo].push(valor);
    } else {
      this.filtrosSeleccionados[campo] = this.filtrosSeleccionados[campo].filter(
        (v) => v !== valor,
      );
    }
    this.paginaActual = 1; // Resetea el paginador al cambiar de filtros
    this.filtrarProgramas();
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
    this.filtrarProgramas();
  }

  get totalPaginas(): number[] {
    const paginas = Math.ceil(this.totalResultados / this.registrosPorPagina);
    return Array.from({ length: paginas }, (_, i) => i + 1);
  }

  onLocalidadSelectChange(evento: Event): void {
    const selectElement = evento.target as HTMLSelectElement;
    const valorSeleccionado = selectElement.value;

    if (valorSeleccionado === '') {
      // Si el usuario elige "Todas las localidades", limpiamos el filtro de este campo
      this.filtrosSeleccionados['localidad'] = [];
    } else {
      // Como es una lista desplegable, reemplazamos el arreglo con el único valor seleccionado
      this.filtrosSeleccionados['localidad'] = [valorSeleccionado];
    }

    this.paginaActual = 1; // Reseteamos el paginador a la primera página
    this.filtrarProgramas(); // Ejecutamos el motor de filtrado acumulativo
  }

  onCDCSelectChange(evento: Event): void {
    const selectElement = evento.target as HTMLSelectElement;
    const valorSeleccionado = selectElement.value;

    if (valorSeleccionado === '') {
      // Si el usuario elige "Todos los centros", limpiamos el filtro de este campo
      this.filtrosSeleccionados['unidadOperativaCDC'] = [];
    } else {
      // Reemplazamos el criterio con el único centro CDC seleccionado
      this.filtrosSeleccionados['unidadOperativaCDC'] = [valorSeleccionado];
    }

    this.paginaActual = 1; // Reseteamos el paginador a la primera página
    this.filtrarProgramas(); // Ejecutamos el motor de filtrado acumulativo
  }
}
