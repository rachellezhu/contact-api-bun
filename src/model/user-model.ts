import { User } from "@prisma/client";

export type RegisterUserRequest = {
  username: string;
  full_name: string;
  password: string;
};

export type UserResponse = {
  username: string;
  full_name: string;
  token?: string;
};

export type LoginUserRequest = {
  username: string;
  password: string;
};

export type UpdateUserRequest = {
  full_name?: string;
  password?: string;
  token: string;
};

export function toUserResponse(user: User): UserResponse {
  if (!user.token)
    return {
      full_name: user.full_name,
      username: user.username,
    };

  return {
    full_name: user.full_name,
    username: user.username,
    token: user.token,
  };
}
