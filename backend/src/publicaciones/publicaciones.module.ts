import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicacion, PublicacionSchema } from './publicaciones/entities/publicacion.entity';
import { PublicacionService } from './publicaciones/publicaciones.service';
import { PublicacionController } from './publicaciones/publicaciones.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Publicacion', schema: PublicacionSchema, collection: 'publicaciones' }
    ])
  ],
  controllers: [PublicacionController],
  providers: [PublicacionService]
})
export class PublicacionModule {}

