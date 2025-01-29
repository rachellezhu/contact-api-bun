import { prismaClient } from "../src/settings/database";

export class UserTest {
  static async create() {
    const user = await prismaClient.user.create({
      data: {
        username: "test",
        full_name: "test",
        password: await Bun.password.hash("test1234", {
          algorithm: "bcrypt",
          cost: 10,
        }),
        token: "test",
      },
    });

    return user;
  }

  static async delete() {
    await ContactTest.delete();
    await prismaClient.user.deleteMany({});
  }

  static async get(username: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        username: username,
      },
    });

    return user;
  }
}

export class ContactTest {
  static async create(username: string) {
    const contact = await prismaClient.contact.create({
      data: {
        username: username,
        first_name: "Rachelle",
        last_name: "Zhu",
        email: "test@test.test",
        phone: "+696969696969",
      },
    });

    return contact;
  }

  static async delete() {
    await prismaClient.contact.deleteMany({});
  }
}
