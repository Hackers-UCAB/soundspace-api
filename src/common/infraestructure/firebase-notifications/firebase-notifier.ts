import { INotifier, NotifierDto, NotifierResult } from "src/common/application/notifications-handler/notifier.interface";
import * as admin from 'firebase-admin';
import { Injectable } from "@nestjs/common";
import e from "express";

@Injectable()
export class FirebaseNotifier implements INotifier{
    async notify(message: NotifierDto): Promise<void> {
        //buscar la lista de tokens del usuario que viene en message
        const tokens = [
            'fyQuTbyiSryAdRORRX3t46:APA91bGtQHEOs0j6LVyIGSXnyZ8lQVMszrjjRWIq9b6mYZxx4d18UOwrCplmkYpF76j89L_Qf_YriIdTqQz8kum9_qzcyELFGNVh-mSuYND5Wl8l6KyMD96rKv7DUplULw1docyJ7rLG', 
            'cAorixZGTn2QcoWHgscMFK:APA91bF7A5vw_JPcQ2Paa6VOPwWrnDbeNDcHUE3005H0m8gqiZ4UC020GK3KObgW9wu?teAmHL_SinqWaGQRwxCemjMPZqvS4HSWYX952-Jam096wTMyRTdY_dUUToa2d40zJbZgaTC'];

        const payload = {
            notification: {
                title: message.tittle,
                body: message.body
            },
            tokens: tokens,
        };

        let totalResult: NotifierResult;
        let result: [{
            userToken: string;
            messageSend: boolean;
        }];

        try {
            const response = await admin.messaging().sendEachForMulticast(payload);
            response.responses.forEach((resp, index) => {
                const userToken: string = tokens[index];
                let messageSend: boolean;
                if (resp.success){
                    messageSend = true;
                }
                else{
                    messageSend = false;
                }
                result.push({userToken: userToken, messageSend: messageSend});
            });
            console.log(response.successCount + ' messages were sent successfully');
        } catch (error) {
            //TODO: Arreglar esto
            result.push({userToken: 'none', messageSend: false});
            console.log(error);
        }

        totalResult.result = result;
        // return totalResult;
    }
        
}

