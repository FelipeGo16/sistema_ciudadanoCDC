import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // 👈 1. IMPORTA EL FORMSMODULE AQUÍ
import { PROGRAMAS_DATA, Programa } from '../oferta/oferta'; 
import { InscripcionService } from '../services/inscripcion.service';

@Component({
  selector: 'app-detalle',
  standalone: true,
  // 👈 2. AGREGA 'FormsModule' DENTRO DEL ARREGLO DE IMPORTS
  imports: [CommonModule, RouterModule, FormsModule], 
  templateUrl: './detalle.html', 
  styleUrl: './detalle.css',
})
export class DetalleComponent implements OnInit {

  // Usamos 'curso' para que coincida con las propiedades de tu plantilla detalle.html
  curso: Programa | undefined;

  @Input() oferta!: any;

  // Variables reactivas para capturar los datos de la caja de texto (Modal)
  documentoDigitado: string = '';
  tipoDocDigitado: string = 'CC';

  @ViewChild('modalElement') modalElement!: ElementRef;

  // 🛠️ CORREGIDO: Reincorporamos ActivatedRoute en el constructor
  constructor(
    private route: ActivatedRoute,
    private inscripcionService: InscripcionService,
  ) {}

  // 🛠️ CORREGIDO: Reincorporamos la lectura del ID de la URL parametrizada
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = parseInt(idParam, 10);
      this.curso = PROGRAMAS_DATA.find((p: any) => p.id === id);
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
      backdrop.id = 'backdrop-detalle-' + this.curso.id; // Sincronizado con curso.id
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

  // Enlaza el guardado con la base de datos de Firebase asociando 'this.curso'
    procesarSolicitudIntencion(documento: string): void {
    if (!this.curso) return;

    if (!documento || !documento.trim()) {
      alert('Por favor ingrese su número de documento para registrar la intención.');
      return;
    }

    this.cerrarCajaFlotante();

    const datosEstudiante = {
      nombre: 'Carlos Mendoza',
      correo: 'carlos.mendoza@misena.edu.co',
      documento: documento.trim(), // 👈 Asignamos el valor directo
    };

    this.inscripcionService
      .registrarInscripcion(this.curso, documento.trim())
      .then(() => {
        alert(`Se ha registrado con éxito tu intención de solicitud para el curso:\n"${this.curso?.nombre}".\n\nTu requerimiento ha sido almacenado en el sistema.`);
      })
      .catch((error) => {
        console.error('Error al guardar la intención en Firebase:', error);
        alert('Hubo un error al procesar el registro de intención.');
      });
  }

}
