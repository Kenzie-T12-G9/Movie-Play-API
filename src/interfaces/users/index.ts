export interface IPaymentInfo {
    name: string;
    cpf: string;
    number: string;
    dueDate: string;
    code: string;  
}

export interface IUserRequest {
    name: string;
    email: string;
    password: string;
    isAdm: boolean;
    paymentId: string;
    // paymentInfo: IPaymentInfo;
}

export interface IUserLogin {
    email: string;
    password: string;
}

export interface IUserUpdate {
    name?: string;
    email?: string;
    password?: string;
    // paymentInfo?: IPaymentInfo;
}   