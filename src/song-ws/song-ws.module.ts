import { Module } from "@nestjs/common";
import { SongWsGateway } from "./song-ws.gateway";
import { databaseProviders } from "src/common/infraestructure/providers/config/dbconfig";


@Module({
    providers: [SongWsGateway, ...databaseProviders]
})

export class SongWsModule{}