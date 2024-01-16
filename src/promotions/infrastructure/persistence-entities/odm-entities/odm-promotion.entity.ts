import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class OdmPromotionEntity {
  @Prop({ required: true, unique: true })
  codigo_publicidad: string;

  @Prop({ required: true })
  url_publicidad: string;

  @Prop({ required: true })
  referencia_imagen: string;

}

export const PromotionSchema = SchemaFactory.createForClass(OdmPromotionEntity);
