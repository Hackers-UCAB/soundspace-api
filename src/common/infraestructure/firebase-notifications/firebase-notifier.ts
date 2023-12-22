import { INotifier, NotifierDto, NotifierResult } from "src/common/application/notifications-handler/notifier.interface";
import * as admin from 'firebase-admin';
import { Inject, Injectable } from "@nestjs/common";
import { UserRepository } from "src/user/infraestructure/repositories/user.repository";

@Injectable()
export class FirebaseNotifier implements INotifier{
    constructor(
        @Inject('UserRepository')
        private readonly userRepository: UserRepository
    ){}
    async notify(message: NotifierDto): Promise<void> {
        const user = await this.userRepository.findUserEntityById(message.userId.Id);

        if(!user){
            return;
        }
        const tokens: string[] = user.tokens;
        //buscar la lista de tokens del usuario que viene en message
        // const tokens = [
        //     'fyQuTbyiSryAdRORRX3t46:APA91bGtQHEOs0j6LVyIGSXnyZ8lQVMszrjjRWIq9b6mYZxx4d18UOwrCplmkYpF76j89L_Qf_YriIdTqQz8kum9_qzcyELFGNVh-mSuYND5Wl8l6KyMD96rKv7DUplULw1docyJ7rLG', 
        //     'cAorixZGTn2QcoWHgscMFK:APA91bF7A5vw_JPcQ2Paa6VOPwWrnDbeNDcHUE3005H0m8gqiZ4UC020GK3KObgW9wu?teAmHL_SinqWaGQRwxCemjMPZqvS4HSWYX952-Jam096wTMyRTdY_dUUToa2d40zJbZgaTC'];

        const payload = {
            notification: {
                title: message.tittle,
                body: message.body
            },
            tokens: tokens,
        };
        //TODO: Mejorar esto
        try {
            const response = await admin.messaging().sendEachForMulticast(payload);
            console.log(response.successCount + ' messages were sent successfully');
        } catch (error) {
            console.log(error);
        }

    }
        
}

