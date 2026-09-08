import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InscripcionService, RegistroHistorial } from '../services/inscripcion.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial.html',
  styles: [`
    .border-start-primary { border-left-color: #0d6efd !important; }
    .border-start-warning { border-left-color: #ffc107 !important; }
    .border-start-success { border-left-color: #198754 !important; }
    .border-start-danger { border-left-color: #dc3545 !important; }
  `]
})
export class HistorialComponent {
  documentoConsulta: string = '';
  busquedaRealizada: boolean = false;
  listadoHistorial: RegistroHistorial[] = [];

  // Los 7 estados requeridos por la regla de negocio
  estadosProceso = ['Intención', 'Validación', 'Inscrito', 'No Inscrito', 'En curso', 'Finalizado', 'Desertado'];

  constructor(private inscripcionService: InscripcionService) {}

  consultarHistorial(): void {
    if (!this.documentoConsulta.trim()) {
      alert('Por favor digite un documento para realizar la consulta.');
      return;
    }

    this.inscripcionService.obtenerHistorialCiudadano(this.documentoConsulta.trim())
      .then((datos) => {
        this.listadoHistorial = datos;
        this.busquedaRealizada = true;
      })
      .catch((error) => {
        console.error('Error al recuperar el historial desde Firebase:', error);
        alert('Error al conectar con Cloud Firestore.');
      });
  }

  filtrarPorEstado(estado: string): RegistroHistorial[] {
    return this.listadoHistorial.filter(item => item.estadoProceso === estado);
  }
}

