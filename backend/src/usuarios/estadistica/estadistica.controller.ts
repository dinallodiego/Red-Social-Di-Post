import { Controller } from '@nestjs/common';
import { EstadisticaService } from './estadistica.service';

@Controller('estadistica')
export class EstadisticaController {
  constructor(private readonly estadisticaService: EstadisticaService) {}
}
