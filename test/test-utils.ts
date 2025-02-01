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

  static async get() {
    const user = await prismaClient.user.findUnique({
      where: {
        username: "test",
      },
    });

    return user;
  }
}

export class ContactTest {
  static async create() {
    await prismaClient.contact.createMany({
      data: [
        {
          username: "test",
          first_name: "Rachelle",
          last_name: "Zhu",
          email: "test@test.test",
          phone: "+696969696969",
        },
        {
          username: "test",
          first_name: "Rachelle1",
          last_name: "Zhu1",
          email: "test1@test.test",
          phone: "+696969696968",
        },
        {
          username: "test",
          first_name: "Rachelle2",
          last_name: "Zhu2",
          email: "test2@test.test",
          phone: "+696969696967",
        },
        {
          username: "test",
          first_name: "Rachelle3",
          last_name: "Zhu3",
          email: "test3@test.test",
          phone: "+696969696966",
        },
        {
          username: "test",
          first_name: "Rachelle4",
          last_name: "Zhu4",
          email: "test4@test.test",
          phone: "+696969696965",
        },
        {
          username: "test",
          first_name: "Rachelle5",
          last_name: "Zhu5",
          email: "test5@test.test",
          phone: "+696969696964",
        },
        {
          username: "test",
          first_name: "Rachelle6",
          last_name: "Zhu6",
          email: "test6@test.test",
          phone: "+696969696963",
        },
        {
          username: "test",
          first_name: "Rachelle7",
          last_name: "Zhu7",
          email: "test7@test.test",
          phone: "+696969696962",
        },
        {
          username: "test",
          first_name: "Rachelle8",
          last_name: "Zhu8",
          email: "test8@test.test",
          phone: "+696969696961",
        },
        {
          username: "test",
          first_name: "Rachelle9",
          last_name: "Zhu9",
          email: "test9@test.test",
          phone: "+696969696960",
        },
        {
          username: "test",
          first_name: "Rachelle10",
          last_name: "Zhu10",
          email: "test10@test.test",
          phone: "+696969696971",
        },
        {
          username: "test",
          first_name: "Al-Barak",
          last_name: "Al-A'yun",
          email: "turu@test.test",
          phone: "+696969696996",
        },
      ],
    });

    const contacts = await prismaClient.contact.findMany({});

    return contacts;
  }

  static async delete() {
    await prismaClient.contact.deleteMany({});
  }

  static async get() {
    const contacts = await prismaClient.contact.findMany({
      where: {
        username: "test",
      },
    });

    return contacts;
  }
}
