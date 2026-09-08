import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // 🛠️ CORREGIDO: Usamos el nombre oficial y estable dictado por el compilador
    provideZonelessChangeDetection(),
    provideRouter(routes)
  ]
};



