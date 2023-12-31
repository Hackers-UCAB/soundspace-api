import { DomainEvent } from "src/common/domain/domain-event";
import { SongId } from "../value-objects/song-id";
import { SongName } from "../value-objects/song-name";
import { SongCover } from "../value-objects/song-cover";
import { SongDuration } from "../value-objects/song-duration";
import { SongUrl } from "../value-objects/song-url";
import { SongPreviewUrl } from "../value-objects/song-preview-url";
import { SongGenres } from "../value-objects/song-genre";


export class SongCreated extends DomainEvent{

    protected constructor(
       public id: SongId,
       public name: SongName,
       public url: SongUrl,
       public cover: SongCover,
       public genres: SongGenres,
       public duration: SongDuration,
       public previewUrl: SongPreviewUrl,
    ){
        super()
    }

    static create(
        id: SongId,
        name: SongName,
        url: SongUrl,
        cover: SongCover,
        genres: SongGenres,
        duration: SongDuration,
        previewUrl: SongPreviewUrl

    ): SongCreated{
        return new SongCreated(id, name, url, cover, genres, duration, previewUrl);
    }
}
