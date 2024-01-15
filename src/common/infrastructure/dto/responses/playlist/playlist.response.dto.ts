import { ApiProperty } from "@nestjs/swagger";
import { SongInfraestructureResponseDto } from "../song/song.response.dto";


export class PlaylistInfraestructureResponseDto {
    @ApiProperty({
        example: 'c77bd9ae-08a9-4f94-bc86-4afffd0fee3f',
    })
    id: string;
    @ApiProperty({
        example: 'Pop',
    })
    name: string;
    @ApiProperty({
        example: '3:16',
    })
    duration: string;
    @ApiProperty({
        example: [
            {
                type: "Buffer",
                data: [
                    255,
                    216,
                    '...'
                ],
            },
        ],
    })
    image: Buffer;
    @ApiProperty({
        example: [
            {
                creatorId: '51fa551a-3f47-4ccb-9b88-71ed6eb5f51b',
                creatorName: 'John Doe',
            },
        ],
    })
    creators?: {
        creatorId: string;
        creatorName: string;
    }[];
    @ApiProperty({
        example: [
            {
                id: '2d7ff672-acd2-4b86-901b-6d84383c3949',
                name: 'NDA',
                duration: '3:16',
                image: [
                    {
                        type: "Buffer",
                        data: [
                            255,
                            216,
                            '...'
                        ],
                    },
                ],
                artists: [
                    {
                        id: 'a252d93d-6f8a-4594-83ca-025aae8bce90',
                        name: 'Billie Eilish',
                    },
                ],
            },
        ],
    })
    songs: SongInfraestructureResponseDto[];
}


export class PlaylistSwaggerInfraestructureResponseDto {
    @ApiProperty()
    data: PlaylistInfraestructureResponseDto
    @ApiProperty({ default: 200, description: 'Status Code' })
    statusCode: number
}
