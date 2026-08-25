import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, Participante } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  documentoIngresado: string = '';
  usuarioAutenticado: boolean = false;
  datosParticipante: Participante | undefined;
  
  // 🆕 Campos editables para actualización de perfil
  correoEditado: string = '';
  telefonoEditado: string = '';
  localidadEditada: string = '';

  // Lista de localidades para el combo desplegable de edición
  localidadesDisponibles: string[] = ['Suba', 'Usme', 'Teusaquillo', 'Bosa', 'Kennedy', 'Engativá', 'Usaquén', 'Santa Fe'];

  // Estados de control de archivos e interfaz
  pdfCargado: boolean = false;
  archivoPdf: File | null = null;
  errorMensaje: string = '';
  pdfErrorMensaje: string = '';
  perfilActualizadoExito: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  buscarUsuario(): void {
    this.errorMensaje = '';
    this.perfilActualizadoExito = false;
    
    if (!this.documentoIngresado.trim()) {
      this.errorMensaje = 'Por favor ingrese un número de documento válido.';
      return;
    }

    const resultado = this.authService.consultarDocumento(this.documentoIngresado.trim());

    if (resultado) {
      this.datosParticipante = resultado;
      this.usuarioAutenticado = true;
      
      // 🆕 Precargar los campos editables con los valores actuales del participante
      this.correoEditado = resultado.correo;
      this.telefonoEditado = resultado.telefono;
      this.localidadEditada = resultado.localidadResidencia;
    } else {
      this.errorMensaje = 'El número de documento no se encuentra registrado en el sistema.';
      this.usuarioAutenticado = false;
      this.datosParticipante = undefined;
    }
  }

  // 🆕 Función para guardar los cambios de ubicación y contacto en el perfil
  actualizarPerfil(): void {
    if (this.datosParticipante) {
      // Validaciones básicas de campos vacíos
      if (!this.correoEditado.trim() || !this.telefonoEditado.trim() || !this.localidadEditada) {
        alert('Por favor complete todos los campos de contacto y ubicación.');
        return;
      }

      // Actualizamos los datos en el objeto cargado en memoria
      this.datosParticipante.correo = this.correoEditado.trim();
      this.datosParticipante.telefono = this.telefonoEditado.trim();
      this.datosParticipante.localidadResidencia = this.localidadEditada;

      this.perfilActualizadoExito = true;
      
      // Opcional: Ocultar la alerta de éxito después de 4 segundos
      setTimeout(() => this.perfilActualizadoExito = false, 4000);
    }
  }

  onFileSelected(evento: Event): void {
    this.pdfErrorMensaje = '';
    this.pdfCargado = false;
    this.archivoPdf = null;

    const input = evento.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const archivo = input.files[0];

      if (archivo.type !== 'application/pdf' && !archivo.name.endsWith('.pdf')) {
        this.pdfErrorMensaje = 'El archivo seleccionado no es válido. Debe cargar un archivo con extensión .PDF';
        input.value = '';
        return;
      }

      this.archivoPdf = archivo;
      this.pdfCargado = true;
    }
  }

  finalizarIngreso(): void {
    // 💻 Eliminamos la condición obligatoria de "this.pdfCargado"
    if (this.usuarioAutenticado) {
      if (this.pdfCargado) {
        alert(`Ingreso exitoso. Bienvenido(a) ${this.datosParticipante?.nombreCompleto}. Perfil y documento PDF validados.`);
      } else {
        alert(`Ingreso exitoso. Bienvenido(a) ${this.datosParticipante?.nombreCompleto}. (Ingreso realizado sin adjuntar documento).`);
      }
      this.router.navigate(['/buscador']);
    }
  }


  resetForm(): void {
    this.documentoIngresado = '';
    this.usuarioAutenticado = false;
    this.datosParticipante = undefined;
    this.pdfCargado = false;
    this.archivoPdf = null;
    this.errorMensaje = '';
    this.pdfErrorMensaje = '';
    this.perfilActualizadoExito = false;
  }
}
