import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.css']
})
export class PublicacionesComponent {
  @ViewChild('modalContainer', { static: false }) modalContainer!: ElementRef;

  router = inject(Router);
  orden: 'fecha' | 'likes' = 'fecha';
  paginaActual = 1;
  publicacionesPorPagina = 3;
  publicaciones: any[] = [];

  comentarioEnEdicion: number | null = null; 
  comentarioEditado: string = '';


  mostrarModal = false;
  nuevoContenido = '';
  nuevaImagen: File | null = null;
  totalDePublicaciones = 0;

  comentariosActuales: { usuario: string; contenido: string; fecha: string }[] = [];
  comentarioNuevo: string = '';
  publicacionSeleccionadaId: string | null = null;
  mostrarModalComentarios = false;

  publicacionDetalle: any = null;
  mostrarModalDetalle = false;



  constructor(private http: HttpClient) {
    
  }

  ngOnInit(){
    this.cargarPublicaciones();
    
   
  }



  ordenarPor(tipo: 'fecha' | 'likes') {
  this.orden = tipo;
  this.paginaActual = 1;
  this.cargarPublicaciones();
}
  cargarPublicaciones() {
    const params = {
    page: this.paginaActual.toString(),
    limit: this.publicacionesPorPagina.toString(),
    sortBy: this.orden,
    order: 'desc',
    usuario: this.user_name,  
    perfil: this.perfil
    };
    

  this.http.get<any>('http://localhost:3000/publicaciones', { params }).subscribe({
    next: (data) => {
      this.publicaciones = data.publicaciones;
      this.totalDePublicaciones = data.total;
    },
    error: (err) => {
      console.error('Error al cargar publicaciones:', err);
    }
  });
}


  hayPaginaSiguiente(): boolean {
    const totalPaginas = Math.ceil(this.totalDePublicaciones / this.publicacionesPorPagina);
    return this.paginaActual < totalPaginas;
  }


  crearNuevaPublicacion() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.nuevoContenido = '';
    this.nuevaImagen = null;
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

   agregarPublicacion() {
  if (!this.nuevaImagen || !this.nuevoContenido.trim()) {
    this.mostrarMensaje("Completa todos los campos", "danger");
    return;
  }

  const formData = new FormData();
  formData.append('usuario', this.user_name);
  formData.append('imagen', this.nuevaImagen);
  formData.append('descripcion', this.nuevoContenido);
  formData.append('fecha', new Date().toISOString());
  formData.append('publicada', 'true');

  this.http.post('http://localhost:3000/publicaciones', formData).subscribe({
    next: () => {
      this.mostrarMensaje("Publicación exitosa", "success");
      this.cargarPublicaciones(); 
      this.cerrarModal();          
    },
    error: (error) => {
      console.error(error);
      this.mostrarMensaje("Error al registrar publicación", "danger");
    }
  });
}


  onImagenSeleccionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.nuevaImagen = file;
    }
  }

  mostrarMensaje(mensaje: string, tipo: 'danger' | 'success') {
  if (this.modalContainer) {
    this.modalContainer.nativeElement.innerHTML = `<p class="text-center text-${tipo} mt-4">${mensaje}</p>`;
  }
}


  obtenerUrlImagen(nombre: string) {
    return `http://localhost:3000/uploads/publicaciones/${nombre}`;
  }

  siguientePagina() {
    this.paginaActual++;
    this.cargarPublicaciones();
  }

  anteriorPagina() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.cargarPublicaciones();
    }
  }

  darLike(publicacionId: string) {
  const usuario = this.user_name;
  if (!usuario) {
    this.mostrarMensaje('Debés estar logueado para dar like', 'danger');
    return;
  }

  this.http.put(`http://localhost:3000/publicaciones/${publicacionId}/like`, { usuario }).subscribe({
    next: () => {
      this.mostrarMensaje('¡Te gusta esta publicación!', 'success');
      this.cargarPublicaciones(); 
    },
    error: (error) => {
      console.error(error);
      this.mostrarMensaje('Error al dar like', 'danger');
    }
  });
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

  puedeModificar(pub: any): boolean {
  return this.perfil === 'admin' || pub.usuario === this.user_name;
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
      this.mostrarMensaje('Error al comentar', 'danger');
    }
  });
}



  abrirComentarios(pub: any) {
    this.comentariosActuales = pub.comentarios || [];
    this.publicacionSeleccionadaId = pub._id;
    this.mostrarModalComentarios = true;
  }

  

  cerrarModalComentarios() {
  this.mostrarModalComentarios = false;
  this.comentarioNuevo = '';
  this.publicacionSeleccionadaId = null;
  this.comentariosActuales = [];
}


  abrirDetallePublicacion(pub: any) {
    this.publicacionDetalle = pub;
    this.mostrarModalDetalle = true;
  }

  cerrarModalDetalle() {
    this.mostrarModalDetalle = false;
    this.publicacionDetalle = null;
  }

 eliminarPublicacion(id: string) {
  this.http.put(`http://localhost:3000/publicaciones/${id}/deshabilitar`, {}).subscribe({
    next: () => {
      this.mostrarMensaje('Publicación eliminada correctamente', 'success');
      this.cargarPublicaciones(); 
    },
    error: (error) => {
      console.error('Error al eliminar publicación:', error);
      this.mostrarMensaje('No se pudo eliminar la publicación', 'danger');
    }
  });
}

rehabilitarPublicacion(id: string) {
  this.http.put(`http://localhost:3000/publicaciones/${id}/rehabilitar`, {}).subscribe({
    next: () => {
      this.mostrarMensaje('Publicación dada de alta correctamente', 'success');
      this.cargarPublicaciones();
    },
    error: (error) => {
      console.error('Error al dar de alta la publicación:', error);
      this.mostrarMensaje('No se pudo dar de alta la publicación', 'danger');
    }
  });
}






}
