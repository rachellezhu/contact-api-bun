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

export function toUserResponse(user: User): UserResponse {
  return {
    full_name: user.full_name,
    username: user.username,
  };
}
