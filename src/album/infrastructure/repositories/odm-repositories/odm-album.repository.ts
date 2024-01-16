import { Model } from "mongoose";
import { Album } from "src/album/domain/album";
import { IAlbumRepository } from "src/album/domain/repositories/album.repository.interface";
import { AlbumId } from "src/album/domain/value-objects/album-id";
import { ArtistId } from "src/artist/domain/value-objects/artist-id";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Result } from "src/common/domain/result-handler/result";
import { OdmPlaylistEntity } from "src/common/infrastructure/persistence-entities/odm-entities/odm-playlist.entity";


export class OdmAlbumRepository implements IAlbumRepository{
    private readonly odmAlbumMapper: IMapper<Album, OdmPlaylistEntity>;
    private readonly albumModel: Model<OdmPlaylistEntity>;
    constructor(odmAlbumMapper: IMapper<Album, OdmPlaylistEntity>, albumModel: Model<OdmPlaylistEntity>) {
        this.albumModel = albumModel;
        this.odmAlbumMapper = odmAlbumMapper;
    }
    findAlbumById(albumId: AlbumId): Promise<Result<Album>> {
        throw new Error("Method not implemented.");
    }
    findTopAlbum(): Promise<Result<Album[]>> {
        throw new Error("Method not implemented.");
    }
    findAlbumsByArtist(artistId: ArtistId): Promise<Result<Album[]>> {
        throw new Error("Method not implemented.");
    }
    findAlbumsByName(name: string, limit?: number, offset?: number): Promise<Result<Album[]>> {
        throw new Error("Method not implemented.");
    }
    
}