import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class OdmSongEntity extends Document {
  @Prop({ required: true, unique: true })
  codigo_cancion: string;

  @Prop({ required: true })
  nombre_cancion: string;

  @Prop({ required: true })
  duracion: number;

  // @Prop({ required: true })
  // fecha_creacion: Date;

  @Prop({ unique: true, required: true })
  referencia_cancion: string;

  @Prop({ required: true })
  referencia_preview: string;
  
  @Prop({ required: true })
  referencia_imagen: string;

  @Prop({ default: false })
  trending: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'Genre', default: [] })
  generosRef: Types.ObjectId[];
}

export const SongSchema = SchemaFactory.createForClass(OdmSongEntity);
