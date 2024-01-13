export class TrendingArtistsInfraestructureResponseDto {
    artists: {
        id: string;
        name: string;
        image: Buffer;
    }[];
}