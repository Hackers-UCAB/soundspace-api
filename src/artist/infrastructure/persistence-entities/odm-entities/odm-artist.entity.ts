import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class OdmArtistEntity {
  @Prop({ required: true, unique: true })
  codigo_artista: string;

  @Prop({ required: true })
  nombre_artista: string;

  @Prop({ required: true })
  referencia_imagen: string;

  @Prop({ default: false })
  trending: boolean;

  @Prop({default: [] })
  canciones: string[];

  @Prop({ default: [] })
  albums: string[];

  @Prop({ type: Types.ObjectId, ref: 'Genre' })
  generoRef: Types.ObjectId;

  // @Prop({required: true})
  // genero: string;
}

export const ArtistSchema = SchemaFactory.createForClass(OdmArtistEntity);
