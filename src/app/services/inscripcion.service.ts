import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Firestore,
} from 'firebase/firestore';
import { environment } from '../../environments/environment';

export interface RegistroHistorial {
  id?: string;
  cursoId: number;
  cursoNombre: string;
  localidad: string;
  documentoUsuario: string; // 👈 Llave relacional con el ciudadano autenticado
  fechaCambioEstado: Date | any;
  estadoProceso:
    | 'Intención'
    | 'Validación'
    | 'Inscrito'
    | 'No Inscrito'
    | 'En curso'
    | 'Finalizado'
    | 'Desertado';
}

@Injectable({
  providedIn: 'root',
})
export class InscripcionService {
  private db: Firestore;

  constructor() {
    const app = initializeApp(environment.firebase);
    this.db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });
  }

  // 1. Almacena la intención asociando el documento del ciudadano
  registrarInscripcion(curso: any, documento: string): Promise<any> {
    const dataRef = collection(this.db, 'inscripciones_ciudadanos');

    const registro: RegistroHistorial = {
      cursoId: curso.id,
      cursoNombre: curso.nombre,
      localidad: curso.localidad,
      documentoUsuario: documento, // Cédula capturada en la caja de texto
      fechaCambioEstado: new Date(),
      estadoProceso: 'Intención', // Estado inicial obligatorio por requerimiento
    };

    return addDoc(dataRef, registro);
  }

  // 2. 🆕 Consulta y filtra en Firebase el historial académico de un ciudadano
  async obtenerHistorialCiudadano(documento: string): Promise<RegistroHistorial[]> {
    const dataRef = collection(this.db, 'inscripciones_ciudadanos');
    // Creamos una consulta indexada (WHERE documentoUsuario == documento)
    const q = query(dataRef, where('documentoUsuario', '==', documento));
    const querySnapshot = await getDocs(q);

    const historial: RegistroHistorial[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as RegistroHistorial;
      historial.push({ ...data, id: doc.id });
    });

    return historial;
  }
}
