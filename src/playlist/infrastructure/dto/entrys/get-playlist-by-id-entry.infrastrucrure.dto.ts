import { ApiProperty } from "@nestjs/swagger";

export class GetPlaylistByIdEntryInfrastructureDto {
    @ApiProperty({
        type: 'string',
        format: 'uuid',
        description: 'El uuid de la playlist a consultar',
        example: 'c77bd9ae-08a9-4f94-bc86-4afffd0fee3f',
        required: true
    })
    PlaylistId: string;
}
