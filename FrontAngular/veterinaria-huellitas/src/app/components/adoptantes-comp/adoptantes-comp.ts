import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AdoptantesService } from '../../services/adoptantes-service';
// Ajusta el nombre/ruta si tu service de mascotas se llama distinto
import { MascotasService } from '../../services/mascotas-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adoptantes-comp',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: './adoptantes-comp.html',
})
export class AdoptantesComp implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private adoService = inject(AdoptantesService);
  private mascotasService = inject(MascotasService);
  private dialog = inject(MatDialog);

  private dialogRef?: MatDialogRef<unknown>;

  // El adoptante con id 1 es el admin y se muestra como "Refugio"
  readonly ID_REFUGIO = 1;

  columnas = ['adoptante', 'telefono', 'direccion', 'acciones'];

  dataSource = new MatTableDataSource<any>([]);

  // Texto del buscador de la tabla
  busqueda = '';

  adoptanteForm = this.formularioVacio();
  editando = false;

  // Diálogo de mascotas
  adoptanteSeleccionado: any = null;
  mascotasSeleccionadas: any[] = [];
  cargandoMascotas = false;

  @ViewChild('dialogForm') dialogForm!: TemplateRef<unknown>;
  @ViewChild('dialogMascotas') dialogMascotas!: TemplateRef<unknown>;

  @ViewChild(MatPaginator)
  set paginator(p: MatPaginator) {
    if (p) this.dataSource.paginator = p;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.listar();
    }
  }

  // ---------- Listado y búsqueda ----------

  listar(): void {
    this.adoService.listar().subscribe({
      next: (res: any) => {
        this.dataSource.data = this.extraerLista(res).map((adoptante: any) => ({
          ...adoptante,
          idAdoptante: this.obtenerIdAdoptante(adoptante),
        }));
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al listar adoptantes', err),
    });
  }

  buscar(): void {
    const texto = this.busqueda.trim();
    if (!texto) {
      this.listar();
      return;
    }

    const id = Number(texto);
    if (!Number.isInteger(id) || id <= 0) {
      Swal.fire('Error', 'Ingresa un ID de adoptante válido.', 'error');
      return;
    }

    this.adoService.buscarPorId(id).subscribe({
      next: (res: any) => {
        if (res?.success === false) {
          Swal.fire('Error', res.mensaje || 'No se pudo buscar el adoptante.', 'error');
          return;
        }
        const dato = res?.data !== undefined ? res.data : res;
        const adoptantes = dato == null ? [] : Array.isArray(dato) ? dato : [dato];
        this.dataSource.data = adoptantes.map((adoptante: any) => ({
          ...adoptante,
          idAdoptante: this.obtenerIdAdoptante(adoptante),
        }));
        this.dataSource.paginator?.firstPage();
        this.cdr.detectChanges();
      },
      error: (err: any) =>
        Swal.fire('Error', err.error?.mensaje || 'No se pudo buscar el adoptante.', 'error'),
    });
  }

  limpiarBusqueda(): void {
    if (!this.busqueda.trim()) this.listar();
  }

  // ---------- Refugio (adoptante id 1) ----------

  esRefugio(a: any): boolean {
    return a?.idAdoptante === this.ID_REFUGIO;
  }

  nombreMostrado(a: any): string {
    return this.esRefugio(a)
      ? 'Refugio'
      : `${a.nombre ?? ''} ${a.apellidoPaterno ?? ''} ${a.apellidoMaterno ?? ''}`.trim();
  }

  tituloMascotas(): string {
    return this.esRefugio(this.adoptanteSeleccionado)
      ? 'Mascotas del refugio'
      : `Mascotas de ${this.nombreMostrado(this.adoptanteSeleccionado)}`;
  }

  // ---------- Diálogos ----------

  abrirNuevo(): void {
    this.limpiarForm();
    this.abrirDialog();
  }

  private abrirDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogForm, {
      width: '560px',
      maxWidth: '95vw',
      disableClose: true,
    });

    // Al cerrarse (guardar o cancelar) se reinicia el formulario
    this.dialogRef.afterClosed().subscribe(() => this.limpiarForm());
  }

  cerrarDialog(): void {
    this.dialogRef?.close();
  }

  verMascotas(adoptante: any): void {
    if (adoptante.idAdoptante === null) {
      Swal.fire('Error', 'No se encontró un ID válido para este adoptante.', 'error');
      return;
    }

    this.adoptanteSeleccionado = adoptante;
    this.mascotasSeleccionadas = [];
    this.cargandoMascotas = true;

    this.dialog.open(this.dialogMascotas, {
      width: '640px',
      maxWidth: '95vw',
    });

    // Las mascotas del adoptante las entrega el back
    this.mascotasService.listarPorAdoptante(adoptante.idAdoptante).subscribe({
      next: (res: any) => {
        this.mascotasSeleccionadas = this.extraerLista(res);
        this.cargandoMascotas = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.cargandoMascotas = false;
        this.cdr.detectChanges();
        Swal.fire('Error', err.error?.mensaje || 'No se pudieron cargar las mascotas', 'error');
      },
    });
  }

  // ---------- CRUD ----------

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const { idAdoptante, contrasena, ...datos } = this.adoptanteForm;
    const payload = this.editando ? datos : { ...datos, contrasena };

    if (this.editando && idAdoptante === null) {
      Swal.fire('Error', 'No se encontró un ID válido para este adoptante.', 'error');
      return;
    }

    const guardado = this.editando
      ? this.adoService.actualizar(idAdoptante!, payload)
      : this.adoService.guardar(payload);

    guardado.subscribe({
      next: (res: any) => {
        if (res?.success === false) {
          Swal.fire('Error', res.mensaje || 'No se pudo guardar el adoptante', 'error');
          return;
        }

        Swal.fire(
          this.editando ? 'Actualizado' : 'Registrado',
          res?.mensaje || 'Operación exitosa',
          'success',
        );

        this.cerrarDialog();
        this.listar();
      },

      error: (err: any) => {
        Swal.fire('Error', err.error?.mensaje || 'No se pudo guardar el adoptante', 'error');
      },
    });
  }

  seleccionarEditar(adoptante: any): void {
    const idAdoptante = this.obtenerIdAdoptante(adoptante);
    if (idAdoptante === null) {
      Swal.fire('Error', 'No se encontró un ID válido para este adoptante.', 'error');
      return;
    }
    if (idAdoptante === this.ID_REFUGIO) return; // el refugio no se edita

    this.adoptanteForm = {
      idAdoptante,
      nombre: adoptante.nombre ?? '',
      apellidoPaterno: adoptante.apellidoPaterno ?? '',
      apellidoMaterno: adoptante.apellidoMaterno ?? '',
      telefono: adoptante.telefono ?? '',
      correo: adoptante.correo ?? '',
      direccion: adoptante.direccion ?? '',
      contrasena: '',
    };

    this.editando = true;

    this.abrirDialog();
  }

  eliminar(adoptante: any): void {
    const id = this.obtenerIdAdoptante(adoptante);
    if (id === null) {
      Swal.fire('Error', 'No se encontró un ID válido para este adoptante.', 'error');
      return;
    }
    if (id === this.ID_REFUGIO) return; // el refugio no se elimina

    Swal.fire({
      title: '¿Eliminar adoptante?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result: any) => {
      if (!result.isConfirmed) return;

      this.adoService.eliminar(id).subscribe({
        next: (res: any) => {
          if (res?.success === false) {
            Swal.fire('Error', res.mensaje || 'No se pudo eliminar el adoptante', 'error');
            return;
          }

          Swal.fire('Eliminado', res?.mensaje || 'Adoptante eliminado', 'success');

          this.listar();
        },

        error: (err: any) => {
          Swal.fire('Error', err.error?.mensaje || 'No se pudo eliminar el adoptante', 'error');
        },
      });
    });
  }

  // ---------- Utilidades ----------

  iniciales(a: any): string {
    return `${a?.nombre?.[0] ?? ''}${a?.apellidoPaterno?.[0] ?? ''}`.toUpperCase();
  }

  private extraerLista(res: any): any[] {
    if (Array.isArray(res)) return res;
    return res?.data ?? [];
  }

  private obtenerIdAdoptante(adoptante: any): number | null {
    const valor =
      adoptante.idAdoptante ??
      adoptante.IDADOPTANTE ??
      adoptante.id ??
      adoptante.adoptanteId ??
      adoptante.id_adoptante;
    if (valor === null || valor === undefined || valor === '') return null;

    const id = Number(valor);
    return Number.isInteger(id) ? id : null;
  }

  limpiarForm(): void {
    this.adoptanteForm = this.formularioVacio();
    this.editando = false;
    this.cdr.detectChanges();
  }

  private formularioVacio() {
    return {
      idAdoptante: null as number | null,
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      telefono: '',
      correo: '',
      direccion: '',
      contrasena: '',
    };
  }
}
