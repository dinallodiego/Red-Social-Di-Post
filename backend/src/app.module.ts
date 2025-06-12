import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [PublicacionesModule, AutenticacionModule, UsuariosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
