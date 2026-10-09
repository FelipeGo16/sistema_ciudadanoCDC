import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService, Participante } from '../auth/auth.service';
import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection, addDoc, Firestore } from 'firebase/firestore';
import { environment } from '../../environments/environment';

export interface NecesidadesInclusion {
  documentoUsuario: string;
  fechaRegistro: Date;
  // Inclusión Social
  interesArtes: boolean;
  interesRecreacion: boolean;
  interesDeporte: boolean;
  interesLavanderias: boolean;
  // Inclusión Productiva
  interesEmpleabilidad: boolean;
  interesEmprendimiento: boolean;
  interesFormacionTecnica: boolean;
  observacionesAdicionales: string;
}

@Component({
  selector: 'app-perfil-ciudadano',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class PerfilComponent implements OnInit {
  private db: Firestore;

  // Estados de control
  documentoConsulta: string = '';
  busquedaRealizada: boolean = false;
  datosParticipante: Participante | undefined;
  errorMensaje: string = '';
  guardadoExito: boolean = false;

  // Modelo reactivo para el registro de necesidades e intereses
  necesidades: NecesidadesInclusion = {
    documentoUsuario: '',
    fechaRegistro: new Date(),
    interesArtes: false,
    interesRecreacion: false,
    interesDeporte: false,
    interesLavanderias: false,
    interesEmpleabilidad: false,
    interesEmprendimiento: false,
    interesFormacionTecnica: false,
    observacionesAdicionales: '',
  };

  constructor(private authService: AuthService) {
    const app = initializeApp(environment.firebase);
    this.db = initializeFirestore(app, { experimentalForceLongPolling: true });
  }

  ngOnInit(): void {}

  // Consulta inicial para cargar los datos básicos del ciudadano
  cargarPerfil(): void {
    this.errorMensaje = '';
    this.busquedaRealizada = false;
    this.guardadoExito = false;

    if (!this.documentoConsulta.trim()) {
      this.errorMensaje = 'Por favor ingrese su número de documento.';
      return;
    }

    const resultado = this.authService.consultarDocumento(this.documentoConsulta.trim());

    if (resultado) {
      this.datosParticipante = resultado;
      // 🛠️ CORRECCIÓN: Asignamos directamente el documento digitado en la consulta
      this.necesidades.documentoUsuario = this.documentoConsulta.trim();
      this.busquedaRealizada = true;
    } else {
      this.errorMensaje = 'El documento ingresado no se encuentra registrado en el sistema.';
    }
  }

  // Almacena las necesidades e intereses del ciudadano de forma persistente en Firestore
  guardarNecesidadesIntereses(): void {
    this.guardadoExito = false;
    this.necesidades.fechaRegistro = new Date();

    const dataRef = collection(this.db, 'necesidades_inclusion_ciudadanos');

    addDoc(dataRef, this.necesidades)
      .then(() => {
        this.guardadoExito = true;
        alert(
          '¡Registro de Necesidades Exitoso!\n\nTus intereses en inclusión social y productiva han sido almacenados de forma segura en tu perfil.',
        );
        setTimeout(() => (this.guardadoExito = false), 4000);
      })
      .catch((error) => {
        console.error('Error al guardar necesidades en Cloud Firestore:', error);
        alert('Hubo un error de conexión con la base de datos al guardar tu caracterización.');
      });
  }
}
