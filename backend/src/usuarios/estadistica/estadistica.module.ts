import { Module } from '@nestjs/common';
import { EstadisticaService } from './estadistica.service';
import { EstadisticaController } from './estadistica.controller';

@Module({
  controllers: [EstadisticaController],
  providers: [EstadisticaService],
})
export class EstadisticaModule {}
