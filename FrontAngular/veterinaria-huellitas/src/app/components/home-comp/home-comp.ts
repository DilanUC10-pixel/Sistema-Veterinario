import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home-comp',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './home-comp.html',
})
export class HomeComp {
  mascotas = [
    {
      nombre: 'Milo',
      detalle: 'Perro · 2 años',
      descripcion: 'Cariñoso y juguetón',
      foto: 'mascotas/milo.jpg',
    },
    {
      nombre: 'Luna',
      detalle: 'Gata · 1 año',
      descripcion: 'Tranquila y curiosa',
      foto: 'mascotas/luna.jpg',
    },
    {
      nombre: 'Bruno',
      detalle: 'Perro · 3 años',
      descripcion: 'Leal y sociable',
      foto: 'mascotas/bruno.jpg',
    },
  ];
}
