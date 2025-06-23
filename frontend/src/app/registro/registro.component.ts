import { Component, ElementRef, NgModule, ViewChild, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  imports : [CommonModule]
})
export class RegistroComponent {
  @ViewChild('modalContainer', { static: true }) modalContainer!: ElementRef;

  registrando: boolean = false;
  perfil: string = "usuario";
  passwordVisible = false;
  router = inject(Router);
  constructor(private http: HttpClient) {}

  async registrarUsuario() {
    if (this.registrando) return;
    this.registrando = true;

    const nombre = (document.getElementById('nombre') as HTMLInputElement).value.trim();
    const apellido = (document.getElementById('apellido') as HTMLInputElement).value.trim();
    const fechaNacimiento = (document.getElementById('fechaNacimiento') as HTMLInputElement).value;
    const fotoPerfil = (document.getElementById('fotoPerfil') as HTMLInputElement);
    const usuario = (document.getElementById('usuario') as HTMLInputElement).value.trim();
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const repetirPassword = (document.getElementById('repetirPassword') as HTMLInputElement).value;
    const descripcion = (document.getElementById('descripcion') as HTMLTextAreaElement).value.trim();

    if (!nombre || !apellido || !fechaNacimiento || !usuario || !email || !password || !repetirPassword || !descripcion || !fotoPerfil.files?.length) {
      this.mostrarMensaje("Completa todos los campos", "danger");
      this.registrando = false;
      return;
    }

    const nombreApellidoRegex = /^[a-zA-Z\s]+$/;
    if (!nombreApellidoRegex.test(nombre) || !nombreApellidoRegex.test(apellido)) {
      this.mostrarMensaje("Nombre y apellido solo deben contener letras", "danger");
      this.registrando = false;
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.mostrarMensaje("Ingresa un email válido", "danger");
      this.registrando = false;
      return;
    }

    const contieneMayusculaYNumero = (cadena: string): boolean => {
      return /[A-Z]/.test(cadena) && /\d/.test(cadena);
    };

    if (password.length < 8 || !contieneMayusculaYNumero(password) || password !== repetirPassword) {
      this.mostrarMensaje("Contraseña inválida o no coincide", "danger");
      this.registrando = false;
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('fechaNacimiento', fechaNacimiento);
    formData.append('fotoPerfil', fotoPerfil.files[0]);
    formData.append('usuario', usuario);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('descripcion', descripcion);
    formData.append('perfil', this.perfil);

    try {
  await this.http.post('http://localhost:3000/acceso', formData).toPromise();
  const loginData = { email, password };
  const loginResponse: any = await this.http.post('http://localhost:3000/acceso/login', loginData).toPromise();

  if (loginResponse?.token) {
    localStorage.setItem('token', loginResponse.token);
    this.mostrarMensaje("Registro exitoso. Bienvenido a DiPost", "success");
    setTimeout(() => this.router.navigate(['/publicaciones']), 2500);
  } else {
    this.mostrarMensaje("Error al iniciar sesión", "danger");
  }

} catch (error: any) {
  console.error(error);
  this.mostrarMensaje("Error al registrar o loguear", "danger");
}

  }

  mostrarMensaje(mensaje: string, tipo: 'danger' | 'success') {
    this.modalContainer.nativeElement.innerHTML = `<p class="text-center text-${tipo} mt-4">${mensaje}</p>`;
  }

   togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }
}
