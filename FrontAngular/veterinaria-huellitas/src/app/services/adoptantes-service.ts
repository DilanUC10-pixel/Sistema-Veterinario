import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AdoptantesService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/adoptantes';

  private platformId = inject(PLATFORM_ID);

  private _adoptante = signal<any | null>(this.leerSesion());

  adoptante = this._adoptante.asReadonly();
  isLoggedIn = computed(() => this._adoptante() !== null);
  isAdmin = computed(() => this._adoptante()?.rol === 0);

  guardarSesion(data: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('adoptante', JSON.stringify(data));
    }
    this._adoptante.set(data); // esto hace que el menú se actualice
  }

  logOut(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('adoptante');
    }
    this._adoptante.set(null);
  }

  private leerSesion(): any | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const raw = localStorage.getItem('adoptante');
    return raw ? JSON.parse(raw) : null;
  }

  listar(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<any> {
    if (!Number.isInteger(id) || id <= 0) {
      return throwError(() => new Error('Se requiere un ID válido para buscar el adoptante.'));
    }
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  guardar(adoptante: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, adoptante);
  }

  actualizar(id: number, adoptante: any): Observable<any> {
    if (!Number.isInteger(id)) {
      return throwError(() => new Error('Se requiere un ID válido para actualizar el adoptante.'));
    }
    return this.http.put<any>(`${this.apiUrl}/${id}`, adoptante);
  }

  eliminar(id: number): Observable<any> {
    if (!Number.isInteger(id)) {
      return throwError(() => new Error('Se requiere un ID válido para eliminar el adoptante.'));
    }
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
