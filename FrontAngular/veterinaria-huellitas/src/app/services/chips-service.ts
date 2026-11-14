import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChipsService {
  private readonly http = inject(HttpClient);
  private readonly stockUrl = 'http://localhost:8080/api/chips-rastreo-stock';
  private readonly aplicadosUrl = 'http://localhost:8080/api/chips-rastreo-aplicado';

  listarStock(): Observable<unknown> {
    return this.http.get<unknown>(this.stockUrl);
  }

  buscarStock(id: number): Observable<unknown> {
    return this.http.get<unknown>(`${this.stockUrl}/${id}`);
  }

  guardarStock(chip: object): Observable<unknown> {
    return this.http.post<unknown>(this.stockUrl, chip);
  }

  actualizarStock(id: number, chip: object): Observable<unknown> {
    return this.http.put<unknown>(`${this.stockUrl}/${id}`, chip);
  }

  eliminarStock(id: number): Observable<unknown> {
    return this.http.delete<unknown>(`${this.stockUrl}/${id}`);
  }

  aplicarChip(request: object): Observable<unknown> {
    return this.http.post<unknown>(this.aplicadosUrl, request);
  }

  historialPorMascota(idMascota: number): Observable<unknown> {
    return this.http.get<unknown>(`${this.aplicadosUrl}/mascota/${idMascota}`);
  }
}
