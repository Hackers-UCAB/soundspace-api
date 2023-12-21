//TODO: Pasarlo a generico
export interface LoggerDto {
    user: string;
    ocurredOn: Date;
    operation: string; //Es el nombre del servicio de aplicación
    data: any
}