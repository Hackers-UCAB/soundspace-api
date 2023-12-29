import { UserId } from "src/user/domain/value-objects/user-id";

export interface NotifierDto {
    userId: UserId;
    tittle: string;
    body: string;   
    //no mandes este atributo en null, si no lo usas no lo coloques porque firebase se vuelve shit
    data?: {
        'action': string; //puede ser: 'navigateTo', 'changeUserRole', 'none'
        'navigateToRoute': string; //puede ser: '/home', '/artist/:id', '/album/:id', '/playlist/:id', 'none' 
    }
}