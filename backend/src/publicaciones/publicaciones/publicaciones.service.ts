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
  ): Promise<Publicacion[]> {
    const skip = (page - 1) * limit;
    const sortOption: any = {};
    sortOption[sortBy] = order === 'asc' ? 1 : -1;

    return this.publicacionModel
      .find()
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async agregarLike(id: string, usuario: string) {
  const publicacion = await this.publicacionModel.findById(id);

  if (!publicacion) throw new NotFoundException('Publicación no encontrada');

  if (!publicacion.likes.includes(usuario)) {
    publicacion.likes.push(usuario);
    await publicacion.save();
  }

  else if (publicacion.likes.includes(usuario)) 
    {
      publicacion.likes = publicacion.likes.filter(u => u !== usuario);
      await publicacion.save();
    }

  return publicacion;
}

}
