import { Controller, Get, Post, Body, Query, Param, Patch, UploadedFile, UseInterceptors, BadRequestException, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PublicacionService } from './publicaciones.service';
import { CreatePublicacioneDto } from './dto/create-publicacion.dto';

@Controller('publicaciones')
export class PublicacionController {
  constructor(private readonly publicacionService: PublicacionService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen', {
    storage: diskStorage({
      destination: './uploads/publicaciones', 
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async create(
  @UploadedFile() imagen: Express.Multer.File,
  @Body() body: CreatePublicacioneDto,
) {
  if (!imagen) {
    throw new BadRequestException('La imagen es obligatoria');
  }

  
  let likesArray: string[] = [];
  try {
    likesArray = typeof body.likes === 'string' ? JSON.parse(body.likes) : body.likes;
  } catch (error) {
    likesArray = [];
  }

  const data = {
    ...body,
    imagen: imagen.filename,
    likes: likesArray,
  };

  return await this.publicacionService.create(data);
}


  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('sortBy') sortBy = 'fecha',
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    return await this.publicacionService.findAll(
      Number(page),
      Number(limit),
      sortBy,
      order,
    );
  }

 @Get('usuario/:usuario')
  async findByUsuario(@Param('usuario') usuario: string) {
  return this.publicacionService.findByUsuario(usuario);
}


  @Put(':id/like')
  async agregarLike(
    @Param('id') id: string,
    @Body('usuario') usuario: string,
  ) {
    return this.publicacionService.agregarLike(id, usuario);
  }

  @Put(':id/comentarios')
  async agregarComentario(
    @Param('id') id: string,
    @Body() body: { usuario: string; contenido: string }
  ) {
    return this.publicacionService.agregarComentario(id, body.usuario, body.contenido);
  }



 
}
