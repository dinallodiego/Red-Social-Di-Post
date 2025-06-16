import { Module } from '@nestjs/common';
import { AccesoController } from './acceso/acceso.controller';
import { AccesoService } from './acceso/acceso.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioSchema } from 'src/usuarios/entities/usuario.entity';

@Module({
  imports : [MongooseModule.forFeature([{name: "Usuario", schema: UsuarioSchema , collection: 'usuarios_di_post'}])],
  controllers: [AccesoController],
  providers: [AccesoService ,UsuariosService],
})
export class AutenticacionModule {}
