import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MascotasService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/mascotas';

  listar(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<any> {
    if (!Number.isInteger(id) || id <= 0) {
      return throwError(() => new Error('Se requiere un ID válido para buscar la mascota.'));
    }
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  listarPorAdoptante(idAdoptante: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/adoptante/${idAdoptante}`);
  }

  guardar(mascota: object): Observable<any> {
    return this.http.post<any>(this.apiUrl, mascota);
  }

  actualizar(id: number, mascota: object): Observable<any> {
    if (!Number.isInteger(id)) {
      return throwError(() => new Error('Se requiere un ID válido para actualizar la mascota.'));
    }
    return this.http.put<any>(`${this.apiUrl}/${id}`, mascota);
  }

  actualizarEstadoAdopcion(id: number, mascota: object): Observable<any> {
    if (!Number.isInteger(id)) {
      return throwError(() => new Error('Se requiere un ID válido para registrar la adopción.'));
    }
    return this.http.put<any>(`${this.apiUrl}/${id}/adopcion`, mascota);
  }

  eliminar(id: number): Observable<any> {
    if (!Number.isInteger(id)) {
      return throwError(() => new Error('Se requiere un ID válido para eliminar la mascota.'));
    }
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
