import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EstadisticaModule } from './estadistica/estadistica.module';

@Module({
  imports: [UsuariosModule, EstadisticaModule]
})
export class UsuariosModule {}
