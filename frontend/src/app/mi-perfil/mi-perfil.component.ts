import { Component } from '@angular/core';

@Component({
  selector: 'app-mi-perfil',
  imports: [],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent {


 

   get user_name(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.usuario ?? ''; 
    } catch {
      return '';
    }
  } get descripcion(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.descripcion ?? ''; 
    } catch {
      return '';
    }
  } 
  get foto_dePerfilPath(): string {
  const token = localStorage.getItem('token');
  if (!token) return 'assets/default-profile.png';

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const filename = payload.fotoPerfil ?? '';
    console.log('Foto perfil desde token:', filename);
    return filename ? `http://localhost:3000/uploads/perfiles/${filename}` : 'assets/default-profile.png';
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return 'assets/default-profile.png';
  }
}




   get nombre(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.nombre ?? ''; 
    } catch {
      return '';
    }
  }
}
