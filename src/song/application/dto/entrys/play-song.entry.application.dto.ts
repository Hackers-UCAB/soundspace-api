import { ServiceEntry } from "src/common/application/services/dto/entry/service-entry.dto"

export class PlaySongEntryApplicationDto implements ServiceEntry {
    userId: string   
    preview?: boolean
    songId: string
    second?: number
    streaming?: boolean
}