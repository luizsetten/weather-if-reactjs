export interface IUserRegister {
  email: string;
  password?: string;
}

export interface IUser extends IUserRegister {
  id: string;
  created_at?: Date;
  role?: string;
}
