export type ApiResultResponse = {
     status: string
     hasError: boolean
     data: Data
     message: any
     statusCode: number
     stackTrace: any
     errorMessage: any
}

export type Data = {
     token: string
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
}

