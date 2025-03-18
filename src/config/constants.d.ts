export const URL_BASE = 'http://localhost:3000'
export const URL_BASE_API = 'http://localhost:3500'
export const AUTH_ENDPOINT = '/api/systemauth'
export const REFRESH_TOKEN_ENDPOINT = '/api/systemauth/refresh'
export const USER_ENDPOINT = '/api/systemauth'
export const SING_UP_ENDPOINT = '/api/systemauth/signup'
export const ROLES_ENDPOINT = '/api/roles'
export const ACCESS_ENDPOINT = '/api/access'
export const PAGES_ENDPOINT = '/api/pages'
export const ACTIONS_ENDPOINT = '/api/actions'
export const PERMISSION_ENDPOINT = '/api/permissions'
export const DEFAULT_USER_IMAGE = 'https://res.cloudinary.com/dtnrekavg/image/upload/v1741195879/ProductImages/lymtcvke4mmgdxhj61la.png'

export const FOLDER_TO_UPLOAD = 'ProductImages'
export const IMAGE_UPLOAD_ENDPOINT = '/api/upload'

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
     DELETE: 'delete',
     VIEW: 'view',
     EXPORT: 'export',
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
