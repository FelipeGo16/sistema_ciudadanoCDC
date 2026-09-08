import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';

// 🛠️ CORREGIDO: Importamos 'App' en lugar de 'AppComponent' desde el archivo './app/app'
import { App } from './app/app'; 

// 🛠️ CORREGIDO: Inicializamos el arranque del proyecto usando la clase 'App'
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));



