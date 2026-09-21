import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PROGRAMAS_DATA, Programa } from '../oferta/oferta';
import { InscripcionService } from '../services/inscripcion.service';
import { AuthService, Participante } from '../auth/auth.service'; // 👈 1. Importación del servicio de autenticación

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css',
})
export class DetalleComponent implements OnInit {
  curso: Programa | undefined;

  @Input() oferta!: any;

  // 🛠️ VARIABLES REACTIVAS: Requeridas de forma estricta por el nuevo formulario de detalle.html
  documentoDigitado: string = '';
  tipoDocDigitado: string = 'CC';
  usuarioAutenticado: boolean = false;
  datosParticipante: Participante | undefined;

  // Campos editables para la actualización de perfil y ubicación del ciudadano
  correoEditado: string = '';
  telefonoEditado: string = '';
  localidadEditada: string = '';
  localidadesDisponibles: string[] = [
    'Suba',
    'Usme',
    'Teusaquillo',
    'Bosa',
    'Kennedy',
    'Engativá',
    'Usaquén',
    'Santa Fe',
  ];

  // Estados de control de la interfaz y notificaciones
  pdfCargado: boolean = false;
  archivoPdf: File | null = null;
  errorMensaje: string = '';
  pdfErrorMensaje: string = '';
  perfilActualizadoExito: boolean = false;

  @ViewChild('modalElement') modalElement!: ElementRef;

  // 🛠️ CONSTRUCTOR CORREGIDO: Inyectamos el AuthService de manera correcta
  constructor(
    private route: ActivatedRoute,
    private inscripcionService: InscripcionService,
    private authService: AuthService, // 👈 2. Inyección del motor de autenticación ciudadana
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = parseInt(idParam, 10);
      this.curso = PROGRAMAS_DATA.find((p: any) => p.id === id);
    }
  }

  // 🛠️ CONTROLADOR DE IDENTIDAD: Consulta y precarga los datos del participante
  buscarUsuario(): void {
    this.errorMensaje = '';
    this.perfilActualizadoExito = false;

    if (!this.documentoDigitado.trim()) {
      this.errorMensaje = 'Por favor ingrese un número de documento válido.';
      return;
    }

    const resultado = this.authService.consultarDocumento(this.documentoDigitado.trim());

    if (resultado) {
      this.datosParticipante = resultado;
      this.usuarioAutenticado = true;

      // Sincronizamos los inputs con los valores del participante precargados
      this.correoEditado = resultado.correo;
      this.telefonoEditado = resultado.telefono;
      this.localidadEditada = resultado.localidadResidencia;
    } else {
      this.errorMensaje = 'El número de documento no se encuentra registrado en el sistema.';
      this.usuarioAutenticado = false;
      this.datosParticipante = undefined;
    }
  }

  // 🛠️ MÉTODO DE ACTUALIZACIÓN: Guarda localmente los datos de ubicación y contacto del perfil
  actualizarPerfil(): void {
    if (this.datosParticipante) {
      if (!this.correoEditado.trim() || !this.telefonoEditado.trim() || !this.localidadEditada) {
        alert('Por favor complete todos los campos de contacto y ubicación.');
        return;
      }

      this.datosParticipante.correo = this.correoEditado.trim();
      this.datosParticipante.telefono = this.telefonoEditado.trim();
      this.datosParticipante.localidadResidencia = this.localidadEditada;

      this.perfilActualizadoExito = true;
      setTimeout(() => (this.perfilActualizadoExito = false), 4000);
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
        this.pdfErrorMensaje =
          'El archivo seleccionado no es válido. Debe cargar un archivo con extensión .PDF';
        input.value = '';
        return;
      }

      this.archivoPdf = archivo;
      this.pdfCargado = true;
    }
  }

  abrirCajaFlotante(): void {
    if (this.modalElement && this.curso) {
      const modalHtml = this.modalElement.nativeElement;
      modalHtml.classList.add('show');
      modalHtml.style.display = 'block';
      modalHtml.setAttribute('aria-hidden', 'false');

      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      backdrop.id = 'backdrop-detalle-' + this.curso.id;
      document.body.appendChild(backdrop);
      document.body.classList.add('modal-open');
    }
  }

  cerrarCajaFlotante(): void {
    if (this.modalElement && this.curso) {
      const modalHtml = this.modalElement.nativeElement;
      modalHtml.classList.remove('show');
      modalHtml.style.display = 'none';
      modalHtml.setAttribute('aria-hidden', 'true');

      const backdrop = document.getElementById('backdrop-detalle-' + this.curso.id);
      if (backdrop) backdrop.remove();
      document.body.classList.remove('modal-open');
    }
  }

  // 🛠️ PERSISTENCIA UNIFICADA: Procesa la intención y la guarda de forma relacional en Firebase
  procesarSolicitudIntencion(documento: string): void {
    if (!this.curso) return;

    // Evaluamos el documento que venga directo del botón, o el de respaldo digitado
    const docFinal = documento ? documento.trim() : this.documentoDigitado.trim();

    if (!docFinal) {
      alert('Por favor ingrese su número de documento para registrar la intención.');
      return;
    }

    this.cerrarCajaFlotante();

    this.inscripcionService
      .registrarInscripcion(this.curso, docFinal)
      .then(() => {
        alert(
          `Se ha registrado con éxito tu intención de solicitud para el curso:\n"${this.curso?.nombre}".\n\nTu requerimiento ha sido almacenado en el sistema Betowa por medio de Cloud Firestore.`,
        );
        // Limpiamos los campos para futuras consultas
        this.documentoDigitado = '';
        this.usuarioAutenticado = false;
        this.datosParticipante = undefined;
      })
      .catch((error) => {
        console.error('Error al guardar la intención en Firebase:', error);
        alert('Hubo un error al procesar el registro de intención.');
      });
  }
}
