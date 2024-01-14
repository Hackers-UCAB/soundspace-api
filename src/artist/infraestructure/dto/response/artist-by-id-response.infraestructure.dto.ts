import { SongInfraestructureResponseDto } from "src/common/infraestructure/dto/responses/song.response.dto";

export class ArtistByIdInfraestructureResponseDto {
    id: string;
    name: string;
    genre: string;
    image: Buffer;
    albums: {
        id: string;
        image: Buffer;
    }[];
    songs: SongInfraestructureResponseDto[];
}