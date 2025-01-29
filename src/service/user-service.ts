import { User } from "@prisma/client";
import {
  RegisterUserRequest,
  toUserResponse,
  LoginUserRequest,
  UserResponse,
  UpdateUserRequest,
} from "../model/user-model";
import { prismaClient } from "../settings/database";
import { UserValidation } from "../validation/user-validation";
import { HTTPException } from "hono/http-exception";
import { logger } from "../settings/logging";
import { password } from "bun";

export class UserService {
  static async register(request: RegisterUserRequest): Promise<UserResponse> {
    request = UserValidation.REGISTER.parse(request);

    const totalUserWithSameUsername = await prismaClient.user.count({
      where: {
        username: request.username,
      },
    });

    if (!!totalUserWithSameUsername)
      throw new HTTPException(400, { message: "username already exists" });

    request.password = await Bun.password.hash(request.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    const user = await prismaClient.user.create({
      data: request,
    });

    return toUserResponse(user);
  }

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    request = UserValidation.LOGIN.parse(request);

    let user = await prismaClient.user.findUnique({
      where: {
        username: request.username,
      },
    });

    if (!user)
      throw new HTTPException(401, {
        message: "username or password is invalid",
      });

    const checkPassword = await Bun.password.verify(
      request.password,
      user.password,
      "bcrypt"
    );

    if (!checkPassword)
      throw new HTTPException(401, {
        message: "username or password is invalid",
      });

    user = await prismaClient.user.update({
      where: {
        username: request.username,
      },
      data: {
        token: crypto.randomUUID(),
      },
    });

    return toUserResponse(user);
  }

  static async get(token: string | undefined | null): Promise<User> {
    const checkToken = UserValidation.TOKEN.safeParse(token);

    if (checkToken.error)
      throw new HTTPException(401, {
        message: "unauthorized",
      });

    const user = await prismaClient.user.findFirst({
      where: {
        token: token,
      },
    });

    if (!user) throw new HTTPException(401, { message: "unauthorized" });

    return user;
  }

  static async update(request: UpdateUserRequest): Promise<UserResponse> {
    const checkUser = await this.get(request.token);

    request = await UserValidation.UPDATE.parse(request);

    let query = {};

    if (!request.full_name && !request.password)
      throw new HTTPException(400, {
        message: "full_name or password must be filled",
      });

    if (request.full_name) query = { ...query, full_name: request.full_name };
    if (request.password)
      query = {
        ...query,
        password: await password.hash(request.password, {
          algorithm: "bcrypt",
          cost: 10,
        }),
      };

    const user = await prismaClient.user.update({
      where: {
        username: checkUser.username,
        token: checkUser.token,
      },
      data: query,
    });

    return toUserResponse(user);
  }
}
