export const URL_BASE = 'http://localhost:3000'

//SYSTEM AUTHORIZATION
export const SING_IN_ENDPOINT = '/api/system-auth/signin'
export const REFRESH_TOKEN_ENDPOINT = '/api/system-auth/refresh'
export const CHANGE_PASSWORD_ENDPOINT = '/api/system-auth/change-password'

// SYSTEM USERS
export const USER_ENDPOINT = '/api/system-users'
export const UPDATE_USER_ENDPOINT = '/api/system-users/:id'
export const DELETE_USER_ENDPOINT = '/api/system-users'

//ADMIN
export const ROLES_ENDPOINT = '/api/roles'
export const ACCESS_ENDPOINT = '/api/access'
export const PAGES_ENDPOINT = '/api/pages'
export const ACTIONS_ENDPOINT = '/api/actions'
export const PERMISSION_ENDPOINT = '/api/permissions'
export const CATEGORY_ENDPOINT = '/api/category'
export const SUB_CATEGORY_ENDPOINT = '/api/sub-category'

// PRODUCTS
export const ATTRIBUTES_ENDPOINT = '/api/attributes'
export const DISCOUNTS_ENDPOINT = '/api/discounts'
export const WISHLIST_ENDPOINT = '/api/wishlist'
export const SHIPPING_ADDRESS_ENDPOINT = '/api/shipping-address'
export const PRODUCT_IMAGES_ENDPOINT = '/api/product-images'
export const PRODUCT_VIDEOS_ENDPOINT = '/api/product-videos'
export const PRODUCTS_ENDPOINT = '/api/products'
export const REVIEWS_ENDPOINT = '/api/reviews'
export const VARIANTS_ENDPOINT = '/api/variants'
export const TAXES_ENDPOINT = '/api/taxes'

//IMAGES
export const PROFILE_FOLDER_TO_UPLOAD = 'ProfileImages'
export const CATEGORY_FOLDER_TO_UPLOAD = 'CategoryImages'
export const IMAGE_UPLOAD_ENDPOINT = '/api/upload'

const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME
export const DEFAULT_USER_IMAGE = `https://res.cloudinary.com/${CLOUDINARY_NAME}/image/upload/v1741195879/${PROFILE_FOLDER_TO_UPLOAD}/lymtcvke4mmgdxhj61la.png`

// OTHERS
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
