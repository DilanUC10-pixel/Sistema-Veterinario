import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro-comp',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro-comp.html',
})
export class Registro {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  enviando = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    apellidoPaterno: ['', [Validators.required, Validators.maxLength(100)]],
    apellidoMaterno: ['', [Validators.required, Validators.maxLength(100)]],
    telefono: ['', [Validators.maxLength(20)]],
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    direccion: ['', [Validators.maxLength(200)]],
    contrasena: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
  });

  invalido(campo: keyof typeof this.form.controls): boolean {
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

    this.http.post('http://localhost:8080/api/adoptantes', this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/app/login']),
      error: (err) => {
        this.enviando.set(false);
        this.error.set(
          err.status === 0
            ? 'No se pudo conectar con el servidor.'
            : 'No se pudo crear la cuenta. Revisa tus datos e inténtalo de nuevo.',
        );
      },
    });
  }
}
