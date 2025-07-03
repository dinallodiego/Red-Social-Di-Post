import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

 
  function perfil():string{
     const token = localStorage.getItem('token');
      if (!token) return '';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.perfil ?? '';
    } catch {
      return '';
    }

  }

  if (perfil() === 'admin') {
    return true;
  } else {
    router.navigate(['/publicaciones']);
    return false;
  }

  
};
