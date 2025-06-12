import { Module } from '@nestjs/common';
import { AccesoController } from './acceso/acceso.controller';
import { AccesoService } from './acceso/acceso.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Module({
  imports: [],
  controllers: [AccesoController],
  providers: [AccesoService ,UsuariosService],
})
export class AutenticacionModule {}
