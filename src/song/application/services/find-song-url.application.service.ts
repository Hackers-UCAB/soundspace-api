import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { Result } from 'src/common/application/result-handler/result';
import { ISongRepository } from 'src/song/domain/repositories/song.repository.interface';
import { IHttp } from '../interfaces/http.interface';
import { StreamableFile } from '@nestjs/common';

export class FindSongUrlService implements IApplicationService<string , StreamableFile>{

    private readonly songRepository: ISongRepository;
    private readonly httpRequest: IHttp;
    constructor(songRepository: ISongRepository, httpRequest: IHttp) {
        this.songRepository = songRepository;
        this.httpRequest = httpRequest;
    }

    // TODO: Esto es una primera iteracion de la solucion, estoy devolviendo la cancion en formato de stream. Falta agregar el try catch por si hay error
    async execute(param: string): Promise<Result<StreamableFile>> {
        
        const url = await this.songRepository.findSongUrlById(param);
        const {data} = await this.httpRequest.get(url.Data.Path);
        return Result.success(new StreamableFile(data),200);
    }
}