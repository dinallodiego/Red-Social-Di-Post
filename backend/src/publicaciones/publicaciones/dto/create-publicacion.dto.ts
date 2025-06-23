import { IsString, IsBoolean, IsDateString, IsNumber, IsArray } from 'class-validator';

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

  
  
}
