import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

// 1. Interfaz del modelo de datos actualizada
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
  cuposDisponibles: number | null; // null si es por demanda libre

  // 🆕 Nuevo campo técnico requerido para la regla de negocio
  validada: boolean;

  imagen: string;
  descripcionCompleta: string;
  componenteInclusion: string;
  componenteParticipativo: string;
  requisitos: string[];
}

// 2. Base de datos centralizada con estados de validación y cupos de ejemplo
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
      'Este programa brinda las competencias fundamentales en primeros auxilios.',
    componenteInclusion: 'Inclusión Social: Dirigido prioritariamente a líderes comunitarios.',
    componenteParticipativo:
      'Componente Comunitario: Al finalizar participará en un simulacro masivo.',
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
    descripcionCompleta: 'Aprende el diseño técnico y adecuación estructural de estanques.',
    componenteInclusion: 'Inclusión Productiva: Acceso directo a redes de comercialización.',
    componenteParticipativo: 'Componente Comunitario: Desarrollo de proyectos asociativos locales.',
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
    descripcionCompleta: 'Herramientas para la promoción del bienestar emocional.',
    componenteInclusion: 'Inclusión Social: Enfoque en resiliencia comunitaria.',
    componenteParticipativo: 'Componente Comunitario: Redes de apoyo vecinales.',
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
    entidadOferente: 'Ministerio de las TIC',
    mesRealizacion: 'Octubre 2026',
    fechaLimiteInscripcion: '2026-09-15',
    esPorDemanda: false,
    cuposDisponibles: 0, 
    validada: true,
    imagen: 'https://unsplash.com',
    descripcionCompleta: 'Formación técnica avanzada centrada en Big Data y Python.',
    componenteInclusion: 'Inclusión Productiva: Convenio con clústeres empresariales.',
    componenteParticipativo: 'Componente Participativo: Proyectos de analítica pública.',
    requisitos: ['Bachiller académico graduado'],
  },
];

@Component({
  selector: 'app-oferta',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './oferta.html',
  styleUrl: './oferta.css',
})
export class Oferta {
  @Input() oferta!: Programa;
}
