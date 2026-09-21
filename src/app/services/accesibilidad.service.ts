import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AccesibilidadService {
  // Usamos Angular Signals para un manejo de estado ultra reactivo
  modoAccesibleActivo = signal<boolean>(false);
  altoContrasteActivo = signal<boolean>(false);
  tamanoFuente = signal<number>(100); // Representa el porcentaje (100%, 115%, 130%)

  toggleModoAccesible(): void {
    this.modoAccesibleActivo.update((v) => !v);
    if (!this.modoAccesibleActivo()) {
      this.resetearAccesibilidad();
    }
  }

  toggleAltoContraste(): void {
    this.altoContrasteActivo.update((v) => !v);
    const body = document.body;
    if (this.altoContrasteActivo()) {
      body.classList.add('alto-contraste');
    } else {
      body.classList.remove('alto-contraste');
    }
  }

  aumentarFuente(): void {
    if (this.tamanoFuente() < 130) {
      this.tamanoFuente.update((f) => f + 15);
      document.documentElement.style.fontSize = `${this.tamanoFuente()}%`;
    }
  }

  disminuirFuente(): void {
    if (this.tamanoFuente() > 100) {
      this.tamanoFuente.update((f) => f - 15);
      document.documentElement.style.fontSize = `${this.tamanoFuente()}%`;
    }
  }

  private resetearAccesibilidad(): void {
    this.altoContrasteActivo.set(false);
    this.tamanoFuente.set(100);
    document.body.classList.remove('alto-contraste');
    document.documentElement.style.fontSize = '100%';
  }
}
