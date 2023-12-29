import { AggregateRoot } from "src/common/domain/aggregate-root";
import { SongId } from "./value-objects/song-id";
import { SongName } from "./value-objects/song-name";
import { SongUrl } from "./value-objects/song-url";
import { SongCover } from "./value-objects/song-cover";
import { SongGenre } from "./value-objects/song-genre";
import { SongDuration } from "./value-objects/song-duration";
import { SongPreviewUrl } from "./value-objects/song-preview-url";
import { SongCreated } from "./events/song-created.event";
import { DomainEvent } from "src/common/domain/domain-event";
import { InvalidSongException } from "./exceptions/invalid-song.exception";

export class Song extends AggregateRoot<SongId>{

    private name: SongName;
    private url: SongUrl;
    private cover: SongCover;
    private genre: SongGenre;
    private duration: SongDuration;
    private previewUrl: SongPreviewUrl;

    get Name(): SongName{
        return this.name;
    }

    get Url(): SongUrl{
        return this.url;
    }

    get Cover(): SongCover{
        return this.cover;
    }

    get Genre(): SongGenre{
        return this.genre;
    }

    get Duration(): SongDuration{
        return this.duration;
    }

    get PreviewUrl(): SongPreviewUrl{
        return this.previewUrl;
    }

    protected constructor(
        id: SongId,
        name: SongName,
        url: SongUrl,
        cover: SongCover,
        genre: SongGenre,
        duration: SongDuration,
        previewUrl: SongPreviewUrl
    ){
        const songCreated = SongCreated.create(
            id,
            name,
            url,
            cover,
            genre,
            duration,
            previewUrl
        )
        super(id,songCreated);
        //Aqui deberia usar la funcion de pull ya que no deberia tener eventos de dominio, ya que solo es de consulta
    }

    protected when(event: DomainEvent): void{
        if (event instanceof SongCreated){
            this.name = event.name;
            this.url = event.url;
            this.cover = event.cover;
            this.genre = event.genre;
            this.duration = event.duration;
            this.previewUrl = event.previewUrl; 
        }
    }

    protected  ensureValidaState(): void {
        if (
            !this.name ||
            !this.url ||
            !this.cover ||
            !this.genre ||
            !this.duration ||
            !this.previewUrl
        ) {
            throw new InvalidSongException("Song not valid");
        }
    }

    static async create(
        id: SongId,
        name: SongName,
        url: SongUrl,
        cover: SongCover,
        genre: SongGenre,
        duration: SongDuration,
        previewUrl: SongPreviewUrl
    ):Promise<Song>{
        return new Song(id, name, url, cover, genre, duration, previewUrl);
    }
}