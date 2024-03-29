import { SongInfrastructureResponseDto } from "src/common/infrastructure/dto/response/song/song.response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class ArtistByIdInfrastructureResponseDto {

    @ApiProperty({
        example: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
    })
    id: string;

    @ApiProperty({
        example: 'Harry Styles',
    })
    name: string;

    @ApiProperty({
        example: 'Música pop',
    })
    genre: string;

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
                id: '2d7ff672-acd2-4b86-901b-6d84383c3949',
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
        ],
    })
    albums: {
        id: string;
        image: Buffer;
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
                        name: 'Imagine Dragons',
                    },
                ],
            },
        ],
    })
    songs: SongInfrastructureResponseDto[];

}

export class ArtistByIdSwaggerInfrastructureResponseDto {
    @ApiProperty()
    data: ArtistByIdInfrastructureResponseDto
    @ApiProperty({ default: 200, description: 'Status Code' })
    statusCode: number
}