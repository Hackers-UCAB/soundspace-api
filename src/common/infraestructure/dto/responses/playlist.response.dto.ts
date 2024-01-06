import { SongInfraestructureResponseDto } from "./song.response.dto";


export class PlaylistInfraestructureResponseDto {
    id: string;
    name: string;
    duration: string;
    image: Buffer;
    creators?: {
        creatorId: string;
        creatorName: string;
    }[];
    songs: SongInfraestructureResponseDto[];
}