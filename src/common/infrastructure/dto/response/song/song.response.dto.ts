import { ApiProperty } from "@nestjs/swagger";


export class SongInfrastructureResponseDto {
    @ApiProperty({
        example: '2d7ff672-acd2-4b86-901b-6d84383c3949',
    })
    id: string;
    @ApiProperty({
        example: 'NDA',
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
                id: 'a252d93d-6f8a-4594-83ca-025aae8bce90',
                name: 'Billie Eilish',
            },
        ],
    })
    artists: {
        id: string;
        name: string;
    }[]
}

export class SongSwaggerInfrastructureResponseDto {
    @ApiProperty()
    data: SongInfrastructureResponseDto
    @ApiProperty({ default: 200, description: 'Status Code' })
    statusCode: number
}
