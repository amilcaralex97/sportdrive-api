export interface IUser {
  userName: string;
  name: string;
  password: string;
  roleId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateUserRequest = {
  userName?: string;
  name?: string;
  password?: string;
  roleId?: string;
  userId?: string;
};

export type UserDTO = {
  status: number;
  message: string;
  roles?: IUser[];
  role?: IUser;
  userId?: string;
  updatedAt?: string;
  createdAt?: string;
};

export interface IUserController {
  fetchUsers: () => Promise<UserDTO>;
  fetchUser: () => Promise<UserDTO>;
  fetchUserByUsername: () => Promise<UserDTO>;
  createUser: () => Promise<UserDTO>;
  updateUser: () => Promise<UserDTO>;
}
