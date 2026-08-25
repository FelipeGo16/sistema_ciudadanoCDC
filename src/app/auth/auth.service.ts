import { Injectable } from '@angular/core';

// Interfaz para el perfil del ciudadano/participante
export interface Participante {
  numeroDocumento: string;
  nombreCompleto: string;
  correo: string;
  telefono: string;
  localidadResidencia: string;
  esBeneficiario: boolean; // Condición de beneficiario (Apoyo Socioeconómico)
  tipoBeneficiario?: string; // Ejemplo: Jóvenes en Paz, Sisben A, etc.
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Cadena de datos de ejemplo (Simulación de la base de datos del sistema)
  private registrosParticipantes: Participante[] = [
    {
      numeroDocumento: '10102020',
      nombreCompleto: 'Carlos Alberto Mendoza',
      correo: 'carlos.mendoza@mail.com',
      telefono: '3114567890',
      localidadResidencia: 'Suba',
      esBeneficiario: true,
      tipoBeneficiario: 'Subsidio de Transporte - Jóvenes en Paz',
    },
    {
      numeroDocumento: '52345678',
      nombreCompleto: 'María Camila Restrepo',
      correo: 'camila.res@mail.com',
      telefono: '3209876543',
      localidadResidencia: 'Usme',
      esBeneficiario: true,
      tipoBeneficiario: 'Apoyo Alimentario - Sisben A1',
    },
    {
      numeroDocumento: '80123456',
      nombreCompleto: 'Juan Eduardo Gómez',
      correo: 'juan.gomez@mail.com',
      telefono: '3151234567',
      localidadResidencia: 'Teusaquillo',
      esBeneficiario: false, // Participante regular sin condiciones especiales
    },
  ];

  // Consulta el participante por su número de documento
  consultarDocumento(documento: string): Participante | undefined {
    return this.registrosParticipantes.find((p) => p.numeroDocumento === documento);
  }
}
