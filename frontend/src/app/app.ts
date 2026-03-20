// Componente principal de la aplicación.
// Este componente sirve como contenedor principal
// y muestra el componente de lista de pizzas.
// Autor: Camilo Martinez
// Fecha: 19/03/2026

import { Component, signal } from '@angular/core';
import { PizzaListComponent } from './components/pizza-list/pizza-list.component';

@Component({
  selector: 'app-root',
  imports: [PizzaListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Pizzería Pro');
}