import { LoadingComponent } from './loading/loading.component';
import { LoginComponent } from './login/login.component';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { PublicacionesComponent } from './publicaciones/publicaciones.component';
import { RegistroComponent } from './registro/registro.component';
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { adminGuard } from './guards/admin.guard';
import { UsuariosComponent } from './dashboard/usuarios/usuarios.component';
import { EstadisticasComponent } from './dashboard/estadisticas/estadisticas.component';



export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'mi-perfil', component: MiPerfilComponent, canActivate: [authGuard] },
  { path: '', component: LoadingComponent },
  { path: 'loading', component: LoadingComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
      { path: 'usuarios', component: UsuariosComponent, canActivate: [adminGuard] },
      { path: 'estadisticas', component: EstadisticasComponent, canActivate: [adminGuard] },
    ]
  },
  { path: 'publicaciones', component: PublicacionesComponent, canActivate: [authGuard] }
];
