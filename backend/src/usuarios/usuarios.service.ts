import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(@InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>) {}

  async findAll() {
    return this.usuarioModel.find().exec();
  }

  async create(data: any) {
    const existe = await this.usuarioModel.findOne({ email: data.email });
    if (existe) throw new BadRequestException('Email ya registrado');

    const nuevoUsuario = new this.usuarioModel({ ...data, activo: true });
    return nuevoUsuario.save();
  }

  async deshabilitar(id: string) {
    return this.usuarioModel.findByIdAndUpdate(id, { activo: false }, { new: true });
  }

  async rehabilitar(id: string) {
    return this.usuarioModel.findByIdAndUpdate(id, { activo: true }, { new: true });
  }
}
