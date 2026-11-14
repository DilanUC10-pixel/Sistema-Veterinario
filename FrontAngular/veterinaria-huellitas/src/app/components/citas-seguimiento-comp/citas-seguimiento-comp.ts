import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CitaSeguimiento,
  CitaSeguimientoService,
} from '../../services/cita-seguimiento-service';
import { MascotasService } from '../../services/mascotas-service';

interface MascotaOption {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-citas-seguimiento-comp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas-seguimiento-comp.html',
  styleUrl: './citas-seguimiento-comp.css',
})
export class CitasSeguimientoComp implements OnInit {
  private readonly citasService = inject(CitaSeguimientoService);
  private readonly mascotasService = inject(MascotasService);

  citas: CitaSeguimiento[] = [];
  mascotas: MascotaOption[] = [];
  cita: CitaSeguimiento = this.citaVacia();
  idMascotaFiltro: number | null = null;
  idEnEdicion: number | null = null;
  cargando = false;
  error = '';
  mensaje = '';

  ngOnInit(): void {
    this.listarMascotas();
    this.listar();
  }

  private listarMascotas(): void {
    this.mascotasService.listar().subscribe({
      next: (respuesta) => {
        if (respuesta?.success === false || !Array.isArray(respuesta?.data)) {
          this.error = respuesta?.mensaje || 'No se pudieron cargar las mascotas.';
          return;
        }
        this.mascotas = respuesta.data
          .map((mascota: any) => {
            const id = Number(
              mascota.idMascota ?? mascota.IDMASCOTA ?? mascota.id_mascota ?? mascota.id,
            );
            const nombre = mascota.nombre ?? mascota.NOMBRE;
            return Number.isInteger(id) && id > 0 && nombre
              ? { id, nombre: String(nombre) }
              : null;
          })
          .filter((mascota: MascotaOption | null): mascota is MascotaOption => mascota !== null);
      },
      error: (error: Error) => this.mostrarError(error),
    });
  }

  listar(): void {
    this.cargando = true;
    this.error = '';
    this.citasService.listar().subscribe({
      next: (respuesta) => {
        this.citas = respuesta.data ?? [];
        this.cargando = false;
      },
      error: (error: Error) => this.mostrarError(error),
    });
  }

  filtrarPorMascota(): void {
    if (!this.idMascotaFiltro || this.idMascotaFiltro <= 0) {
      this.listar();
      return;
    }

    this.cargando = true;
    this.error = '';
    this.citasService.listarPorMascota(this.idMascotaFiltro).subscribe({
      next: (respuesta) => {
        this.citas = respuesta.data ?? [];
        this.cargando = false;
      },
      error: (error: Error) => this.mostrarError(error),
    });
  }

  guardar(): void {
    this.error = '';
    this.mensaje = '';
    const request = { ...this.cita, estado: this.cita.estado ?? 1 };
    const operacion =
      this.idEnEdicion === null
        ? this.citasService.guardar(request)
        : this.citasService.actualizar(this.idEnEdicion, request);

    operacion.subscribe({
      next: (respuesta) => {
        this.mensaje = respuesta.message;
        this.cancelarEdicion();
        this.filtrarPorMascota();
      },
      error: (error: Error) => this.mostrarError(error),
    });
  }

  editar(cita: CitaSeguimiento): void {
    const id = this.obtenerId(cita);
    if (id === null) {
      this.error = 'No se encontró el identificador de esta cita.';
      return;
    }
    this.idEnEdicion = id;
    this.cita = { ...cita };
    this.mensaje = '';
    this.error = '';
  }

  cancelar(cita: CitaSeguimiento): void {
    const id = this.obtenerId(cita);
    if (id === null) {
      this.error = 'No se encontró el identificador de esta cita.';
      return;
    }

    this.citasService.eliminar(id).subscribe({
      next: () => {
        this.mensaje = 'La cita fue cancelada correctamente.';
        this.filtrarPorMascota();
      },
      error: (error: Error) => this.mostrarError(error),
    });
  }

  cancelarEdicion(): void {
    this.idEnEdicion = null;
    this.cita = this.citaVacia();
  }

  obtenerId(cita: CitaSeguimiento): number | null {
    const entry = Object.entries(cita).find(([key]) => {
      const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      return (
        normalized === 'id' ||
        (normalized.startsWith('id') &&
          (normalized.includes('cita') || normalized.includes('seguimiento'))) ||
        (normalized.endsWith('id') &&
          (normalized.includes('cita') || normalized.includes('seguimiento')))
      );
    });
    if (!entry) return null;
    const id = Number(entry[1]);
    return Number.isInteger(id) && id > 0 ? id : null;
  }

  nombreMascota(id: number): string {
    return this.mascotas.find((mascota) => mascota.id === Number(id))?.nombre ?? `Mascota #${id}`;
  }

  nombreEstado(estado?: number): string {
    switch (estado) {
      case 0:
        return 'Cancelada';
      case 1:
        return 'Programada';
      case 2:
        return 'En proceso';
      case 3:
        return 'Completada';
      default:
        return 'Desconocido';
    }
  }

  private citaVacia(): CitaSeguimiento {
    return {
      IDMASCOTA: 0,
      FECHACITA: '',
      motivo: '',
      observaciones: '',
      estado: 1,
    };
  }

  private mostrarError(error: Error): void {
    this.error = error.message || 'No fue posible completar la operación.';
    this.cargando = false;
  }
}
