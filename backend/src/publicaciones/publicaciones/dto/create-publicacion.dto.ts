import { IsString, IsBoolean, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ComentarioDto {
  @IsString()
  usuario: string;

  @IsString()
  contenido: string;

  @IsDateString()
  fecha: string;
}

export class CreatePublicacioneDto {
  @IsString()
  usuario: string;

  @IsString()
  imagen?: string;

  @IsString()
  descripcion: string;

  @IsDateString()
  fecha: string;

  @IsBoolean()
  publicada: boolean;

  @IsArray()
  @IsString({ each: true })
  likes: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComentarioDto)
  comentarios: ComentarioDto[];
}
