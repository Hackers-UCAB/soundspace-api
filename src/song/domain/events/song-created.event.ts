import { DomainEvent } from "src/common/domain/domain-event";
import { SongId } from "../value-objects/song-id";
import { SongName } from "../value-objects/song-name";
import { SongCover } from "../value-objects/song-cover";
import { SongGenre } from "../value-objects/song-genre";
import { SongDuration } from "../value-objects/song-duration";
import { SongUrl } from "../value-objects/song-url";
import { SongPreviewUrl } from "../value-objects/song-preview-url";


export class SongCreated extends DomainEvent{

    protected constructor(
       public id: SongId,
       public name: SongName,
       public url: SongUrl,
       public cover: SongCover,
       public genre: SongGenre,
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
        genre: SongGenre,
        duration: SongDuration,
        previewUrl: SongPreviewUrl

    ): SongCreated{
        return new SongCreated(id, name, url, cover, genre, duration, previewUrl);
    }
}
