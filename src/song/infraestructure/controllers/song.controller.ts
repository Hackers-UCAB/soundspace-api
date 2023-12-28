import { Controller, Get, Inject, Param, Res, Headers, StreamableFile, Body } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { DataSource } from 'typeorm';
import axios from 'axios';
import { AzureBlobHelper } from '../helpers/get-blob-file.helper';
import { Readable } from 'stream';



@Controller('song')
export class SongController {

    constructor(
        @Inject('DataSource')
        private readonly dataSource: DataSource,
    ){

    }
    
  //   @Get()
  // async getFile(@Res({passthrough: true}) res: Response) {

  //   // const {data} = await axios.get('https://songsv1.blob.core.windows.net/foto/arianagrande_myeverything.jpg?sp=r&st=2023-12-28T02:04:58Z&se=2023-12-28T10:04:58Z&sv=2022-11-02&sr=b&sig=QUBqAECBBVxR7D4F60BiZqwjM9IlCTDmWU9LTHqKdoc%3D',{
  //   //     responseType: 'stream'
  //   // })
  //   const helper = new AzureBlobHelper();
  //   const client = await helper.getBlobClient('arianagrande_myeverything.jpg', 'foto')
  //   const stream = await client.download();
  //   const streamable = new Readable(client)
  //   return new StreamableFile(streamable);
  // }
}
