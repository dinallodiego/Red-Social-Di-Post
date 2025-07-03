import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PublicacionDocument = HydratedDocument<Publicacion>;

@Schema()
export class Publicacion {
  @Prop({ required: true })
  usuario: string;

  @Prop({ required: true })
  imagen: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true })
  fecha: string;

  @Prop({ required: true, type: Boolean }) 
  publicada: boolean;


  @Prop({ required: true, type: [String] })
  likes: string[];

  @Prop({ required: true })
  perfil: string;

  @Prop({
    required: true,
    type: [{
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      usuario: { type: String, required: true },
      contenido: { type: String, required: true },
      fecha: { type: String, required: true }
    }],
  })
  comentarios: {
    _id: string;
    usuario: string;
    contenido: string;
    fecha: string;
  }[];
}


export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);