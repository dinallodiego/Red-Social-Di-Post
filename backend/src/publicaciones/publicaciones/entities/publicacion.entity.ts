import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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

  @Prop({ required: true })
  publicada: string;

  @Prop({ required: true, type: [String] })
  likes: string[];

  @Prop({
    required: true,
    type: [{
      usuario: { type: String, required: true },
      contenido: { type: String, required: true },
      fecha: { type: String, required: true }
    }]
  })
  comentarios: {
    usuario: string;
    contenido: string;
    fecha: string;
  }[];
}


export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);
