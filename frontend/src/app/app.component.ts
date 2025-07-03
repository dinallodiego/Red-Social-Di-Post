import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { signal } from '@angular/core';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  sidebarVisible = false;
  mostrarModal = false;
  esAdmin = signal(false);

  constructor(public router: Router, private http: HttpClient,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.esAdmin.set(this.verificarAdministrador());
    this.cdr.detectChanges();
    setInterval(() => {
      this.verificarToken();
    }, 10000);
    
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  closeSidebarOnMobile(): void {
    if (window.innerWidth <= 992) {
      this.sidebarVisible = false;
    }
  }

  get nombre_usuario(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.nombre ?? '';
    } catch {
      return '';
    }
  }

  get perfil(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.perfil ?? '';
    } catch {
      return '';
    }
  }

  verificarAdministrador(): boolean {
  const token = localStorage.getItem('token');

  if (!token) {
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    if (!payload.perfil) {
      return false;
    }

    const esAdmin = payload.perfil.toLowerCase() === 'admin';
    return esAdmin;
    
  } catch (error) {
    return false;
  }
}


  isCurrentPage(route: string): boolean {
    return this.router.url === route;
  }

  tokenActivo(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const ahora = Math.floor(Date.now() / 1000);
      return payload.exp > ahora;
    } catch (e) {
      return false;
    }
  }

  verificarToken(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const ahora = Math.floor(Date.now() / 1000);
      const tiempoRestante = payload.exp - ahora;

      if (tiempoRestante <= 300 && !this.mostrarModal) {
        this.mostrarModal = true;
      }

      if (tiempoRestante <= 0) {
        this.cerrarSesion();
      }
    } catch {
      this.cerrarSesion();
    }
  }

  extenderSesion(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http
      .post<any>('http://localhost:3000/acceso/renovar-token', { token })
      .subscribe({
        next: (data) => {
          if (data.token) {
            localStorage.setItem('token', data.token);
            this.mostrarModal = false;
             this.esAdmin.set(this.verificarAdministrador());
             this.cdr.detectChanges(); 
          }
        },
        error: () => {
          this.cerrarSesion();
        },
      });
  }

  cerrarSesion(): void {
    this.mostrarModal = false;
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}
