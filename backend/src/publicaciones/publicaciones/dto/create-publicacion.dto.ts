import { IsString, IsBoolean, IsDateString, IsNumber } from 'class-validator';

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

  @IsNumber()
  likes: number;
  
  
}
