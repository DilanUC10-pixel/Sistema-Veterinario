import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AdoptantesService } from './services/adoptantes-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
  ],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('veterinaria-huellitas');

  menu = [
    { label: 'Dashboard', icon: 'dashboard', ruta: '/app/dashboard-comp' },
    { label: 'Adoptantes', icon: 'groups', ruta: '/app/adoptantes-comp' },
    { label: 'Mascotas', icon: 'pets', ruta: '/app/mascotas-comp' },
    { label: 'Vacunas', icon: 'vaccines', ruta: '/app/vacunas-comp' },
    { label: 'Chips de rastreo', icon: 'location_searching', ruta: '/app/chips-comp' },
  ];

  constructor(
    public authService: AdoptantesService,
    private router: Router,
  ) {}

  onLogout(): void {
    this.authService.logOut();
    this.router.navigate(['/app/home-comp']);
  }
}
