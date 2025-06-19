import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  nombre_usuario: string = '';

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.nombre_usuario = this.ObtenerNombreUsuario();
  } 
  
  ObtenerNombreUsuario() {
    const storageData = localStorage.getItem('access_token'); 
    if (!storageData) return '';

    try {
        const data = JSON.parse(storageData);
        return data.user?.nombre ?? ''; 
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return '';
    }
  }

  isCurrentPage(route: string): boolean {
    return this.router.url === route;
  }

  debeMostrarNavbar(): boolean {
    const rutasSinNavbar = ['/loading', '/']; 
    return !rutasSinNavbar.includes(this.router.url);
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

cerrarSesion(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario'); 
  this.nombre_usuario = '';
  this.router.navigate(['/login']);
}

}
