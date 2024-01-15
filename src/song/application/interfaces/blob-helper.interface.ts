
export interface IGetSongHelper {
    getFile(fileName: string, container: string, startPointInSeconds: number): Promise<any>
}