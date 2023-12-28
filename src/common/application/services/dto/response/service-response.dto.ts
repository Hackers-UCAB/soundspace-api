
// export abstract class ServiceResponse {
//     private readonly userId: string;

//     get Id(): string {
//         return this.userId;
//     }

//     constructor(userId: string) {
//         this.userId = userId;
//     }
// }

export interface ServiceResponse {
    userId: string;
}