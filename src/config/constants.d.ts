export const URL_BASE = 'http://localhost:3000'
export const AUTH_ENDPOINT = '/api/systemauth'
export const USER_ENDPOINT = '/api/systemauth'

export const METHOD = {
     GET: 'GET',
     POST: 'POST',
     PUT: 'PUT',
     DELETE: 'DELETE'
}

export const ACTIONS = {
     LIST: 'list',
     CREATE: 'create',
     EDIT: 'edit',
     UPDATE: 'update',
     DELETE: 'delete',
     VIEW: 'view',
     EXPORT_TO_PDF: 'exportToPdf',
     EXPORT_TO_EXCEL: 'exportToExcel',
     EXPORT_TO_WORD: 'exportToWord',
     IMPORT_FILE: 'importFile',
     PRINT: 'print',
}

export type _Body = string | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream<Uint8Array> | null | undefined;
export type _Method = keyof typeof AllowedMethods;
export type _Headers = [string, string][] | Record<string, string> | Headers

export const encryptSecretKey = 'd77b7c8c9aa0cdcccb108befd90fff4b6d200d5d5a9d82c2fb62c884f20356ab'