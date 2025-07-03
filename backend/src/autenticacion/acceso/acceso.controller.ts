import {Controller,Get,Post,Body,Patch,Param,Delete,UseInterceptors,UploadedFile,} from '@nestjs/common';
import { AccesoService } from './acceso.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateUsuarioDto } from '../../usuarios/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../../usuarios/dto/update-usuario.dto';
import * as bcrypt from 'bcrypt'; 
import { sign } from 'jsonwebtoken';
import { verify } from 'jsonwebtoken';




@Controller('acceso')
export class AccesoController {

  
  constructor(private readonly accesoService: AccesoService ) {}

  
  //Agregamos el usuario mediante el create
  @Post()
  @UseInterceptors(
    FileInterceptor('fotoPerfil', {
      storage: diskStorage({
        destination: './uploads/perfiles',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async crearUsuario(
    @UploadedFile() fotoPerfil: Express.Multer.File,
    @Body() body: any,
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
    return this.accesoService.findOne(id);
  }
  //modificamos por id
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.accesoService.update(id, updateUsuarioDto);
  }
  //borramos por id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accesoService.remove(id);
  }
  //ruta login
  @Post('login')
  async login(@Body() body: any) {
  const { email, password } = body;

  
  const usuario = await this.accesoService.findByEmail(email); 

  if (!usuario) {
    return { mensaje: 'Usuario no encontrado', status: 404 };
  }

 
  const coincide = await bcrypt.compare(password, usuario.password);

  if (!coincide) {
    return { mensaje: 'Contraseña incorrecta', status: 401 };
  }

  const payload = {
      id: usuario._id,
      email: usuario.email,
      nombre: usuario.nombre,
      usuario: usuario.usuario,
      fotoPerfil: usuario.fotoPerfil,
      descripcion: usuario.descripcion,
      perfil: usuario.perfil   
};
  const token = sign(payload, "clave-ultra-secreta", {
    expiresIn: '900s' 
  });

  
  const { password: _, ...usuarioSinPassword } = (usuario as any).toObject();
  return {
    mensaje: 'Login exitoso',
    usuario: usuarioSinPassword,
    token
  };
}



@Post('renovar-token')
async renovarToken(@Body() body: any) {
  const { token } = body;

  try {
    const payload: any = verify(token, 'clave-ultra-secreta');

    const usuario = await this.accesoService.findByEmail(payload.email);
    if (!usuario) {
      return { mensaje: 'Usuario no encontrado', status: 404 };
    }

    const nuevoPayload = {
      id: usuario._id,
      email: usuario.email,
      nombre: usuario.nombre,
      usuario: usuario.usuario,
      fotoPerfil: usuario.fotoPerfil,
      descripcion: usuario.descripcion,
      perfil: usuario.perfil
    };

    const nuevoToken = sign(nuevoPayload, 'clave-ultra-secreta', {
      expiresIn: '600s', 
    });

    return { mensaje: 'Sesión extendida', token: nuevoToken };
  } catch (err) {
    return { mensaje: 'Token inválido o expirado', status: 401 };
  }
}

}
