import { LoginComponent } from './login/login.component';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { PublicacionesComponent } from './publicaciones/publicaciones.component';
import { RegistroComponent } from './registro/registro.component';
import { Routes } from '@angular/router';



export const routes: Routes = [
  
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'mi-perfil', component: MiPerfilComponent },
  { path: 'publicaciones', component: PublicacionesComponent },
 
];
