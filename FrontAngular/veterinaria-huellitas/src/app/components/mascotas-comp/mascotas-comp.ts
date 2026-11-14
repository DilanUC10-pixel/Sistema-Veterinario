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
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AdoptantesService } from '../../services/adoptantes-service';
import { MascotasService } from '../../services/mascotas-service';

interface Mascota {
  idMascota: number | null;
  nombre: string;
  especie: string;
  raza: string;
  edad: number | null;
  sexo: number | null;
  urlImagen: string;
  fechaIngreso: string | null;
  fechaAdopcion: string | null;
  idAdoptante: number | null;
  estado: number;
}

interface AdoptanteOption {
  id: number;
  nombre: string;
  correo: string;
}

@Component({
  selector: 'app-mascotas-comp',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTooltipModule,
    RouterLink,
  ],
  templateUrl: './mascotas-comp.html',
})
export class MascotasComp implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private mascotasService = inject(MascotasService);
  private adoptantesService = inject(AdoptantesService);
  private dialog = inject(MatDialog);

  private dialogRef?: MatDialogRef<unknown>;

  // El adoptante con id 1 es el refugio
  readonly ID_REFUGIO = 1;

  especies = ['Perro', 'Gato', 'Conejo', 'Ave', 'Otro'];
  sexos = [
    { valor: 0, nombre: 'Macho' },
    { valor: 1, nombre: 'Hembra' },
  ];
  estados = [
    { valor: 'disponible', nombre: 'Disponible' },
    { valor: 'adoptada', nombre: 'Adoptada' },
    { valor: 'eliminada', nombre: 'Eliminada' },
  ];
  opcionesFiltro = [
    { valor: '', nombre: 'Todas' },
    { valor: 'disponible', nombre: 'Disponibles' },
    { valor: 'adoptada', nombre: 'Adoptadas' },
  ];
  adoptantes: AdoptanteOption[] = [];
  columnas = ['mascota', 'edad', 'sexo', 'adoptante', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Mascota>([]);
  mascotaForm = this.formularioVacio();
  editando = false;
  filtroEstado = '';
  busqueda = '';

  @ViewChild('dialogForm') dialogForm!: TemplateRef<unknown>;

  @ViewChild(MatPaginator)
  set paginator(paginator: MatPaginator) {
    if (paginator) this.dataSource.paginator = paginator;
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = (mascota, estado) =>
      !estado || this.claveEstado(mascota) === estado;

    if (isPlatformBrowser(this.platformId)) {
      this.listar();
      this.listarAdoptantes();
    }
  }

  get sesionActiva(): boolean {
    return this.adoptantesService.isLoggedIn();
  }

  // ---------- Carga de datos ----------

  listarAdoptantes(): void {
    this.adoptantesService.listar().subscribe({
      next: (res) => {
        if (res?.success === false || !Array.isArray(res?.data)) {
          Swal.fire('Error', res?.mensaje || 'No se pudieron cargar los adoptantes.', 'error');
          return;
        }
        this.adoptantes = res.data
          .map((dato: any) => {
            const id = this.obtenerIdAdoptante(dato);
            if (id === null) return null;

            // El adoptante 1 se muestra siempre con el alias "Refugio"
            if (id === this.ID_REFUGIO) {
              return { id, nombre: 'Refugio', correo: '' };
            }

            return {
              id,
              nombre: [
                dato.nombre ?? dato.NOMBRE,
                dato.apellidoPaterno ?? dato.APELLIDOPATERNO,
                dato.apellidoMaterno ?? dato.APELLIDOMATERNO,
              ]
                .filter(Boolean)
                .join(' '),
              correo: dato.correo ?? dato.CORREO ?? '',
            };
          })
          .filter(
            (adoptante: AdoptanteOption | null): adoptante is AdoptanteOption => adoptante !== null,
          );

        this.cdr.detectChanges();
      },
      error: (err) => this.mostrarError(err, 'No se pudieron cargar los adoptantes.'),
    });
  }

  listar(): void {
    this.mascotasService.listar().subscribe({
      next: (res) => {
        if (res?.success === false || !Array.isArray(res?.data)) {
          Swal.fire(
            'Error',
            res?.mensaje || 'La respuesta del servidor no contiene mascotas.',
            'error',
          );
          return;
        }
        this.dataSource.data = res.data.map((dato: any) => this.normalizarMascota(dato));
        this.cdr.detectChanges();
      },
      error: (err) => this.mostrarError(err, 'No se pudieron cargar las mascotas.'),
    });
  }

  // ---------- Filtros ----------

  buscar(): void {
    const texto = this.busqueda.trim();
    if (!texto) {
      this.listar();
      return;
    }

    const id = Number(texto);
    if (!Number.isInteger(id) || id <= 0) {
      Swal.fire('Error', 'Ingresa un ID de mascota válido.', 'error');
      return;
    }

    this.mascotasService.buscarPorId(id).subscribe({
      next: (res) => {
        if (res?.success === false) {
          Swal.fire('Error', res.mensaje || 'No se pudo buscar la mascota.', 'error');
          return;
        }
        const dato = res?.data !== undefined ? res.data : res;
        const mascotas = dato == null ? [] : Array.isArray(dato) ? dato : [dato];
        this.dataSource.data = mascotas.map((mascota: any) => this.normalizarMascota(mascota));
        this.dataSource.paginator?.firstPage();
        this.cdr.detectChanges();
      },
      error: (err) => this.mostrarError(err, 'No se pudo buscar la mascota.'),
    });
  }

  filtrarEstado(estado: string): void {
    this.filtroEstado = estado;
    this.dataSource.filter = estado;
    this.dataSource.paginator?.firstPage();
    this.cdr.detectChanges();
  }

  limpiarBusqueda(): void {
    if (!this.busqueda.trim()) this.listar();
  }

  // ---------- Diálogo ----------

  abrirNuevo(): void {
    this.limpiarForm();
    this.abrirDialog();
  }

  private abrirDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogForm, {
      width: '600px',
      maxWidth: '95vw',
      disableClose: true,
    });

    // Al cerrarse (guardar o cancelar) se reinicia el formulario
    this.dialogRef.afterClosed().subscribe(() => this.limpiarForm());
  }

  cerrarDialog(): void {
    this.dialogRef?.close();
  }

  // ---------- CRUD ----------

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const adoptanteId = this.mascotaForm.idAdoptante;
    if (adoptanteId === null || !Number.isInteger(adoptanteId)) {
      Swal.fire('Error', 'Selecciona un adoptante válido para asignar la mascota.', 'error');
      return;
    }

    const payload = {
      nombre: this.mascotaForm.nombre.trim(),
      especie: this.mascotaForm.especie,
      raza: this.mascotaForm.raza.trim() || null,
      edad: this.mascotaForm.edad === null ? null : Number(this.mascotaForm.edad),
      sexo: Number(this.mascotaForm.sexo),
      urlImagen: this.mascotaForm.urlImagen.trim() || null,
      estado: Number(this.mascotaForm.estado),
      idAdoptante: adoptanteId,
      ...(this.editando
        ? {
            fechaIngreso: this.mascotaForm.fechaIngreso,
            fechaAdopcion: this.mascotaForm.fechaAdopcion,
          }
        : {}),
    };

    const solicitud =
      this.editando && this.mascotaForm.idMascota !== null
        ? this.mascotasService.actualizar(this.mascotaForm.idMascota, payload)
        : this.mascotasService.guardar(payload);

    solicitud.subscribe({
      next: (res) => {
        if (res?.success === false) {
          Swal.fire('Error', res.mensaje || 'No se pudo guardar la mascota.', 'error');
          return;
        }
        Swal.fire(
          this.editando ? 'Actualizada' : 'Registrada',
          res?.mensaje || 'Operación exitosa.',
          'success',
        );
        this.cerrarDialog();
        this.listar();
      },
      error: (err) => this.mostrarError(err, 'No se pudo guardar la mascota.'),
    });
  }

  seleccionarEditar(mascota: Mascota): void {
    if (mascota.idMascota === null) {
      Swal.fire('Error', 'La mascota no tiene un ID válido.', 'error');
      return;
    }
    this.mascotaForm = { ...mascota };
    this.editando = true;
    this.abrirDialog();
  }

  eliminar(mascota: Mascota): void {
    if (mascota.idMascota === null) {
      Swal.fire('Error', 'La mascota no tiene un ID válido.', 'error');
      return;
    }

    Swal.fire({
      title: '¿Eliminar mascota?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed || mascota.idMascota === null) return;
      this.mascotasService.eliminar(mascota.idMascota).subscribe({
        next: (res) => {
          if (res?.success === false) {
            Swal.fire('Error', res.mensaje || 'No se pudo eliminar la mascota.', 'error');
            return;
          }
          Swal.fire('Eliminada', res?.mensaje || 'Mascota eliminada.', 'success');
          this.listar();
        },
        error: (err) => this.mostrarError(err, 'No se pudo eliminar la mascota.'),
      });
    });
  }

  adoptar(mascota: Mascota): void {
    const idMascota = mascota.idMascota;
    const adoptantesDisponibles = this.adoptantes.filter(
      (adoptante) => adoptante.id !== this.ID_REFUGIO,
    );
    if (idMascota === null || adoptantesDisponibles.length === 0) {
      Swal.fire('Error', 'No hay adoptantes disponibles para asignar la mascota.', 'error');
      return;
    }

    Swal.fire({
      title: `¿Iniciar la adopción de ${mascota.nombre}?`,
      text: 'Selecciona el adoptante al que se asignará esta mascota.',
      icon: 'question',
      input: 'select',
      inputOptions: new Map(
        adoptantesDisponibles.map((adoptante) => [String(adoptante.id), adoptante.nombre]),
      ),
      inputPlaceholder: 'Selecciona un adoptante',
      inputValidator: (valor) => (valor ? undefined : 'Debes seleccionar un adoptante.'),
      showCancelButton: true,
      confirmButtonText: 'Sí, adoptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) return;
      const idAdoptante = Number(result.value);
      if (!adoptantesDisponibles.some((adoptante) => adoptante.id === idAdoptante)) {
        Swal.fire('Error', 'Selecciona un adoptante válido.', 'error');
        return;
      }

      this.mascotasService
        .actualizarEstadoAdopcion(idMascota, { ...mascota, idAdoptante, estado: 2 })
        .subscribe({
          next: (res) => {
            if (res?.success === false) {
              Swal.fire('Error', res.mensaje || 'No se pudo registrar la adopción.', 'error');
              return;
            }
            Swal.fire(
              '¡Adopción registrada!',
              res?.mensaje || 'La mascota quedó a tu nombre.',
              'success',
            );
            this.listar();
          },
          error: (err) => this.mostrarError(err, 'No se pudo registrar la adopción.'),
        });
    });
  }

  // ---------- Presentación ----------

  nombreSexo(sexo: number | null): string {
    return sexo === 0 ? 'Macho' : sexo === 1 ? 'Hembra' : 'Sin especificar';
  }

  nombreEstado(mascota: Mascota): string {
    return (
      this.estados.find((opcion) => opcion.valor === this.claveEstado(mascota))?.nombre ??
      'Desconocido'
    );
  }

  nombreAdoptante(id: number | null): string {
    if (id === null) return '—';
    if (id === this.ID_REFUGIO) return 'Refugio';
    return this.adoptantes.find((a) => a.id === id)?.nombre || `Adoptante #${id}`;
  }

  claseEstado(mascota: Mascota): string {
    switch (this.claveEstado(mascota)) {
      case 'adoptada':
        return 'bg-amber-100 text-amber-700';
      case 'disponible':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  }

  private claveEstado(mascota: Mascota): string {
    if (mascota.estado === 0) return 'eliminada';
    return mascota.idAdoptante === this.ID_REFUGIO ? 'disponible' : 'adoptada';
  }

  limpiarForm(): void {
    this.mascotaForm = this.formularioVacio();
    this.editando = false;
    this.cdr.detectChanges();
  }

  // ---------- Utilidades ----------

  private normalizarMascota(dato: any): Mascota {
    const numero = (valor: any): number | null =>
      valor === null || valor === undefined || valor === '' ? null : Number(valor);
    const especie = dato.especie ?? dato.ESPECIE ?? '';
    if (especie && !this.especies.includes(especie)) this.especies.push(especie);
    return {
      idMascota: numero(dato.idMascota ?? dato.IDMASCOTA ?? dato.id_mascota ?? dato.id),
      nombre: dato.nombre ?? dato.NOMBRE ?? '',
      especie,
      raza: dato.raza ?? dato.RAZA ?? '',
      edad: numero(dato.edad ?? dato.EDAD),
      sexo: numero(dato.sexo ?? dato.SEXO),
      urlImagen: dato.urlImagen ?? dato.URLIMAGEN ?? dato.url_imagen ?? '',
      fechaIngreso: dato.fechaIngreso ?? dato.FECHAINGRESO ?? dato.fecha_ingreso ?? null,
      fechaAdopcion: dato.fechaAdopcion ?? dato.FECHAADOPCION ?? dato.fecha_adopcion ?? null,
      idAdoptante: numero(dato.idAdoptante ?? dato.IDADOPTANTE ?? dato.id_adoptante),
      estado: Number(dato.estado ?? dato.ESTADO ?? 0),
    };
  }

  private obtenerIdAdoptante(adoptante: any): number | null {
    const valor =
      adoptante?.idAdoptante ??
      adoptante?.IDADOPTANTE ??
      adoptante?.id ??
      adoptante?.adoptanteId ??
      adoptante?.id_adoptante;
    if (valor === null || valor === undefined || valor === '') return null;
    const id = Number(valor);
    return Number.isInteger(id) ? id : null;
  }

  private mostrarError(error: any, mensajePredeterminado: string): void {
    Swal.fire('Error', error?.error?.mensaje || error?.message || mensajePredeterminado, 'error');
  }

  // Una mascota nueva queda por defecto en el refugio
  private formularioVacio(): Mascota {
    return {
      idMascota: null,
      nombre: '',
      especie: '',
      raza: '',
      edad: null,
      sexo: null,
      urlImagen: '',
      fechaIngreso: null,
      fechaAdopcion: null,
      idAdoptante: this.ID_REFUGIO,
      estado: 2,
    };
  }
}
