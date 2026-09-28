import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InscripcionService } from '../services/inscripcion.service';
import { AuthService, Participante } from '../auth/auth.service'; // 👈 1. IMPORTACIÓN CORREGIDA

// ==========================================================================
// 🛠️ 1. INTERFAZ GLOBAL SINCRONIZADA CON REQUERIMIENTOS INSTITUCIONALES
// ==========================================================================
export interface Programa {
  id: number;
  nombre: string;
  modalidad: 'Virtual' | 'Presencial' | 'Híbrida';
  nivel: string;
  area: string;
  duracion: string;
  centro: string;
  localidad: string;
  unidadOperativaCDC: string;
  direccionCDC: string;
  tipoOferente: 'Entidad' | 'Empresa' | 'Voluntariado';
  entidadOferente: string;
  mesRealizacion: string;
  fechaLimiteInscripcion: string;
  esPorDemanda: boolean;
  cuposDisponibles: number | null;
  validada: boolean;
  imagen: string;
  descripcionCompleta: string;
  componenteInclusion: string;
  componenteParticipativo: string;
  requisitos: string[];
}

// ==========================================================================
// 📦 2. BASE DE DATOS CENTRALIZADA COMPARTIDA (ESTADOS DE VALIDACIÓN Y CUPOS)
// ==========================================================================
export const PROGRAMAS_DATA: Programa[] = [
  {
    id: 1,
    nombre: 'ACCIONES BASICAS PARA LA ATENCION DE UNA PERSONA',
    modalidad: 'Virtual',
    nivel: 'Complementaria virtual',
    area: 'Salud',
    duracion: '40 horas',
    centro: 'Centro Comercio',
    localidad: 'Teusaquillo',
    unidadOperativaCDC: 'CDC Teusaquillo',
    direccionCDC: 'Unidad Virtual Central - Cra 45 #26-10',
    tipoOferente: 'Voluntariado',
    entidadOferente: 'Cruz Roja Sectorial Voluntariado',
    mesRealizacion: 'Septiembre 2026',
    fechaLimiteInscripcion: '2026-08-30',
    esPorDemanda: true,
    cuposDisponibles: null,
    validada: true,
    imagen: 'https://unsplash.com',
    descripcionCompleta:
      'Este programa brinda las competencias fundamentales en primeros auxilios y protocolos de atención prioritaria ante emergencias médicas cotidianas.',
    componenteInclusion:
      'Inclusión Social: Dirigido prioritariamente a líderes comunitarios y cuidadores de zonas vulnerables para descentralizar la atención médica inmediata.',
    componenteParticipativo:
      'Componente Comunitario: Al finalizar, el aprendiz participará en una jornada de simulación y transferencia de saberes con las juntas de acción local.',
    requisitos: ['Ser mayor de 16 años', 'Manejo básico de herramientas informáticas'],
  },
  {
    id: 2,
    nombre: 'ADECUACION DE ESTANQUES PISCICOLAS',
    modalidad: 'Presencial',
    nivel: 'Curso especial',
    area: 'Producción',
    duracion: '60 horas',
    centro: 'Centro Agropecuario',
    localidad: 'Usme',
    unidadOperativaCDC: 'CDC Julio César Sánchez',
    direccionCDC: 'Vía Pasquilla - Km 5 Granja Experimental Usme',
    tipoOferente: 'Empresa',
    entidadOferente: 'Asociación Piscícola Local & Distrital',
    mesRealizacion: 'Septiembre 2026',
    fechaLimiteInscripcion: '2026-08-25',
    esPorDemanda: false,
    cuposDisponibles: 15,
    validada: true,
    imagen: 'https://unsplash.com',
    descripcionCompleta:
      'Aprende el diseño técnico, excavación, nivelación y adecuación estructural de estanques acuícolas conforme a normativas de producción limpia.',
    componenteInclusion:
      'Inclusión Productiva: Acceso directo a redes de comercialización campesina y cadenas de suministro locales para la autogestión económica.',
    componenteParticipativo:
      'Componente Comunitario: Construcción colaborativa de una unidad productiva escolar piloto dentro del sector rural asociativo.',
    requisitos: ['Conocimientos básicos de campo'],
  },
  {
    id: 3,
    nombre: 'SALUD MENTAL',
    modalidad: 'Virtual',
    nivel: 'Complementaria virtual',
    area: 'Salud',
    duracion: '48 horas',
    centro: 'Centro Comercio',
    localidad: 'Santa Fe',
    unidadOperativaCDC: 'CDC Lourdes',
    direccionCDC: 'Plataforma Educativa Virtual - Aula 3 Santa Fe',
    tipoOferente: 'Entidad',
    entidadOferente: 'Secretaría de Salud Distrital',
    mesRealizacion: 'Octubre 2026',
    fechaLimiteInscripcion: '2026-09-10',
    esPorDemanda: true,
    cuposDisponibles: null,
    validada: false,
    imagen: 'https://unsplash.com',
    descripcionCompleta:
      'Herramientas conceptuales y prácticas para la promoción del bienestar emocional, identificación de signos de alerta y primeros auxilios psicológicos.',
    componenteInclusion:
      'Inclusión Social: Enfoque integral en resiliencia comunitaria pospandemia y mitigación de estigmas en entornos urbanos vulnerables.',
    componenteParticipativo:
      'Componente Comunitario: Conformación de redes vecinales activas para el apoyo solidario y canalización de rutas de atención en salud mental.',
    requisitos: ['Mayor de 18 años'],
  },
  {
    id: 4,
    nombre: 'ANALISIS DE DATOS',
    modalidad: 'Híbrida',
    nivel: 'Tecnólogo',
    area: 'Tecnología',
    duracion: '120 horas',
    centro: 'Centro TIC',
    localidad: 'Suba',
    unidadOperativaCDC: 'CDC La Gaitana',
    direccionCDC: 'Laboratorio TIC de Suba - Transversal 126 #132-40',
    tipoOferente: 'Entidad',
    entidadOferente: 'Ministerio de las TIC & Alta Consejería Distrital',
    mesRealizacion: 'Octubre 2026',
    fechaLimiteInscripcion: '2026-09-15',
    esPorDemanda: false,
    cuposDisponibles: 0,
    validada: true,
    imagen: 'https://unsplash.com',
    descripcionCompleta:
      'Formación técnica avanzada centrada en Big Data, minería de datos estructurados, lenguajes Python, SQL y modelamiento ejecutivo en PowerBI.',
    componenteInclusion:
      'Inclusión Productiva: Convenio directo con clústeres empresariales de software para el desarrollo de pasantías remuneradas y vinculación laboral directa.',
    componenteParticipativo:
      'Componente Participativo: Desarrollo grupal de proyectos de analítica pública enfocados en resolver problemas de movilidad o servicios en su respectiva localidad.',
    requisitos: ['Bachiller académico graduado'],
  },
];

