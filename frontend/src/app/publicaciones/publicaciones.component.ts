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

  mostrarModal = false;
  nuevoContenido = '';
  nuevaImagen: File | null = null;

  constructor(private http: HttpClient) {
    this.cargarPublicaciones();
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
      order: 'desc'
    };

    this.http.get<any[]>('http://localhost:3000/publicaciones', { params }).subscribe({
      next: (data) => {
        this.publicaciones = data;
      },
      error: (err) => {
        console.error('Error al cargar publicaciones:', err);
      }
    });
  }

  crearNuevaPublicacion() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.nuevoContenido = '';
    this.nuevaImagen = null;
  }

   agregarPublicacion() {
  if (!this.nuevaImagen || !this.nuevoContenido.trim()) {
    this.mostrarMensaje("Completa todos los campos", "danger");
    return;
  }

  const formData = new FormData();
  formData.append('usuario', 'dinallodiego');
  formData.append('imagen', this.nuevaImagen);
  formData.append('descripcion', this.nuevoContenido);
  formData.append('fecha', new Date().toISOString());
  formData.append('publicada', 'true');
  formData.append('likes', "0");

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
    this.modalContainer.nativeElement.innerHTML = `<p class="text-center text-${tipo} mt-4">${mensaje}</p>`;
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
}
