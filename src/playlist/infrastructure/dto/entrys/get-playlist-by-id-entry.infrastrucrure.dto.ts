import { IsUUID } from "class-validator";

export class GetPlaylistByIdEntryInfrastructureDto {
    //@IsUUID()
    PlaylistId: string;
}
