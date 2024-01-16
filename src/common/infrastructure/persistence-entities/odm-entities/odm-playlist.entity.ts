import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";


@Schema()
export class OdmPlaylistEntity {
    @Prop({ required: true, unique: true })
    codigo_playlist: string;
  
    @Prop({ required: true })
    nombre: string;
  
    @Prop({ required: true })
    referencia_imagen: string;
  
    @Prop({ required: true })
    tipo: string;
  
    @Prop({ default: false })
    trending: boolean;
  
    @Prop({ type: [Types.ObjectId], ref: 'PlaylistSong', default: [] })
    cancionesRef: Types.ObjectId[];

    @Prop({ default: [] })
    canciones: string[];
  
    @Prop({ type: Types.ObjectId, ref: 'Genre' })
    generoRef: Types.ObjectId;

    @Prop({required: true})
    genero: string;

    //Todo: El create
}

export const PlaylistSchema = SchemaFactory.createForClass(OdmPlaylistEntity)