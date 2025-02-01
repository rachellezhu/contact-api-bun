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
    await AddressTest.delete();
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

export class AddressTest {
  static async create(contactId: number) {
    await prismaClient.address.createMany({
      data: [
        {
          contact_id: contactId,
          city: "Test City",
          province: "Test Province",
          country: "Test Country",
          postal_code: "69696",
        },
        {
          contact_id: contactId,
          city: "Test 1 City",
          province: "Test 1 Province",
          country: "Test 1 Country",
          postal_code: "11111",
        },
        {
          contact_id: contactId,
          city: "Test 2 City",
          province: "Test 2 Province",
          country: "Test 2 Country",
          postal_code: "22222",
        },
        {
          contact_id: contactId,
          city: "Test 3 City",
          province: "Test 3 Province",
          country: "Test 3 Country",
          postal_code: "33333",
        },
        {
          contact_id: contactId,
          city: "Test 4 City",
          province: "Test 4 Province",
          country: "Test 4 Country",
          postal_code: "44444",
        },
        {
          contact_id: contactId,
          city: "Test 4 City",
          province: "Test 4 Province",
          country: "Test 4 Country",
          postal_code: "44444",
        },
        {
          contact_id: contactId,
          city: "Test 5 City",
          province: "Test 5 Province",
          country: "Test 5 Country",
          postal_code: "55555",
        },
        {
          contact_id: contactId,
          city: "Test 6 City",
          province: "Test 6 Province",
          country: "Test 6 Country",
          postal_code: "66666",
        },
        {
          contact_id: contactId,
          city: "Test 7 City",
          province: "Test 7 Province",
          country: "Test 7 Country",
          postal_code: "77777",
        },
        {
          contact_id: contactId,
          city: "Test 8 City",
          province: "Test 8 Province",
          country: "Test 8 Country",
          postal_code: "88888",
        },
        {
          contact_id: contactId,
          city: "Test 9 City",
          province: "Test 9 Province",
          country: "Test 9 Country",
          postal_code: "99999",
        },
        {
          contact_id: contactId,
          country: "United States",
          postal_code: "12312",
        },
      ],
    });
  }

  static async delete() {
    await prismaClient.address.deleteMany({});
  }

  static async get() {
    const addresses = await prismaClient.address.findMany({});

    return addresses;
  }
}
