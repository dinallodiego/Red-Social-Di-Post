import { IsString, IsBoolean, IsDateString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class ComentarioDto {
  @IsOptional()
  _id?: string;
  
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

  @IsString()
  perfil: string;



  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComentarioDto)
  comentarios: ComentarioDto[];
}