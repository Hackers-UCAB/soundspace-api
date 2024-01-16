import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class OdmGenreEntity {
    @Prop({ required: true, unique: true })
    codigo_genero: string;
  
    @Prop({ required: true })
    nombre_genero: string;
}

export const GenreSchema = SchemaFactory.createForClass(OdmGenreEntity);