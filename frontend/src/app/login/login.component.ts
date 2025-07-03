import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Injectable , inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [CommonModule],
})
export class LoginComponent {
  usuarioIniciado: boolean = false;
  mensaje: string = '';
  colorMensaje: string = 'red';
  passwordVisible = false;
  router = inject(Router);

  constructor(private http: HttpClient) {}

  async login() {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      this.colorMensaje = 'red';
      this.mensaje = 'Completar todos los campos';
      return;
    }
    if (!emailRegex.test(email)) {
      this.colorMensaje = 'red';
      this.mensaje = 'Ingresa un email válido';
      return;
    }

    
    try {
    const response: any = await firstValueFrom(
      this.http.post('http://localhost:3000/acceso/login', {
        email,
        password
      })
    );

    if (response && response.usuario && response.token) {
      if (!response.usuario.activo) {
      this.colorMensaje = 'red';
      this.mensaje = 'Tu cuenta fue deshabilitada por el administrador';
      return;
      }
    localStorage.setItem('token', response.token);
    localStorage.setItem('usuario', JSON.stringify(response.usuario));
    this.colorMensaje = 'green';
    this.mensaje = 'Ingreso correcto';
    this.usuarioIniciado = true;

    setTimeout(() => this.router.navigate(['/publicaciones']), 2000);
  } else {
    this.colorMensaje = 'red';
    this.mensaje = 'Credenciales incorrectas';
  }


  } catch (error: any) {
    console.error('Error en login:', error);
    this.colorMensaje = 'red';

    if (error.status === 404) {
      this.mensaje = 'Usuario no encontrado';
    } else if (error.status === 401) {
      this.mensaje = 'Contraseña incorrecta';
    } else {
      this.mensaje = 'Error al conectar con el servidor';
    }
  }

  }

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }
}
