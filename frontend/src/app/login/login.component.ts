import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  constructor(){}
  usuarioIniciado:boolean=false;
  mensaje: string = '';
  colorMensaje: string = 'red'; 
  //tomo los valores y los valido

  async login() {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    const contieneMayusculaYNumero = (cadena: string): boolean => {
      const tieneMayuscula = /[A-Z]/.test(cadena);
      const tieneNumero = /\d/.test(cadena);
      return tieneMayuscula && tieneNumero;
    };

    if (password.length < 8) {
      this.colorMensaje = 'red';
      this.mensaje = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!contieneMayusculaYNumero(password)) {
      this.colorMensaje = 'red';
      this.mensaje = 'La contraseña debe tener al menos una mayúscula y un número';
    } else {
      this.colorMensaje = 'green';
      this.mensaje = 'Ingreso correcto';
      this.usuarioIniciado = true;
    }

    if(this.usuarioIniciado===true){
      console.log('El email es:', email, 'y la contraseña es:', password);
    }
  }


  //LOGICA CON LA BASE DE DATOS PARA INICIAR SESION 
  
}
