import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class OdmSubscriptionChanelEntity extends Document {
  @Prop({ required: true, unique: true  })
  codigo_canal: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  tipo: string;

  @Prop({ required: true })
  url: string;

}

export const SubscriptionChanelSchema = SchemaFactory.createForClass(OdmSubscriptionChanelEntity);
