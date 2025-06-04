import { Component } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-registro',
  imports: [],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  @ViewChild('modalContainer', { static: true }) modalContainer!: ElementRef;
  registrando: boolean = false;
  cargoArchivo: boolean = false;
  perfil: string = "usuario";
  async registrarUsuario() {
  if (this.registrando) return;
  this.registrando = true;
  //tomo los valores ingresados 
  const nombre = (document.getElementById('nombre') as HTMLInputElement).value.trim();
  const apellido = (document.getElementById('apellido') as HTMLInputElement).value.trim();
  const fechaNacimientoInput = document.getElementById('fechaNacimiento') as HTMLInputElement;
  const fechaNacimiento = fechaNacimientoInput.value;
  const fotoPerfil = document.getElementById('fotoPerfil') as HTMLInputElement;
  if (fotoPerfil.files && fotoPerfil.files.length > 0) {
  const archivo = fotoPerfil.files[0];
  const nombreArchivo = archivo.name;
  this.cargoArchivo=true;
  }
  const usuario= (document.getElementById('usuario') as HTMLInputElement).value.trim();
  const email = (document.getElementById('email') as HTMLInputElement).value.trim();
  const password = (document.getElementById('password') as HTMLInputElement).value;
  const repetirPassword = (document.getElementById('repetirPassword') as HTMLInputElement).value;
  const descripcion = (document.getElementById('descripcion') as HTMLInputElement).value;
  
   //valido que no haya nada en blanco sino lo informo
  if (!nombre || !apellido || !fechaNacimiento || !usuario || !email || !password || !repetirPassword || !descripcion  || this.cargoArchivo===false) {
    this.mostrarMensaje("Completa todos los campos", "danger");
    this.registrando = false;
    return;
  }
   //con regex valido que nombre y apellido sean solo letras
  const nombreApellidoRegex = /^[a-zA-Z\s]+$/;
  if (!nombreApellidoRegex.test(nombre) || !nombreApellidoRegex.test(apellido)) {
    this.mostrarMensaje("Nombre y apellido solo deben contener letras", "danger");
    this.registrando = false;
    return;
  }
  //con regex valido el formato de un email texto hasta un arroba luego de la arroba mas texto un punto explicito y mas texto y q no haya espacios
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    this.mostrarMensaje("Ingresa un email válido", "danger");
    this.registrando = false;
    return;
  }
  //valido password
  const contieneMayusculaYNumero = (cadena: string): boolean => {
      const tieneMayuscula = /[A-Z]/.test(cadena);
      const tieneNumero = /\d/.test(cadena);
      return tieneMayuscula && tieneNumero;
    };

  if (password.length < 8) {
      this.mostrarMensaje("La contraseña debe tener al menos 8 caracteres", "danger");
      this.registrando = false;
      return;
  } 
  else if (!contieneMayusculaYNumero(password)) {
      this.mostrarMensaje("La contraseña debe tener al menos una mayuscula y un número", "danger");
      this.registrando = false;
      return;
    } 
  else if(password!==repetirPassword){
    this.mostrarMensaje("Las contraseñas no coinciden", "danger");
    this.registrando = false;
    return;
  }
  else{
    this.mostrarMensaje("Registro exitoso", "success");
    this.registrando = true;
    return;

  }
  }


  mostrarMensaje(mensaje: string, tipo: 'danger' | 'success') {
  this.modalContainer.nativeElement.innerHTML =
    `<p class="text-center text-${tipo} mt-4">${mensaje}</p>`;
}
}
