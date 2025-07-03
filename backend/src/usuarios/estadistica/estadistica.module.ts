import { Module } from '@nestjs/common';
import { EstadisticaService } from './estadistica.service';
import { EstadisticaController } from './estadistica.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {PublicacionSchema} from '../../publicaciones/publicaciones/entities/publicacion.entity'

@Module({
  controllers: [EstadisticaController],
  imports : [MongooseModule.forFeature([{name: "Publicacion", schema: PublicacionSchema , collection: 'publicaciones_di_post'}])],
  providers: [EstadisticaService],
})
export class EstadisticaModule {}
