import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';

export interface CitaSeguimiento {
  IDCITASEGUIMIENTO?: number;
  IDMASCOTA: number;
  FECHACITA: string;
  motivo: string;
  observaciones: string;
  estado?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class CitaSeguimientoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/citas-seguimiento';

  listar(): Observable<ApiResponse<CitaSeguimiento[]>> {
    return this.http.get<ApiResponse<CitaSeguimiento[]>>(this.apiUrl);
  }

  listarPorMascota(idMascota: number): Observable<ApiResponse<CitaSeguimiento[]>> {
    if (!Number.isInteger(idMascota) || idMascota <= 0) {
      return throwError(() => new Error('Se requiere un ID válido para buscar citas.'));
    }
    return this.http.get<ApiResponse<CitaSeguimiento[]>>(
      `${this.apiUrl}/mascota/${idMascota}`,
    );
  }

  buscarPorId(id: number): Observable<ApiResponse<CitaSeguimiento>> {
    if (!Number.isInteger(id) || id <= 0) {
      return throwError(() => new Error('Se requiere un ID válido para buscar la cita.'));
    }
    return this.http.get<ApiResponse<CitaSeguimiento>>(`${this.apiUrl}/${id}`);
  }

  guardar(cita: CitaSeguimiento): Observable<ApiResponse<CitaSeguimiento>> {
    return this.http.post<ApiResponse<CitaSeguimiento>>(this.apiUrl, cita);
  }

  actualizar(
    id: number,
    cita: CitaSeguimiento,
  ): Observable<ApiResponse<CitaSeguimiento>> {
    if (!Number.isInteger(id) || id <= 0) {
      return throwError(() => new Error('Se requiere un ID válido para actualizar la cita.'));
    }
    return this.http.put<ApiResponse<CitaSeguimiento>>(`${this.apiUrl}/${id}`, cita);
  }

  eliminar(id: number): Observable<ApiResponse<CitaSeguimiento>> {
    if (!Number.isInteger(id) || id <= 0) {
      return throwError(() => new Error('Se requiere un ID válido para eliminar la cita.'));
    }
    return this.http.delete<ApiResponse<CitaSeguimiento>>(`${this.apiUrl}/${id}`);
  }
}
