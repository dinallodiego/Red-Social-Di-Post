import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  @ViewChild('modalContainer', { static: true }) modalContainer!: ElementRef;

  registrando: boolean = false;
  cargoArchivo: boolean = false;
  perfil: string = "usuario";

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
    const descripcion = (document.getElementById('descripcion') as HTMLInputElement).value;

    if (fotoPerfil.files && fotoPerfil.files.length > 0) {
      this.cargoArchivo = true;
    } else {
      this.cargoArchivo = false;
    }

    if (!nombre || !apellido || !fechaNacimiento || !usuario || !email || !password || !repetirPassword || !descripcion || !this.cargoArchivo) {
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
      const tieneMayuscula = /[A-Z]/.test(cadena);
      const tieneNumero = /\d/.test(cadena);
      return tieneMayuscula && tieneNumero;
    };

    if (password.length < 8) {
      this.mostrarMensaje("La contraseña debe tener al menos 8 caracteres", "danger");
      this.registrando = false;
      return;
    } else if (!contieneMayusculaYNumero(password)) {
      this.mostrarMensaje("La contraseña debe tener al menos una mayúscula y un número", "danger");
      this.registrando = false;
      return;
    } else if (password !== repetirPassword) {
      this.mostrarMensaje("Las contraseñas no coinciden", "danger");
      this.registrando = false;
      return;
    } else {
      this.mostrarMensaje("Registro exitoso", "success");
      this.registrando = false;
      return;
    }
  }

  mostrarMensaje(mensaje: string, tipo: 'danger' | 'success') {
    this.modalContainer.nativeElement.innerHTML = '';
    this.modalContainer.nativeElement.innerHTML = `<p class="text-center text-${tipo} mt-4">${mensaje}</p>`;
  }
}
