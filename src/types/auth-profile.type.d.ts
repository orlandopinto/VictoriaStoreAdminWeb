export type AuthProfile = {
     token: string,
     user: {
          id: string,
          email: string,
          password: string,
          address?: String,
          firstName?: string,
          lastName?: string,
          phoneNumber?: string,
          imageProfilePath?: string,
          city?: string,
          zipcode?: Number,
          lockoutEnabled?: Boolean,
          accessFailedCount?: Number,
          birthDate?: Date,
          roles?: [String],
          permissions?: UserPermissions[]
     }
};

export type InitializeAuthProfile = Partial<AuthProfile>