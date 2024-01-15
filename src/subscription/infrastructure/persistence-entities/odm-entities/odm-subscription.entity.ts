import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

enum SubscriptionStatusEnum {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELED',
}

@Schema()
export class OdmSubscriptionEntity extends Document {
  @Prop({ required: true, unique: true })
  codigo_subscripcion: string;

  @Prop({ required: true })
  fecha_creacion: Date;

  @Prop({ required: true })
  fecha_finalizacion: Date;

  @Prop({ unique: true, required: true })
  value: string;

  @Prop({ default: SubscriptionStatusEnum.ACTIVE })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'OdmUserEntity', required: true })
  usuarioRef: Types.ObjectId;

  @Prop({ required: true })
  usuario: string;

  @Prop({ type: Types.ObjectId, ref: 'OdmSubscriptionChanelEntity', required: true })
  canalRef: Types.ObjectId;

  @Prop({ required: true })
  canal: string;
  //TODO: El create, recibe un repo para buscar
  // static async create
}

export const SubscriptionSchema = SchemaFactory.createForClass(
  OdmSubscriptionEntity,
);
