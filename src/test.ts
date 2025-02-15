import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// Configura o ambiente de testes do Angular
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Busca todos os arquivos de teste que terminam com .spec.ts
const context = require.context('./', true, /\.spec\.ts$/);
context.keys().forEach(context);
