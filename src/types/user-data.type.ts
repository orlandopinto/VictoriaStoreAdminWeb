export type UserDataToken = {
     accessToken: string
     refreshToken: string
     userData: UserData
}

export type UserData = {
     _id: string
     email: string
     password: string
     firstName: any
     lastName: any
     phoneNumber: any
     public_id: any
     secure_url: any
     city: any
     zipcode: any
     lockoutEnabled: any
     accessFailedCount: number
     address: any
     birthDate: any
     roles: string[]
     createdAt: string
     updatedAt: string
     isActive: boolean
}

export type RegisterUser = {
     email: string
     password: string
     firstName: string
     lastName: string
     phoneNumber: string
     public_id: string
     secure_url: string
     city: string | null
     zipcode: number | null
     lockoutEnabled: boolean
     accessFailedCount: number
     address: string | null
     birthDate: Date | null
     roles: string[] | []
     isActive: boolean
}

export type UpdateUser = {
     id: string;
     address?: string;
     firstName?: string;
     lastName?: string;
     phoneNumber?: string;
     public_id?: string;
     secure_url?: string;
     city?: string;
     zipcode?: number;
     lockoutEnabled?: boolean;
     accessFailedCount?: number;
     birthDate?: Date;
     roles?: string[];
     isActive?: boolean
}

export type ChangePassword = {
     email: string;
     newPassword: string;
}