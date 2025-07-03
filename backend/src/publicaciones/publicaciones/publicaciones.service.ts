import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publicacion, PublicacionDocument } from './entities/publicacion.entity';
import { CreatePublicacioneDto } from './dto/create-publicacion.dto';

@Injectable()
export class PublicacionService {
  constructor(
    @InjectModel('Publicacion')
    private readonly publicacionModel: Model<PublicacionDocument>,
  ) {}

  async create(data: CreatePublicacioneDto): Promise<Publicacion> {
    const nuevaPublicacion = new this.publicacionModel(data);
    return await nuevaPublicacion.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    sortBy = 'fecha',
    order: 'asc' | 'desc' = 'desc',
    perfil: string = ''
  ): Promise<{ total: number, publicaciones: Publicacion[] }> {
    const skip = (page - 1) * limit;
    const sortOption: any = {};
    sortOption[sortBy] = order === 'asc' ? 1 : -1;

    let filter = {};

    if (perfil === 'admin') {
      filter = {};
    } else {
      filter = { publicada: true };
    }

    const total = await this.publicacionModel.countDocuments(filter);

    const publicaciones = await this.publicacionModel
      .find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .exec();

    return { total, publicaciones };
  }

  async findByUsuario(usuario: string): Promise<Publicacion[]> {
    const publicaciones = await this.publicacionModel
      .find({ usuario, publicada: true })
      .sort({ fecha: -1 })
      .exec();
    return publicaciones;
  }

  async agregarLike(id: string, usuario: string) {
    const publicacion = await this.publicacionModel.findById(id);

    if (!publicacion) throw new NotFoundException('Publicación no encontrada');

    if (!publicacion.likes.includes(usuario)) {
      publicacion.likes.push(usuario);
      await publicacion.save();
    } else if (publicacion.likes.includes(usuario)) {
      publicacion.likes = publicacion.likes.filter(u => u !== usuario);
      await publicacion.save();
    }

    return publicacion;
  }

  async agregarComentario(_id: string, usuario: string, contenido: string) {
    const publicacion = await this.publicacionModel.findById(_id);
    if (!publicacion) throw new NotFoundException('Publicación no encontrada');

    const nuevoComentario = {
      _id,
      usuario,
      contenido,
      fecha: new Date().toISOString()
    };

    publicacion.comentarios.push(nuevoComentario);
    await publicacion.save();

    return publicacion;
  }

  async deshabilitar(id: string) {
    return this.publicacionModel.findByIdAndUpdate(id, { publicada: false }, { new: true });
  }

  async rehabilitar(id: string) {
    return this.publicacionModel.findByIdAndUpdate(id, { publicada: true }, { new: true });
  }

  
  async editarComentario(
    publicacionId: string,
    comentarioId: string,
    usuario: string,
    nuevoContenido: string,
    perfil: string
  ) {
    const publicacion = await this.publicacionModel.findById(publicacionId);
    if (!publicacion) throw new NotFoundException('Publicación no encontrada');

    const comentario = publicacion.comentarios.find(c => c._id.toString() === comentarioId);
    if (!comentario) throw new NotFoundException('Comentario no encontrado');

    if (perfil !== 'admin' && comentario.usuario !== usuario) {
      throw new NotFoundException('No autorizado para editar este comentario');
    }

    comentario.contenido = nuevoContenido;
    comentario.fecha = new Date().toISOString();

    await publicacion.save();

    return publicacion;
  }
}
