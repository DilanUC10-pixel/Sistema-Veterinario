import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VacunasService {
  private readonly http = inject(HttpClient);
  private readonly stockUrl = 'http://localhost:8080/api/vacunas-stock';
  private readonly aplicadasUrl = 'http://localhost:8080/api/vacunas-aplicadas';

  listarStock(): Observable<unknown> {
    return this.http.get<unknown>(this.stockUrl);
  }

  guardarStock(vacuna: object): Observable<unknown> {
    return this.http.post<unknown>(this.stockUrl, vacuna);
  }

  actualizarStock(id: number, vacuna: object): Observable<unknown> {
    return this.http.put<unknown>(`${this.stockUrl}/${id}`, vacuna);
  }

  eliminarStock(id: number): Observable<unknown> {
    return this.http.delete<unknown>(`${this.stockUrl}/${id}`);
  }

  aplicarVacuna(request: object): Observable<unknown> {
    return this.http.post<unknown>(this.aplicadasUrl, request);
  }

  historialPorMascota(idMascota: number): Observable<unknown> {
    return this.http.get<unknown>(`${this.aplicadasUrl}/mascota/${idMascota}`);
  }
}
