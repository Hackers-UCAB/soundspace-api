import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class OdmAuditingEntity {
  @Prop({ required: true, unique: true })
  auditing_id: string;

  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  uuccess: boolean;

  @Prop({ required: true })
  time: Date;

  @Prop({ required: true })
  operation: string;

  @Prop({ required: true })
  data: string;
}

export const AuditingSchema = SchemaFactory.createForClass(OdmAuditingEntity);
