import * as admin from 'firebase-admin';
import { Inject, Injectable } from "@nestjs/common";
import { UserRepository } from "src/user/infraestructure/repositories/user.repository";
import { NotifierDto } from 'src/common/application/notifications-handler/dto/entry/notifier-entry.dto';
import { NotifierResponse } from 'src/common/application/notifications-handler/dto/response/notifier-response.dto';
import { INotifier } from 'src/common/application/notifications-handler/notifier.interface';
import { Result } from 'src/common/application/result-handler/result';

@Injectable()
export class FirebaseNotifier implements INotifier{

    constructor(
        @Inject('UserRepository')
        private readonly userRepository: UserRepository
    ){}

    async notify(message: NotifierDto): Promise<Result<NotifierResponse>> {
        const user = await this.userRepository.findUserEntityById(message.userId.Id);

        if(!user){
            return;
        }

        const tokens: string[] = user.tokens;

        const payload = {
            notification: {
                title: message.tittle,
                body: message.body,
                data: message.data,
            },
            tokens: tokens,
        };
        
        let fail:boolean = false;
        let notifierData: NotifierResponse;
        let error: Error;

        let successfulTokens: string[] = [];
        let unsuccessfulTokens: string[] = [];

        try {
            const response = await admin.messaging().sendEachForMulticast(payload);
            
            response.responses.forEach((resp, idx) => {
                if (resp.success) {
                    successfulTokens.push(tokens[idx]);
                } else {
                    unsuccessfulTokens.push(tokens[idx]);
                    fail = true;
                }
            });

            console.log(response.successCount + ' messages were sent successfully'); //TODO: Tambien podria ir en la response honestly   
        } catch (error) {
            fail = true;
            error = error;
        }

        if (fail) {
            return Result.fail<NotifierResponse>(
                null,
                500,
                'Ha ocurrido un error inesperado enviando la notificacion, hable con el administrador',
                new Error(error?.message || 'Ha ocurrido un error inesperado enviando la notificacion, hable con el administrador')
            );
        }
        else {
            return Result.success<NotifierResponse>(
                {
                    userId: user.codigo_usuario,
                    payload: JSON.stringify(payload),
                    successfulTokens: successfulTokens,
                    unsuccessfulTokens: unsuccessfulTokens,
                },
                200
            );
        }
    }
}