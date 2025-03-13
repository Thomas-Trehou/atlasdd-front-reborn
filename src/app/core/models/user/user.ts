import {BaseDto} from '../base';

interface UserDto extends BaseDto {

  pseudo: string;
  slug: string;
  email: string;
  password: string;
  token: string;
}

export type UserCreateRequest = Omit<UserDto, 'id' | 'createdAt' | 'updatedAt' | 'token'>;

export type User = Omit<UserDto, 'token'>;

export type UserLight = Omit<UserDto, 'token' | 'password'>;

export type UserLightAuth = Omit<UserDto, 'password'>

export type SignInRequest = Pick<UserDto, 'email' | 'password'>;
