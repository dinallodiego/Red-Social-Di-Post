import { Component, OnInit,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  nuevoUsuario = {
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    usuario: '',
    email: '',
    password: '',
    repetirPassword: '',
    descripcion: '',
    perfil: 'usuario',
    activo: true
  };
  fotoPerfil!: File;
  cargando = false;
  mensaje: string = '';
  activo= true;
  passwordVisible = false;
  tipoMensaje: 'success' | 'danger' | '' = '';
  router = inject(Router);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.http.get<any[]>('http://localhost:3000/usuarios').subscribe(data => this.usuarios = data);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fotoPerfil = file;
    }
  }

  async registrarUsuario(){
    const nombre = (document.getElementById('nombre') as HTMLInputElement).value.trim();
    const apellido = (document.getElementById('apellido') as HTMLInputElement).value.trim();
    const fechaNacimiento = (document.getElementById('fechaNacimiento') as HTMLInputElement).value;
    const fotoPerfil = (document.getElementById('fotoPerfil') as HTMLInputElement);
    const usuario = (document.getElementById('usuario') as HTMLInputElement).value.trim();
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const descripcion = (document.getElementById('descripcion') as HTMLTextAreaElement).value.trim();
    const perfil = (document.getElementById('perfil') as HTMLInputElement).value;

    if (!nombre || !apellido || !fechaNacimiento || !usuario || !email || !password  || !descripcion || !fotoPerfil.files?.length) {
      this.mostrarMensaje("Completa todos los campos", "danger");
      
      return;
    }

    const nombreApellidoRegex = /^[a-zA-Z\s]+$/;
    if (!nombreApellidoRegex.test(nombre) || !nombreApellidoRegex.test(apellido)) {
      this.mostrarMensaje("Nombre y apellido solo deben contener letras", "danger");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.mostrarMensaje("Ingresa un email válido", "danger");
      return;
    }

    const contieneMayusculaYNumero = (cadena: string): boolean => {
      return /[A-Z]/.test(cadena) && /\d/.test(cadena);
    };

    if (password.length < 8 || !contieneMayusculaYNumero(password)) {
      this.mostrarMensaje("Contraseña inválida o no coincide", "danger");
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
    formData.append('perfil', perfil);
    formData.append("activo" , String(this.activo) )

    try {
  await this.http.post('http://localhost:3000/acceso', formData).toPromise();
  const loginData = { email, password };
  const loginResponse: any = await this.http.post('http://localhost:3000/acceso/login', loginData).toPromise();

  if (loginResponse?.token) {
    localStorage.setItem('token', loginResponse.token);
    this.mostrarMensaje("Usuario registrado con exito", "success");
    setTimeout(() => this.router.navigate(['/publicaciones']), 2500);
  } else {
    this.mostrarMensaje("Error al iniciar sesión", "danger");
  }

} catch (error: any) {
  console.error(error);
  this.mostrarMensaje("Error al registrar o loguear", "danger");
}

  }

 

  deshabilitarUsuario(id: string) {
    this.http.delete(`http://localhost:3000/usuarios/${id}`).subscribe(() => this.cargarUsuarios());
  }

  rehabilitarUsuario(id: string) {
    this.http.post(`http://localhost:3000/usuarios/rehabilitar/${id}`, {}).subscribe(() => this.cargarUsuarios());
  }

  limpiarFormulario() {
    this.nuevoUsuario = {
      nombre: '',
      apellido: '',
      fechaNacimiento: '',
      usuario: '',
      email: '',
      password: '',
      repetirPassword: '',
      descripcion: '',
      perfil: 'usuario',
      activo: true
    };
    this.fotoPerfil = undefined!;
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'danger') {
    this.mensaje = mensaje;
    this.tipoMensaje = tipo;
    setTimeout(() => this.mensaje = '', 4000);
  }

  togglePassword() {
      this.passwordVisible = !this.passwordVisible;
    }
}

