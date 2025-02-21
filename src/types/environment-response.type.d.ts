export type ApiResultResponse = {
     status: string;
     hasError: boolean;
     data?: any;
     message?: string;
     statusCode: number;
     stackTrace?: string;
}
