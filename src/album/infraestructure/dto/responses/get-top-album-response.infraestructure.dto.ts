export class GetTopAlbumResponseInfrastructureDto {
  albums: {
    id: string;
    image: Buffer;
  }[];
}
