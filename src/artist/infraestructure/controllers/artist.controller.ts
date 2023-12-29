import { Controller, Inject, Get, Param } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { HttpResponseHandler } from '../../../common/infraestructure/http-response-handler/http-response.handler';
import { Result } from '../../../common/application/result-handler/result';
import { GetArtistByIdEntryApplicationDto } from 'src/artist/application/dto/entry/get-artist-by-id-entry.application.dto';
import { GetArtistByIdResponseApplicationDto } from 'src/artist/application/dto/response/get-artist-by-id-response.application.dto';

//Falta implementar...