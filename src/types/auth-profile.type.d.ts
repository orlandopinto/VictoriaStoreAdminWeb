export type AuthProfile = {
     isAuthenticated: boolean
     userName: string;
     email: string;
     fullName: string;
     token: string
};

//TODO: Tipo de datos temporal, se debe unificar con el tipo AuthProfile
export type apiResult = {
     token: string,
     user: {
          email: string,
          id: string,
          userName: string,
     }
}

export type InitializeAuthProfile = Partial<AuthProfile>