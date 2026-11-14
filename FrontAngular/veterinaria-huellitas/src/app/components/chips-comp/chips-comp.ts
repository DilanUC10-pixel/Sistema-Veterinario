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
import Swal from 'sweetalert2';
import { forkJoin, map, of } from 'rxjs';
import { MascotasService } from '../../services/mascotas-service';
import { ChipsService } from '../../services/chips-service';

interface ChipStock {
  id: number;
  codigoChip: string;
  fabricante: string;
  estado: number;
}

interface MascotaOption {
  id: number;
  nombre: string;
}

interface ChipAplicado {
  id: number;
  idChipStock: number | null;
  codigoChip: string;
  fabricante: string;
  idMascota: number;
  fechaImplantacion: string | null;
  estado: number;
  fechaRegistro: string | null;
}

interface ChipStockForm {
  id: number | null;
  codigoChip: string;
  fabricante: string;
  estado: number;
}

interface AplicacionForm {
  idMascota: number | null;
  idChipStock: number | null;
  fechaImplantacion: string;
}

@Component({
  selector: 'app-chips-comp',
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
  templateUrl: './chips-comp.html',
})
export class ChipsComp implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly chipsService = inject(ChipsService);
  private readonly mascotasService = inject(MascotasService);

  chipsStock: ChipStock[] = [];
  mascotas: MascotaOption[] = [];
  historial: ChipAplicado[] = [];
  chipForm = this.formularioStockVacio();
  aplicacionForm: AplicacionForm = this.formularioAplicacionVacio();
  editandoStock = false;
  cargandoHistorial = false;
  columnasStock = ['codigoChip', 'fabricante', 'estado', 'acciones'];
  columnasHistorial = ['codigoChip', 'fabricante', 'fechaImplantacion', 'estado'];

  get hayChipDisponible(): boolean {
    return this.chipsStock.some((chip) => chip.estado === 2);
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.listarStock();
    this.listarMascotas();
  }

  listarStock(): void {
    this.chipsService.listarStock().subscribe({
      next: (respuesta) => {
        const datos = this.extraerLista(respuesta);
        if (datos === null) {
          Swal.fire('Error', this.mensajeRespuesta(respuesta, 'No se pudo cargar el inventario.'), 'error');
          return;
        }
        this.chipsStock = datos.map((dato) => this.normalizarStock(dato));
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
        this.mascotas = datos
          .map((dato) => ({
            id: this.numero(this.valor(dato, 'idMascota', 'IDMASCOTA', 'id_mascota', 'id')),
            nombre: String(this.valor(dato, 'nombre', 'NOMBRE') ?? ''),
          }))
          .filter((mascota): mascota is MascotaOption => mascota.id !== null);
        this.cdr.detectChanges();
      },
      error: (error) => this.mostrarError(error, 'No se pudieron cargar las mascotas.'),
    });
  }

  guardarStock(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const codigoChip = this.chipForm.codigoChip.trim();
    if (!codigoChip) {
      Swal.fire('Error', 'Ingresa el código del chip.', 'error');
      return;
    }

    const payload = {
      codigoChip,
      fabricante: this.chipForm.fabricante.trim() || null,
      estado: this.chipForm.estado,
    };
    const solicitud =
      this.editandoStock && this.chipForm.id !== null
        ? this.chipsService.actualizarStock(this.chipForm.id, payload)
        : this.chipsService.guardarStock(payload);

    solicitud.subscribe({
      next: (respuesta) => {
        if (this.falloRespuesta(respuesta)) {
          Swal.fire('Error', this.mensajeRespuesta(respuesta, 'No se pudo guardar el chip en inventario.'), 'error');
          return;
        }
        Swal.fire(
          this.editandoStock ? 'Actualizado' : 'Registrado',
          this.mensajeRespuesta(respuesta, 'El inventario se actualizó correctamente.'),
          'success',
        );
        this.limpiarStockForm(form);
        this.listarStock();
      },
      error: (error) => this.mostrarError(error, 'No se pudo guardar el chip en inventario.'),
    });
  }

  editarStock(chip: ChipStock): void {
    this.chipForm = { ...chip };
    this.editandoStock = true;
  }

  eliminarStock(chip: ChipStock): void {
    Swal.fire({
      title: '¿Retirar chip del inventario?',
      text: `Se retirará el chip ${chip.codigoChip} del inventario.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, retirar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.chipsService.eliminarStock(chip.id).subscribe({
        next: (respuesta) => {
          if (this.falloRespuesta(respuesta)) {
            Swal.fire('Error', this.mensajeRespuesta(respuesta, 'No se pudo retirar el chip del inventario.'), 'error');
            return;
          }
          Swal.fire('Retirado', 'El chip se retiró del inventario.', 'success');
          this.listarStock();
        },
        error: (error) => this.mostrarError(error, 'No se pudo retirar el chip del inventario.'),
      });
    });
  }

  seleccionarMascota(idMascota: number | null): void {
    this.aplicacionForm.idMascota = idMascota;
    this.historial = [];
    if (idMascota === null) return;

    this.cargandoHistorial = true;
    this.chipsService.historialPorMascota(idMascota).subscribe({
      next: (respuesta) => {
        const datos = this.extraerRegistros(respuesta);
        if (datos === null) {
          this.cargandoHistorial = false;
          Swal.fire('Error', 'La respuesta del servidor no contiene el historial de chips.', 'error');
          return;
        }
        const historial = datos.map((dato) => this.normalizarAplicado(dato));
        forkJoin(
          historial.map((aplicacion) =>
            aplicacion.idChipStock !== null && (!aplicacion.codigoChip || !aplicacion.fabricante)
              ? this.chipsService.buscarStock(aplicacion.idChipStock).pipe(
                  map((detalle) => this.extraerObjeto(detalle)),
                )
              : of(null),
          ),
        ).subscribe({
          next: (detalles) => {
            this.historial = historial.map((aplicacion, indice) => {
              const detalle = detalles[indice];
              if (!detalle) return aplicacion;
              const stock = this.normalizarStock(detalle);
              return {
                ...aplicacion,
                codigoChip: aplicacion.codigoChip || stock.codigoChip,
                fabricante: aplicacion.fabricante || stock.fabricante,
              };
            });
            this.cargandoHistorial = false;
            this.cdr.detectChanges();
          },
          error: (error) => {
            this.cargandoHistorial = false;
            this.mostrarError(error, 'No se pudieron cargar los datos de los chips aplicados.');
          },
        });
      },
      error: (error) => {
        this.cargandoHistorial = false;
        this.mostrarError(error, 'No se pudo cargar el historial de chips.');
      },
    });
  }

  aplicarChip(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const { idMascota, idChipStock, fechaImplantacion } = this.aplicacionForm;
    const chip = this.chipsStock.find((opcion) => opcion.id === idChipStock);
    if (idMascota === null || idChipStock === null || !fechaImplantacion) {
      Swal.fire('Error', 'Selecciona una mascota, un chip y la fecha de implantación.', 'error');
      return;
    }
    if (idChipStock <= 0 || !chip || chip.id <= 0 || chip.estado !== 2) {
      Swal.fire('Error', 'El chip seleccionado ya no está disponible en inventario.', 'error');
      return;
    }

    this.chipsService.aplicarChip({
      idChipStock,
      codigoChip: chip.codigoChip,
      fechaImplantacion,
      fabricante: chip.fabricante || null,
      idMascota,
      estado: 1,
    }).subscribe({
      next: (respuesta) => {
        if (this.falloRespuesta(respuesta)) {
          Swal.fire('Error', this.mensajeRespuesta(respuesta, 'No se pudo registrar la aplicación.'), 'error');
          return;
        }
        Swal.fire('Chip aplicado', 'Se actualizó el stock y el historial de la mascota.', 'success');
        this.aplicacionForm = { ...this.formularioAplicacionVacio(), idMascota };
        form.resetForm(this.aplicacionForm);
        this.listarStock();
        this.seleccionarMascota(idMascota);
      },
      error: (error) => this.mostrarError(error, 'No se pudo registrar la aplicación.'),
    });
  }

  limpiarStockForm(form?: NgForm): void {
    this.chipForm = this.formularioStockVacio();
    this.editandoStock = false;
    form?.resetForm(this.chipForm);
  }

  nombreMascotaSeleccionada(): string {
    return this.mascotas.find((mascota) => mascota.id === this.aplicacionForm.idMascota)?.nombre ?? '';
  }

  nombreEstadoStock(estado: number): string {
    switch (estado) {
      case 0:
        return 'Eliminado';
      case 1:
        return 'Aplicado';
      case 2:
        return 'En stock';
      default:
        return `Desconocido (${estado})`;
    }
  }

  private normalizarStock(dato: Record<string, unknown>): ChipStock {
    return {
      id: this.numero(this.valor(dato, 'idChipStock', 'IDCHIPSTOCK', 'idchipstock', 'id_chip_stock', 'id', 'ID')) ?? 0,
      codigoChip: String(this.valor(dato, 'codigoChip', 'CODIGOCHIP') ?? ''),
      fabricante: String(this.valor(dato, 'fabricante', 'FABRICANTE') ?? ''),
      estado: this.numero(this.valor(dato, 'estado', 'ESTADO')) ?? 2,
    };
  }

  private normalizarAplicado(dato: Record<string, unknown>): ChipAplicado {
    return {
      id: this.numero(this.valor(dato, 'idChipAplicado', 'IDCHIPAPLICADO', 'idChip', 'IDCHIP', 'idchip')) ?? 0,
      idChipStock: this.numero(this.valor(dato, 'idChipStock', 'IDCHIPSTOCK', 'id_chip_stock')),
      codigoChip: String(this.valor(dato, 'codigoChip', 'CODIGOCHIP') ?? ''),
      fabricante: String(this.valor(dato, 'fabricante', 'FABRICANTE') ?? ''),
      idMascota: this.numero(this.valor(dato, 'IDMASCOTA', 'idmascota', 'idMascota')) ?? 0,
      fechaImplantacion: String(
        this.valor(dato, 'fechaImplantacion', 'FECHAIMPLANTACION', 'fechaImplementacion', 'FECHAIMPLEMENTACION') ?? '',
      ) || null,
      estado: this.numero(this.valor(dato, 'estado', 'ESTADO')) ?? 1,
      fechaRegistro: String(this.valor(dato, 'fechaRegistro', 'FECHAREGISTRO') ?? '') || null,
    };
  }

  private extraerRegistros(respuesta: unknown): Record<string, unknown>[] | null {
    if (Array.isArray(respuesta)) {
      return respuesta.filter((dato): dato is Record<string, unknown> => !!dato && typeof dato === 'object');
    }
    if (!respuesta || typeof respuesta !== 'object') return null;
    const objeto = respuesta as Record<string, unknown>;
    if (objeto['success'] === false) return null;
    const datos = objeto['data'] ?? objeto['value'];
    if (Array.isArray(datos)) {
      return datos.filter((dato): dato is Record<string, unknown> => !!dato && typeof dato === 'object');
    }
    if (datos && typeof datos === 'object') return [datos as Record<string, unknown>];
    return [objeto];
  }

  private extraerObjeto(respuesta: unknown): Record<string, unknown> | null {
    if (!respuesta || typeof respuesta !== 'object' || Array.isArray(respuesta)) return null;
    const objeto = respuesta as Record<string, unknown>;
    if (objeto['success'] === false) return null;
    const dato = objeto['data'];
    return dato && typeof dato === 'object' && !Array.isArray(dato)
      ? dato as Record<string, unknown>
      : objeto;
  }

  private extraerLista(respuesta: unknown): Record<string, unknown>[] | null {
    if (!respuesta || typeof respuesta !== 'object') return null;
    const objeto = respuesta as Record<string, unknown>;
    if (objeto['success'] === false) return null;
    const datos = Array.isArray(objeto['data']) ? objeto['data'] : respuesta;
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
    const detalle = error && typeof error === 'object' ? error as Record<string, unknown> : {};
    const cuerpo = detalle['error'] && typeof detalle['error'] === 'object'
      ? detalle['error'] as Record<string, unknown>
      : {};
    Swal.fire('Error', String(cuerpo['mensaje'] ?? detalle['message'] ?? predeterminado), 'error');
  }

  private formularioStockVacio(): ChipStockForm {
    return { id: null, codigoChip: '', fabricante: '', estado: 2 };
  }

  private formularioAplicacionVacio(): AplicacionForm {
    return { idMascota: null, idChipStock: null, fechaImplantacion: new Date().toISOString().slice(0, 10) };
  }
}
