import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-dashboard-comp',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatTableModule, MatChipsModule],
  templateUrl: './dashboard-comp.html',
})
export class DashboardComp {
  // Datos de ejemplo (solo diseño)
  resumen = [
    {
      titulo: 'Mascotas disponibles',
      valor: 24,
      icono: 'pets',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      titulo: 'Adoptantes registrados',
      valor: 58,
      icono: 'groups',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      titulo: 'Adopciones del mes',
      valor: 9,
      icono: 'favorite',
      color: 'bg-rose-100 text-rose-600',
    },
    {
      titulo: 'Vacunas pendientes',
      valor: 6,
      icono: 'vaccines',
      color: 'bg-emerald-100 text-emerald-600',
    },
  ];

  columnas = ['mascota', 'adoptante', 'fecha', 'estado'];
  ultimasAdopciones = [
    { mascota: 'Firulais', adoptante: 'María López', fecha: '08/11/2026', estado: 'Completada' },
    { mascota: 'Luna', adoptante: 'Carlos Pérez', fecha: '06/11/2026', estado: 'En proceso' },
    { mascota: 'Michi', adoptante: 'Ana Torres', fecha: '03/11/2026', estado: 'Completada' },
    { mascota: 'Rocky', adoptante: 'Jorge Ramírez', fecha: '01/11/2026', estado: 'En proceso' },
  ];

  proximasVacunas = [
    { mascota: 'Toby', vacuna: 'Antirrábica', fecha: '15/11/2026' },
    { mascota: 'Nala', vacuna: 'Triple felina', fecha: '18/11/2026' },
    { mascota: 'Bruno', vacuna: 'Parvovirus', fecha: '20/11/2026' },
  ];
}
