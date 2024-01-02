
export class GetTopSongsResponseInfrastructureDto {
    songs: {
        songId: string;
        name: string;
        image: Buffer;
        duration: string;
        artists: {
            id: string;
            name: string;
        }[];
    }[];
}
