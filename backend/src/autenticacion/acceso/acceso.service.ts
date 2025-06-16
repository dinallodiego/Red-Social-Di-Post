import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from '../../usuarios/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../../usuarios/dto/update-usuario.dto';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsuarioDocument } from '../../usuarios/entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccesoService {
 constructor(
    @InjectModel('Usuario') private usuarioModel: Model<UsuarioDocument>
  ) {}

   async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, salt);
    const nuevoUsuario = new this.usuarioModel({
      ...createUsuarioDto,
      password: hashedPassword
    });
    return nuevoUsuario.save();
  }

 async findAll(): Promise<Usuario[]> {
    return this.usuarioModel.find().exec();
  }

  async findOne(id: string): Promise<Usuario | null> {
    return this.usuarioModel.findById(id).exec();
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario | null> {
    return this.usuarioModel.findByIdAndUpdate(id, updateUsuarioDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Usuario | null> {
    return this.usuarioModel.findByIdAndDelete(id).exec();
  }

  async findByEmail(email: string): Promise<Usuario | null> {
  return this.usuarioModel.findOne({ email });
}


}
