import { AlbumId } from "src/album/domain/value-objects/album-id";
import { Artist } from "src/artist/domain/artist";
import { IArtistRepository } from "src/artist/domain/repositories/artist.repository.interface";
import { ArtistId } from "src/artist/domain/value-objects/artist-id";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Result } from "src/common/domain/result-handler/result";
import { SongId } from "src/song/domain/value-objects/song-id";
import { OdmArtistEntity } from "../../persistence-entities/odm-entities/odm-artist.entity";


export class OdmArtistRepository implements IArtistRepository{
    private readonly odmArtistMapper: IMapper<Artist, OdmArtistEntity>;

    constructor(
        odmArtistMapper: IMapper<Artist, OdmArtistEntity>,
    ){
        this.odmArtistMapper = odmArtistMapper;
    }
    findArtistById(artistId: ArtistId): Promise<Result<Artist>> {
        throw new Error("Method not implemented.");
    }
    findArtistsBySongId(songId: SongId): Promise<Result<Artist[]>> {
        throw new Error("Method not implemented.");
    }
    findArtistsByAlbumId(albumId: AlbumId): Promise<Result<Artist[]>> {
        throw new Error("Method not implemented.");
    }
    findTrendingArtists(): Promise<Result<Artist[]>> {
        throw new Error("Method not implemented.");
    }
    findArtistsByName(name: string, limit?: number, offset?: number): Promise<Result<Artist[]>> {
        throw new Error("Method not implemented.");
    }
    
}