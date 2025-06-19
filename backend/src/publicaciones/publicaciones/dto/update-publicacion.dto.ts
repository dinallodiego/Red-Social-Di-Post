import { PartialType } from '@nestjs/mapped-types';
import { CreatePublicacioneDto } from './create-publicacion.dto';

export class UpdatePublicacioneDto extends PartialType(CreatePublicacioneDto) {}
