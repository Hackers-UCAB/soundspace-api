import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class OdmUserEntity extends Document {
  @Prop({ required: true, unique: true })
  codigo_usuario: string;

  @Prop()
  nombre?: string;

  @Prop()
  correo?: string;

  @Prop()
  fecha_nac?: Date;

  @Prop()
  genero?: string;

  @Prop({ default: 'GUEST' })
  rol: string;

  @Prop({ type: [String], default: [] })
  tokens: string[];
}

export const UserSchema = SchemaFactory.createForClass(OdmUserEntity);
