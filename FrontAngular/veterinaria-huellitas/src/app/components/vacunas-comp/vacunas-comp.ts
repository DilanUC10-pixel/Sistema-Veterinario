import { DatePipe, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { CitaSeguimientoService } from '../../services/cita-seguimiento-service';
import { MascotasService } from '../../services/mascotas-service';
import { VacunasService } from '../../services/vacunas-service';

interface VacunaStock {
  id: number;
  nombre: string;
  descripcion: string;
  stock: number;
}

interface MascotaOption {
  id: number;
  nombre: string;
  estado: number | null;
}

interface VacunaAplicada {
  id: number;
  idMascota: number;
  idVacuna: number;
  fechaAplicacion: string | null;
}

interface VacunaStockForm {
  id: number | null;
  nombre: string;
  descripcion: string;
  stock: number | null;
}

interface AplicacionForm {
  idMascota: number | null;
  idVacuna: number | null;
  fechaProximaCita: string;
}

@Component({
  selector: 'app-vacunas-comp',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
  ],
  templateUrl: './vacunas-comp.html',
})
export class VacunasComp implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly citaSeguimientoService = inject(CitaSeguimientoService);
  private readonly vacunasService = inject(VacunasService);
  private readonly mascotasService = inject(MascotasService);

  vacunasStock: VacunaStock[] = [];
  mascotas: MascotaOption[] = [];
  private todasLasMascotas: MascotaOption[] = [];
  historial: VacunaAplicada[] = [];
  vacunaForm = this.formularioStockVacio();
  aplicacionForm: AplicacionForm = {
    idMascota: null,
    idVacuna: null,
    fechaProximaCita: '',
  };
  editandoStock = false;
  cargandoHistorial = false;
  columnasStock = ['nombre', 'descripcion', 'stock', 'acciones'];
  columnasHistorial = ['mascota', 'vacuna', 'fechaAplicacion'];

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.listarStock();
    this.listarMascotas();
  }

  listarStock(): void {
    this.vacunasService.listarStock().subscribe({
      next: (respuesta) => {
        const datos = this.extraerLista(respuesta);
        if (datos === null) {
          Swal.fire('Error', this.mensajeRespuesta(respuesta, 'No se pudo cargar el inventario.'), 'error');
          return;
        }
        this.vacunasStock = datos.map((dato) => this.normalizarStock(dato));
        this.cdr.detectChanges();
      },
      error: (error) => this.mostrarError(error, 'No se pudo cargar el inventario.'),
    });
  }

  listarMascotas(): void {
    this.mascotasService.listar().subscribe({
      next: (respuesta) => {
        const datos = this.extraerLista(respuesta);
        if (datos === null) {
          Swal.fire('Error', this.mensajeRespuesta(respuesta, 'No se pudieron cargar las mascotas.'), 'error');
          return;
        }
        this.todasLasMascotas = datos
          .map((dato) => ({
            id: this.numero(this.valor(dato, 'idMascota', 'IDMASCOTA', 'id_mascota', 'id')),
            nombre: String(this.valor(dato, 'nombre', 'NOMBRE') ?? ''),
            estado: this.numero(this.valor(dato, 'estado', 'ESTADO')),
          }))
          .filter((mascota): mascota is MascotaOption => mascota.id !== null);
        this.mascotas = this.todasLasMascotas.filter((mascota) => mascota.estado !== 0);
        this.cdr.detectChanges();
        this.listarHistorial();
      },
      error: (error) => this.mostrarError(error, 'No se pudieron cargar las mascotas.'),
    });
  }

  guardarStock(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const stock = this.vacunaForm.stock;
    if (stock === null || !Number.isInteger(stock) || stock < 0) {
      Swal.fire('Error', 'Ingresa una cantidad de stock válida.', 'error');
      return;
    }

    const payload = {
      NOMBREVACUNA: this.vacunaForm.nombre.trim(),
      descripcion: this.vacunaForm.descripcion.trim(),
      stock,
      ...(this.editandoStock ? { estado: 1 } : {}),
    };
    const solicitud =
      this.editandoStock && this.vacunaForm.id !== null
        ? this.vacunasService.actualizarStock(this.vacunaForm.id, payload)
        : this.vacunasService.guardarStock(payload);

    solicitud.subscribe({
      next: (respuesta) => {
        if (this.falloRespuesta(respuesta)) {
          Swal.fire('Error', this.mensajeRespuesta(respuesta, 'No se pudo guardar la vacuna.'), 'error');
          return;
        }
        Swal.fire(
          this.editandoStock ? 'Actualizada' : 'Registrada',
          this.mensajeRespuesta(respuesta, 'El inventario se actualizó correctamente.'),
          'success',
        );
        this.limpiarStockForm(form);
        this.listarStock();
      },
      error: (error) => this.mostrarError(error, 'No se pudo guardar la vacuna.'),
    });
  }

  editarStock(vacuna: VacunaStock): void {
    this.vacunaForm = { ...vacuna };
    this.editandoStock = true;
  }

  eliminarStock(vacuna: VacunaStock): void {
    Swal.fire({
      title: '¿Retirar vacuna del inventario?',
      text: `Se retirará ${vacuna.nombre} del inventario activo.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, retirar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.vacunasService.eliminarStock(vacuna.id).subscribe({
        next: (respuesta) => {
          if (this.falloRespuesta(respuesta)) {
            Swal.fire('Error', this.mensajeRespuesta(respuesta, 'No se pudo retirar la vacuna.'), 'error');
            return;
          }
          Swal.fire('Retirada', 'La vacuna se retiró del inventario activo.', 'success');
          this.listarStock();
        },
        error: (error) => this.mostrarError(error, 'No se pudo retirar la vacuna.'),
      });
    });
  }

  seleccionarMascota(idMascota: number | null): void {
    this.aplicacionForm.idMascota = idMascota;
  }

  listarHistorial(): void {
    if (this.todasLasMascotas.length === 0) {
      this.historial = [];
      this.cargandoHistorial = false;
      this.cdr.detectChanges();
      return;
    }

    this.cargandoHistorial = true;
    forkJoin(
      this.todasLasMascotas.map((mascota) =>
        this.vacunasService.historialPorMascota(mascota.id),
      ),
    ).subscribe({
      next: (respuestas) => {
        const datos = respuestas.map((respuesta) => this.extraerLista(respuesta));
        if (datos.some((lista) => lista === null)) {
          this.cargandoHistorial = false;
          Swal.fire('Error', 'No se pudo cargar el historial de vacunación.', 'error');
          return;
        }
        this.historial = datos
          .flatMap((lista) => lista ?? [])
          .map((dato) => this.normalizarAplicada(dato));
        this.cargandoHistorial = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.cargandoHistorial = false;
        this.mostrarError(error, 'No se pudo cargar el historial de vacunación.');
      },
    });
  }

  aplicarVacuna(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const { idMascota, idVacuna } = this.aplicacionForm;
    const vacuna = this.vacunasStock.find((opcion) => opcion.id === idVacuna);
    if (idMascota === null || idVacuna === null) {
      Swal.fire('Error', 'Selecciona una mascota y una vacuna.', 'error');
      return;
    }
    if (!vacuna || vacuna.stock < 1) {
      Swal.fire('Error', 'No hay existencias disponibles de esta vacuna.', 'error');
      return;
    }
    const fechaProximaCita = this.aplicacionForm.fechaProximaCita;
    if (
      fechaProximaCita &&
      (!Number.isFinite(new Date(fechaProximaCita).getTime()) ||
        new Date(fechaProximaCita).getTime() <= Date.now())
    ) {
      Swal.fire('Error', 'La próxima cita debe tener una fecha y hora futuras válidas.', 'error');
      return;
    }

    this.vacunasService.aplicarVacuna({ idMascota, idVacuna, cantidad: 1 }).subscribe({
      next: (respuesta) => {
        if (this.falloRespuesta(respuesta)) {
          Swal.fire('Error', this.mensajeRespuesta(respuesta, 'No se pudo registrar la aplicación.'), 'error');
          return;
        }
        if (fechaProximaCita) {
          this.citaSeguimientoService
            .guardar({
              IDMASCOTA: idMascota,
              FECHACITA: fechaProximaCita,
              motivo: `Refuerzo de vacuna: ${vacuna.nombre}`,
              observaciones: `Cita programada al aplicar la vacuna ${vacuna.nombre}.`,
              estado: 1,
            })
            .subscribe({
              next: (respuestaCita) => {
                this.finalizarAplicacion(idMascota, form);
                if (this.falloRespuesta(respuestaCita)) {
                  Swal.fire(
                    'Vacuna aplicada',
                    `La vacuna se aplicó, pero no se pudo programar la próxima cita: ${this.mensajeRespuesta(respuestaCita, 'Error al guardar la cita.')}`,
                    'warning',
                  );
                  return;
                }
                Swal.fire(
                  'Vacuna aplicada',
                  `Se actualizó el stock y el historial. Próxima cita programada para ${new Date(fechaProximaCita).toLocaleString()}.`,
                  'success',
                );
              },
              error: (error) => {
                this.finalizarAplicacion(idMascota, form);
                Swal.fire(
                  'Vacuna aplicada',
                  `La vacuna se aplicó, pero no se pudo programar la próxima cita: ${this.detalleError(error, 'Error al guardar la cita.')}`,
                  'warning',
                );
              },
            });
          return;
        }

        this.finalizarAplicacion(idMascota, form);
        Swal.fire('Vacuna aplicada', 'Se actualizó el stock y el historial de la mascota.', 'success');
      },
      error: (error) => this.mostrarError(error, 'No se pudo registrar la aplicación.'),
    });
  }

  private finalizarAplicacion(idMascota: number, form: NgForm): void {
    this.aplicacionForm = { idMascota, idVacuna: null, fechaProximaCita: '' };
    form.resetForm(this.aplicacionForm);
    this.listarStock();
    this.listarHistorial();
  }

  limpiarStockForm(form?: NgForm): void {
    this.vacunaForm = this.formularioStockVacio();
    this.editandoStock = false;
    form?.resetForm(this.vacunaForm);
  }

  nombreVacunaAplicada(aplicacion: VacunaAplicada): string {
    return this.vacunasStock.find((vacuna) => vacuna.id === aplicacion.idVacuna)?.nombre
      ?? `Vacuna #${aplicacion.idVacuna}`;
  }

  nombreMascotaAplicada(aplicacion: VacunaAplicada): string {
    return this.todasLasMascotas.find((mascota) => mascota.id === aplicacion.idMascota)?.nombre
      ?? `Mascota #${aplicacion.idMascota}`;
  }

  private normalizarStock(dato: Record<string, unknown>): VacunaStock {
    return {
      id: this.numero(this.valor(dato, 'IDVACUNA', 'idvacuna', 'idVacuna', 'id')) ?? 0,
      nombre: String(this.valor(dato, 'NOMBREVACUNA', 'nombrevacuna', 'nombreVacuna') ?? ''),
      descripcion: String(this.valor(dato, 'descripcion', 'DESCRIPCION') ?? ''),
      stock: this.numero(this.valor(dato, 'stock', 'STOCK')) ?? 0,
    };
  }

  private normalizarAplicada(dato: Record<string, unknown>): VacunaAplicada {
    return {
      id: this.numero(this.valor(dato, 'IDAPLICACION', 'idaplicacion', 'idAplicacion', 'id')) ?? 0,
      idMascota: this.numero(this.valor(dato, 'IDMASCOTA', 'idmascota', 'idMascota')) ?? 0,
      idVacuna: this.numero(this.valor(dato, 'IDVACUNA', 'idvacuna', 'idVacuna')) ?? 0,
      fechaAplicacion: String(
        this.valor(dato, 'FECHAAPLICACION', 'fechaaplicacion', 'fechaAplicacion') ?? '',
      ) || null,
    };
  }

  private extraerLista(respuesta: unknown): Record<string, unknown>[] | null {
    if (!respuesta || typeof respuesta !== 'object') return null;
    if (Array.isArray(respuesta)) {
      return respuesta.filter(
        (dato): dato is Record<string, unknown> => !!dato && typeof dato === 'object',
      );
    }
    const objeto = respuesta as Record<string, unknown>;
    if (objeto['success'] === false) return null;
    const datos = objeto['data'];
    return Array.isArray(datos)
      ? datos.filter((dato): dato is Record<string, unknown> => !!dato && typeof dato === 'object')
      : null;
  }

  private valor(dato: Record<string, unknown>, ...claves: string[]): unknown {
    for (const clave of claves) {
      if (dato[clave] !== undefined && dato[clave] !== null) return dato[clave];
    }
    return null;
  }

  private numero(valor: unknown): number | null {
    if (valor === null || valor === undefined || valor === '') return null;
    const numero = Number(valor);
    return Number.isInteger(numero) ? numero : null;
  }

  private falloRespuesta(respuesta: unknown): boolean {
    return !!respuesta && typeof respuesta === 'object'
      && (respuesta as Record<string, unknown>)['success'] === false;
  }

  private mensajeRespuesta(respuesta: unknown, predeterminado: string): string {
    if (!respuesta || typeof respuesta !== 'object') return predeterminado;
    const objeto = respuesta as Record<string, unknown>;
    return String(objeto['mensaje'] ?? objeto['message'] ?? predeterminado);
  }

  private mostrarError(error: unknown, predeterminado: string): void {
    Swal.fire('Error', this.detalleError(error, predeterminado), 'error');
  }

  private detalleError(error: unknown, predeterminado: string): string {
    const detalle = error && typeof error === 'object' ? error as Record<string, unknown> : {};
    const cuerpo = detalle['error'] && typeof detalle['error'] === 'object'
      ? detalle['error'] as Record<string, unknown>
      : {};
    return String(cuerpo['mensaje'] ?? cuerpo['message'] ?? detalle['message'] ?? predeterminado);
  }

  private formularioStockVacio(): VacunaStockForm {
    return { id: null, nombre: '', descripcion: '', stock: 0 };
  }
}
