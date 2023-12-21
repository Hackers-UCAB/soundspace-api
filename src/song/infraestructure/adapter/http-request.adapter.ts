import axios, { AxiosInstance } from "axios";
import { IHttp } from "src/song/application/interfaces/http.interface";
import { Injectable } from '@nestjs/common';

@Injectable()
export class AxiosAdapter implements IHttp{

    private axios: AxiosInstance = axios

    async get(url: string) {
        try {
            const response = await this.axios.get(url,{
                responseType: 'stream',
            })
            return response
        } catch (error) {
            throw new Error(`error`)
        }
    }

}