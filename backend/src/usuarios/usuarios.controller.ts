import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Post()
  create(@Body() nuevoUsuarioDto: any) {
    return this.usuariosService.create(nuevoUsuarioDto);
  }

  @Delete(':id')
  deshabilitar(@Param('id') id: string) {
    return this.usuariosService.deshabilitar(id);
  }

  @Post('rehabilitar/:id')
  rehabilitar(@Param('id') id: string) {
    return this.usuariosService.rehabilitar(id);
  }
}