// ==========================================================================
// 🎨 3. LOGICA Y CONTROLADOR DEL COMPONENTE DE TARJETA (STANDALONE REFORZADO)
// ==========================================================================
@Component({
  selector: 'app-oferta',
  standalone: true, // 👈 2. GARANTIZA QUE ESTO NO SE BORRE
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './oferta.html',
  styleUrl: './oferta.css',
})
export class Oferta {
  @Input() oferta!: Programa;

  documentoDigitado: string = '';
  tipoDocDigitado: string = 'CC';
  usuarioAutenticado: boolean = false;
  datosParticipante: Participante | undefined;

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

  errorMensaje: string = '';
  perfilActualizadoExito: boolean = false;

  @ViewChild('modalElement') modalElement!: ElementRef;

  constructor(
    private srcInscripcion: InscripcionService,
    private authService: AuthService,
  ) {}

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

      this.correoEditado = resultado.correo;
      this.telefonoEditado = resultado.telefono;
      this.localidadEditada = resultado.localidadResidencia;
    } else {
      this.errorMensaje = 'El número de documento no se encuentra registrado en el sistema.';
      this.usuarioAutenticado = false;
      this.datosParticipante = undefined;
    }
  }

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

  abrirCajaFlotante(): void {
    if (this.modalElement) {
      const modalHtml = this.modalElement.nativeElement;
      modalHtml.classList.add('show');
      modalHtml.style.display = 'block';
      modalHtml.setAttribute('aria-hidden', 'false');

      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      backdrop.id = 'backdrop-' + this.oferta.id;
      document.body.appendChild(backdrop);
      document.body.classList.add('modal-open');
    }
  }

  // 🛠️ 3. REINCORPORADO: Solución al error de método inexistente
  cerrarCajaFlotante(): void {
    if (this.modalElement) {
      const modalHtml = this.modalElement.nativeElement;
      modalHtml.classList.remove('show');
      modalHtml.style.display = 'none';
      modalHtml.setAttribute('aria-hidden', 'true');

      const backdrop = document.getElementById('backdrop-' + this.oferta.id);
      if (backdrop) backdrop.remove();

      // 🛠️ 1. Cierre del método cerrarCajaFlotante()
      document.body.classList.remove('modal-open');
    }
  }

  // ==========================================================================
  // 🛠️ 2. MÉTODO COMPLETO: PROCESAR SOLICITUD INTENCIÓN (PERSISTENCIA FIREBASE)
  // ==========================================================================
  procesarSolicitudIntencion(documento: string): void {
    // Evalúa si el documento viene directo desde el botón, o del respaldo digitado
    const docFinal = documento ? documento.trim() : this.documentoDigitado.trim();

    // Validación de protección de campo vacío
    if (!docFinal) {
      alert('Por favor ingrese su número de documento para registrar la intención.');
      return;
    }

    // Escondemos la caja de texto emergente de forma controlada
    this.cerrarCajaFlotante();

    // Guardamos la intención académica asociando de forma relacional la cédula en Firebase
    this.srcInscripcion
      .registrarInscripcion(this.oferta, docFinal)
      .then(() => {
        alert(
          `¡Registro de Intención Exitoso!\n\nEl curso "${this.oferta.nombre}" se ha asignado al documento de identidad ${docFinal} en el sistema Betowa por medio de Cloud Firestore.`,
        );
        // Limpiamos las variables locales del modal para futuras consultas limpias
        this.documentoDigitado = '';
        this.usuarioAutenticado = false;
        this.datosParticipante = undefined;
      })
      .catch((error) => {
        console.error('Error al guardar la intención en Firebase:', error);
        alert(
          'Hubo un error de conexión con Cloud Firestore al procesar el registro de intención.',
        );
      });
  }
} // 🛠️ 3. LLAVE FINAL que cierra la clase 'export class Oferta' de forma absoluta
