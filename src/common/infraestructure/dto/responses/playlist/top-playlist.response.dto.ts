import { ApiProperty } from "@nestjs/swagger";

export class TopPlaylistInfraestructureResponseDto {
    @ApiProperty({
        example: [
            {
                id: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
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
            },
            {
                id: '2d1dd015-5d32-4299-8428-7acbd512a25b',
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
            },
            {
                id: 'c77bd9ae-08a9-4f94-bc86-4afffd0fee3f',
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
            }
        ]
    })
    playlists: {
        id: string;
        image: Buffer;
    }[];
}

export class TopPlaylistSwaggerInfraestructureResponseDto {
    @ApiProperty()
    data: TopPlaylistInfraestructureResponseDto
    @ApiProperty({ default: 200, description: 'Status Code' })
    statusCode: number
}
