import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  function estaExpirado(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const ahora = Math.floor(Date.now() / 1000);
      return payload.exp < ahora;
    } catch (e) {
      console.error('Token inválido o mal formado:', e);
      return true;
    }
  }

  function tokenActivo(): boolean {
    const token = localStorage.getItem('token');
    return !!token && !estaExpirado(token);
  }

  if (tokenActivo()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
