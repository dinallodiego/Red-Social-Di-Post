import { Module } from '@nestjs/common';
import { ComentariosModule } from './comentarios/comentarios.module';

@Module({
  imports: [PublicacionesModule, ComentariosModule]
})
export class PublicacionesModule {}
