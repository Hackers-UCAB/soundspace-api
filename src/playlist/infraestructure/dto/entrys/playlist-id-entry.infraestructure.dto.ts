import { Length } from 'class-validator';

export class PlaylistIdEntryInfraestructureDto {

    @Length(36)
    id: string;
}
