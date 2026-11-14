import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AdoptantesService } from '../../services/adoptantes-service'; // ajusta la ruta

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login-comp',
  standalone: true,
  templateUrl: './login-comp.html',
})
export class LoginComp {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private auth = inject(AdoptantesService); // <-- aquí va el inject

  enviando = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required]],
  });

  invalido(campo: 'correo' | 'contrasena'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || c.dirty);
  }

  enviar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set('');

    this.http
      .post<{ success: boolean; mensaje: string; data: any }>(
        'http://localhost:8080/api/adoptantes/login',
        this.form.getRawValue(),
      )
      .subscribe({
        next: (res) => {
          if (!res.success) {
            this.enviando.set(false);
            this.error.set(res.mensaje || 'Correo o contraseña incorrectos.');
            return;
          }
          this.auth.guardarSesion(res.data); // <-- reemplaza el localStorage
          const destino = res.data.rol === 0 ? '/app/admin-comp' : '/app/dashboard-comp';
          this.router.navigate([destino]);
        },
        error: (err) => {
          this.enviando.set(false);
          this.error.set(
            err.status === 0
              ? 'No se pudo conectar con el servidor.'
              : err.error?.mensaje || 'Correo o contraseña incorrectos.',
          );
        },
      });
  }
}
