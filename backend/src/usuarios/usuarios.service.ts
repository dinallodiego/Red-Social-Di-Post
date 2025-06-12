import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  private usuarios: Usuario[] = [];
  private idCounter = 1;

  create(createUsuarioDto: CreateUsuarioDto): Usuario {
    const nuevoUsuario: Usuario = {
      id: this.idCounter++,
      ...createUsuarioDto,
    };
    this.usuarios.push(nuevoUsuario);
    return nuevoUsuario;
  }

  findAll(): Usuario[] {
    return this.usuarios;
  }

  findOne(id: number): Usuario | undefined {
    return this.usuarios.find(usuario => usuario.id === id);
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto): Usuario | null {
    const index = this.usuarios.findIndex(usuario => usuario.id === id);
    if (index === -1) return null;

    this.usuarios[index] = {
      ...this.usuarios[index],
      ...updateUsuarioDto,
    };

    return this.usuarios[index];
  }

  remove(id: number): Usuario | null {
    const index = this.usuarios.findIndex(usuario => usuario.id === id);
    if (index === -1) return null;
    const [eliminado] = this.usuarios.splice(index, 1);
    return eliminado;
  }
}
