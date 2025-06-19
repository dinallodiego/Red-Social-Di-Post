import { Module } from '@nestjs/common';
import { PublicacionService } from './publicaciones.service';
import { PublicacionController } from './publicaciones.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {PublicacionSchema} from './entities/publicacion.entity'

@Module({
  controllers: [PublicacionController],
  providers: [PublicacionService],
   imports : [MongooseModule.forFeature([{name: "Publicacion", schema: PublicacionSchema , collection: 'publicaciones_di_post'}])]
})
export class PublicacionesModule {}
