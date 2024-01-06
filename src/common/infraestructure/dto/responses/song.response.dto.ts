

export class SongInfraestructureResponseDto {
    id: string;
    name: string;
    duration: string;
    image: Buffer;
    artists: {
        id: string;
        name: string;
    }[]
}