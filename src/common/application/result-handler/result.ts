
export class Result<T>{
    //Este es el como seran las respuestas de las peticiones

    public readonly data: T;
    public readonly statusCode: number;
    public readonly message?: string;
    public readonly error?: Error;

    private constructor(data: T, statusCode: number, message?: string, error?: Error) {
        this.data = data;
        this.statusCode = statusCode;
        this.message = message || 'Unkonw error, talk to an admin';
        this.error = error;
    }

    get Data(): T {
        return this.data;
    }

    get Error(): Error {
        return this.error;
    }

    get StatusCode(): number {
        return this.statusCode;
    }

    get IsSuccess(): boolean {
        return !this.error;
    }

    //creamos uno en success 
    static success<T>(data: T, statusCode: number): Result<T> {
        return new Result<T>(data, statusCode);
    }
   
    static fail<T>(data: T, statusCode: number, message: string, error: Error): Result<T> {
        return new Result<T>(null, statusCode, message, error);
    }
}