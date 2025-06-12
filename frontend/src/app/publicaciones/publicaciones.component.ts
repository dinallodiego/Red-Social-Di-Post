import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  imports: [CommonModule],
  styleUrls: ['./publicaciones.component.css']
})
export class PublicacionesComponent {
  publicaciones = [
    { id: 1, autor: 'Diego', contenido: 'Publicacion1', fecha: new Date('2024-06-01'), likes: 5, leGusto: false },
    { id: 2, autor: 'Ana', contenido: 'Publicacion 2', fecha: new Date('2024-06-05'), likes: 15, leGusto: false },
    { id: 3, autor: 'Lucía', contenido: 'Publicacion 3', fecha: new Date('2024-06-10'), likes: 2, leGusto: false },
    { id: 4, autor: 'Carlos', contenido: 'Publicacion 4', fecha: new Date('2024-06-11'), likes: 8, leGusto: false },
    { id: 5, autor: 'María', contenido: 'Publicacion 5', fecha: new Date('2024-06-12'), likes: 3, leGusto: false },
    { id: 6, autor: 'Lautaro', contenido: 'Publicacion 6', fecha: new Date('2024-06-13'), likes: 12, leGusto: false }
  ];

  orden: 'fecha' | 'likes' = 'fecha';
  paginaActual = 1;
  publicacionesPorPagina = 3;

  constructor() {
    this.cargarLikesDeLocalStorage();
  }

  cambiarOrden(orden: 'fecha' | 'likes') {
    this.orden = orden;
    this.paginaActual = 1;
  }

  toggleLike(pub: any) {
    pub.leGusto = !pub.leGusto;
    pub.likes += pub.leGusto ? 1 : -1;
    this.guardarLikesEnLocalStorage();
  }

  get publicacionesOrdenadas() {
    return [...this.publicaciones].sort((a, b) => {
      return this.orden === 'fecha'
        ? b.fecha.getTime() - a.fecha.getTime()
        : b.likes - a.likes;
    });
  }

  get publicacionesPaginadas() {
    const inicio = (this.paginaActual - 1) * this.publicacionesPorPagina;
    return this.publicacionesOrdenadas.slice(inicio, inicio + this.publicacionesPorPagina);
  }

  paginasTotales() {
    return Math.ceil(this.publicaciones.length / this.publicacionesPorPagina);
  }

  guardarLikesEnLocalStorage() {
    const estadoLikes = this.publicaciones.map(pub => ({ id: pub.id, leGusto: pub.leGusto, likes: pub.likes }));
    localStorage.setItem('estadoLikes', JSON.stringify(estadoLikes));
  }

  cargarLikesDeLocalStorage() {
    const data = localStorage.getItem('estadoLikes');
    if (data) {
      const estadoGuardado = JSON.parse(data);
      this.publicaciones.forEach(pub => {
        const encontrado = estadoGuardado.find((p: any) => p.id === pub.id);
        if (encontrado) {
          pub.leGusto = encontrado.leGusto;
          pub.likes = encontrado.likes;
        }
      });
    }
  }
}
