import { Controller, Get, Post, Body, Patch, Param, Delete,UseInterceptors,UploadedFile } from '@nestjs/common';
import { AccesoService } from './acceso.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateUsuarioDto } from '../../usuarios/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../../usuarios/dto/update-usuario.dto';

@Controller('acceso')
export class AccesoController {
   constructor(private readonly accesoService: AccesoService) {}
  
    //Agregamos el usuario mediante el create
    @Post()
    @UseInterceptors(FileInterceptor('fotoPerfil', {
      storage: diskStorage({
        destination: './uploads/perfiles',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        }
      })
    }))
    async crearUsuario(
      @UploadedFile() fotoPerfil: Express.Multer.File,
      @Body() body: any
    ) {
      const nuevoUsuario = {
        ...body,
        fotoPerfil: fotoPerfil.filename, 
      };
      return this.accesoService.create(nuevoUsuario);
    }
    //Obtenemos todo los datos
    @Get()
    findAll() {
      return this.accesoService.findAll();
    }
    //Obtenemos por id
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.accesoService.findOne(+id);
    }
    //Modificamos lo que querramos mediante id
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
      return this.accesoService.update(+id, updateUsuarioDto);
    }
    //Borramos por id
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.accesoService.remove(+id);
    }
}
