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

export interface AuthControllerInterface {
	signIn: () => Promise<SignInDTO>;
}
