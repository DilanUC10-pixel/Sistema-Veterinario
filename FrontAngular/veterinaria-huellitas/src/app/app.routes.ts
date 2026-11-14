import { Routes } from '@angular/router';

// NOTA: ajusta las rutas de import (./components/...) a donde tengas tus componentes.
// Se asume el nombre de archivo "<nombre>-comp" y clase "<Nombre>Comp" (convención de Angular 20).
export const routes: Routes = [
  // Al entrar a la raíz se muestra el home
  { path: '', redirectTo: 'app/home-comp', pathMatch: 'full' },

  {
    path: 'app',
    children: [
      { path: '', redirectTo: 'home-comp', pathMatch: 'full' },

      // Públicas
      {
        path: 'home-comp',
        loadComponent: () => import('./components/home-comp/home-comp').then((m) => m.HomeComp),
      },
      {
        path: 'login-comp',
        loadComponent: () => import('./components/login-comp/login-comp').then((m) => m.LoginComp),
      },
      {
        path: 'registro-comp',
        loadComponent: () =>
          import('./components/registro-comp/registro-comp').then((m) => m.Registro),
      },

      // Privadas (cuando tengas el guard, agrega: canActivate: [authGuard])
      {
        path: 'dashboard-comp',
        loadComponent: () =>
          import('./components/dashboard-comp/dashboard-comp').then((m) => m.DashboardComp),
      },
      {
        path: 'adoptantes-comp',
        loadComponent: () =>
          import('./components/adoptantes-comp/adoptantes-comp').then((m) => m.AdoptantesComp),
      },
      {
        path: 'mascotas-comp',
        loadComponent: () =>
          import('./components/mascotas-comp/mascotas-comp').then((m) => m.MascotasComp),
      },
      {
        path: 'citas-seguimiento-comp',
        loadComponent: () =>
          import('./components/citas-seguimiento-comp/citas-seguimiento-comp').then(
            (m) => m.CitasSeguimientoComp,
          ),
      },
      {
        path: 'vacunas-comp',
        loadComponent: () =>
          import('./components/vacunas-comp/vacunas-comp').then((m) => m.VacunasComp),
      },
      {
        path: 'chips-comp',
        loadComponent: () => import('./components/chips-comp/chips-comp').then((m) => m.ChipsComp),
      },
    ],
  },

  // Cualquier ruta desconocida regresa al home
  { path: '**', redirectTo: 'app/home-comp' },
];
