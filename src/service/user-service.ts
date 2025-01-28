import {
  RegisterUserRequest,
  toUserResponse,
  UserResponse,
} from "../model/user-model";
import { prismaClient } from "../settings/database";
import { UserValidation } from "../validation/user-validation";
import { HTTPException } from "hono/http-exception";

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
}
