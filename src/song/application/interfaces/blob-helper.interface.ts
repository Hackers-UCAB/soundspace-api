
export interface IBlobHelper {
    getBlobClient(fileName: string, container: string): Promise<any>
    getFile(fileName: string, container: string, startPointInSeconds: number, duration: number): Promise<any>
}