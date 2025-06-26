import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  imports : [CommonModule, FormsModule],
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {
  publicaciones: any[] = [];
  mostrarModalComentarios = false;
  comentariosActuales: { usuario: string; contenido: string; fecha: string }[] = [];
  comentarioNuevo = '';
  publicacionSeleccionadaId: string | null = null;




  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const usuario = this.user_name;
    if (usuario) {
      this.http.get<any[]>(`http://localhost:3000/publicaciones/usuario/${usuario}`)
        .subscribe({
          next: (data) => this.publicaciones = data,
          error: (err) => console.error('Error al obtener publicaciones:', err)
        });
    }
  }

  


  get user_name(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.usuario ?? '';
    } catch {
      return '';
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

  get descripcion(): string {
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
      return filename ? `http://localhost:3000/uploads/perfiles/${filename}` : 'assets/default-profile.png';
    } catch {
      return 'assets/default-profile.png';
    }
  }

  darLike(publicacionId: string) {
    const usuario = this.user_name;
    if (!usuario) {
      alert('Debés estar logueado para dar like');
      return;
    }

    this.http.put(`http://localhost:3000/publicaciones/${publicacionId}/like`, { usuario })
      .subscribe({
        next: () => {
          this.publicaciones = this.publicaciones.map(pub => {
            if (pub._id === publicacionId) {
              const index = pub.likes.indexOf(usuario);
              if (index === -1) {
                pub.likes.push(usuario);
              } else {
                pub.likes.splice(index, 1);
              }
            }
            return pub;
          });
        },
        error: (err) => {
          console.error('Error al dar like:', err);
          alert('Error al dar like');
        }
      });
  }

  abrirComentarios(pub: any) {
  this.publicacionSeleccionadaId = pub._id;
  this.comentariosActuales = pub.comentarios || [];
  this.mostrarModalComentarios = true;
  }


  cerrarModalComentarios() {
  this.mostrarModalComentarios = false;
  this.comentarioNuevo = '';
  this.publicacionSeleccionadaId = null;
  this.comentariosActuales = [];
  }


  agregarComentario() {
  if (!this.comentarioNuevo.trim()) return;

  const body = {
    usuario: this.user_name,
    contenido: this.comentarioNuevo
  };

  this.http.put(`http://localhost:3000/publicaciones/${this.publicacionSeleccionadaId}/comentarios`, body).subscribe({
    next: () => {
      this.comentarioNuevo = '';
      this.publicaciones = this.publicaciones.map(pub => {
        if (pub._id === this.publicacionSeleccionadaId) {
          return {
            ...pub,
            comentarios: [
              ...pub.comentarios,
              {
                usuario: this.user_name,
                contenido: body.contenido,
                fecha: new Date().toISOString()
              }
            ]
          };
        }
        return pub;
      });
      this.comentariosActuales = this.publicaciones.find(p => p._id === this.publicacionSeleccionadaId)?.comentarios || [];
    },
    error: err => {
      console.error('Error al comentar:', err);
    }
  });
}




}
