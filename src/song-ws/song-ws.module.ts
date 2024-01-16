import { Module } from "@nestjs/common";
import { SongWsGateway } from "./song-ws.gateway";
import { ormDatabaseProviders } from "src/common/infrastructure/providers/config/dbconfig";


@Module({
    providers: [SongWsGateway, ...ormDatabaseProviders]
})

export class SongWsModule{}