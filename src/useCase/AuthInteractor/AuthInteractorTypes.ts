export interface SignInRequest {
  userName: string;
  password: string;
}

export type SignInDTO = {
  status: number;
  message: string;
  token?: string;
  userId?: string;
};

export type VerifyDTO = {
  status: number;
  message: string;
  isVerified: boolean;
};

export interface AuthInteractorInterface {
  signIn: () => Promise<SignInDTO>;
  verify: () => VerifyDTO;
}
