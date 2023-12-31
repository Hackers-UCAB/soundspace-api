export class GetTopPlaylistResponseInfrastructureDto{
    playlists: {
        id: string;
        //image: string;
        image: Buffer;

    }[];
}
