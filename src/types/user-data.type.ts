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
     imageProfilePath: any
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
     imageProfilePath: string
     city: string | null
     zipcode: number | null
     lockoutEnabled: boolean
     accessFailedCount: number
     address: string | null
     birthDate: Date | null
     roles: string[] | []
     isActive: boolean
}