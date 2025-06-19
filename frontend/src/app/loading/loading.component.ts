import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      if (this.tokenActivo()) {
        this.router.navigate(['/publicaciones']);
      } else {
        this.router.navigate(['/login']);
      }
    }, 5000);
  }

  private estaExpirado(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const ahora = Math.floor(Date.now() / 1000);
      return payload.exp < ahora;
    } catch (e) {
      console.error('Token inválido o mal formado:', e);
      return true;
    }
  }

  private tokenActivo(): boolean {
    const token = localStorage.getItem('token');
    return !!token && !this.estaExpirado(token);
  }
}
