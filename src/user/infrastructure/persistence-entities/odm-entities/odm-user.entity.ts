import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserGenderEnum } from 'src/user/domain/value-objects/enum/user-gender.enum';

@Schema()
export class OdmUserEntity extends Document {
  @Prop({ required: true, unique: true })
  codigo_usuario: string;

  @Prop({required: false})
  nombre?: string;

  @Prop({required: false})
  correo?: string;

  @Prop({required: false})
  fecha_nac?: Date;

  @Prop({required: false})
  genero?: string;

  @Prop({ default: 'GUEST' })
  rol: string;

  @Prop({ type: [String], default: [] })
  tokens: string[];

}

export const UserSchema = SchemaFactory.createForClass(OdmUserEntity);
