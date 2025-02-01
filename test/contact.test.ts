import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { ContactTest, UserTest } from "./test-utils";
import app from "../src";
import { logger } from "../src/settings/logging";
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "../src/settings/constant";

describe("POST /api/contacts", async function () {
  beforeEach(async function () {
    await UserTest.create();
  });

  afterEach(async function () {
    await UserTest.delete();
  });

  it("Should be able to create new contact", async function () {
    const response = await app.request("/api/contacts", {
      method: "post",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "Rachelle",
      }),
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe("Rachelle");
  });

  it("Should reject create new contact if there is no first name", async function () {
    const response = await app.request("/api/contacts", {
      method: "post",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "",
      }),
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });

  it("Should reject create new contact if there is no Authorization header", async function () {
    const response = await app.request("/api/contacts", {
      method: "post",
      body: JSON.stringify({
        first_name: "",
      }),
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/{idContact}", async function () {
  beforeEach(async function () {
    await UserTest.create();
  });

  afterEach(async function () {
    await UserTest.delete();
  });

  it("Should be able to get contact", async function () {
    await ContactTest.create();
    const contacts = await ContactTest.get();
    const response = await app.request(`api/contacts/${contacts[0].id}`, {
      method: "get",
      headers: {
        Authorization: "test",
      },
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe(contacts[0].first_name);
    expect(body.data.last_name).toBe(contacts[0].last_name);
    expect(body.data.email).toBe(contacts[0].email);
    expect(body.data.phone).toBe(contacts[0].phone);
  });

  it("Should not be able to get contact if contact id is invalid", async function () {
    await ContactTest.create();
    const contacts = await ContactTest.get();
    const response = await app.request(
      `/api/contacts/${contacts[0].id + 100}`,
      {
        method: "get",
        headers: {
          Authorization: "test",
        },
      }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(403);
    expect(body.errors).toBeDefined();
  });

  it("Should not be able to get contact if there is no Authorization headers", async function () {
    await ContactTest.create();
    const contacts = await ContactTest.get();
    const response = await app.request(
      `/api/contacts/${contacts[0].id + 100}`,
      {
        method: "get",
      }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });

  it("Should not be able to get contact if Authorization headers is invalid", async function () {
    await ContactTest.create();
    const contacts = await ContactTest.get();
    const response = await app.request(
      `/api/contacts/${contacts[0].id + 100}`,
      {
        method: "get",
        headers: {
          Authorization: "invalid_token",
        },
      }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });
});

describe("PUT /api/contacts/{idContact}", async function () {
  beforeEach(async function () {
    await UserTest.create();
  });

  afterEach(async function () {
    await UserTest.delete();
  });

  it("Should be able to update contact", async function () {
    const contacts = await ContactTest.create();
    const response = await app.request(`/api/contacts/${contacts[0].id}`, {
      method: "put",
      headers: { Authorization: "test" },
      body: JSON.stringify({
        first_name: "First",
        last_name: "Last",
        email: "updated@updated.updated",
        phone: "088888888888",
      }),
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe("First");
    expect(body.data.last_name).toBe("Last");
    expect(body.data.email).toBe("updated@updated.updated");
    expect(body.data.phone).toBe("088888888888");
  });

  it("Should not be able to update contact if there is no data", async function () {
    const contacts = await ContactTest.create();
    const response = await app.request(`/api/contacts/${contacts[0].id}`, {
      method: "put",
      headers: { Authorization: "test" },
      body: JSON.stringify({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
      }),
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });

  it("Should not be able to update contact if contact id is invalid", async function () {
    const contacts = await ContactTest.create();
    const response = await app.request(
      `/api/contacts/${contacts[0].id + 100}`,
      {
        method: "put",
        headers: { Authorization: "test" },
        body: JSON.stringify({
          first_name: "First",
          last_name: "Last",
          email: "updated@updated.updated",
          phone: "088888888888",
        }),
      }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(500);
    expect(body.errors).toBeDefined();
  });

  it("Should not be able to update contact if there is no Authorization header", async function () {
    const contacts = await ContactTest.create();
    const response = await app.request(
      `/api/contacts/${contacts[0].id + 100}`,
      {
        method: "put",
        body: JSON.stringify({
          first_name: "First",
          last_name: "Last",
          email: "updated@updated.updated",
          phone: "088888888888",
        }),
      }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });

  it("Should not be able to update contact if Authorization header is invalid", async function () {
    const contacts = await ContactTest.create();
    const response = await app.request(
      `/api/contacts/${contacts[0].id + 100}`,
      {
        method: "put",
        headers: { Authorization: "invalid_token" },
        body: JSON.stringify({
          first_name: "First",
          last_name: "Last",
          email: "updated@updated.updated",
          phone: "088888888888",
        }),
      }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });
});

describe("DELETE /api/contacts/{idContact}", async function () {
  beforeEach(async function () {
    await UserTest.create();
  });

  afterEach(async function () {
    await UserTest.delete();
  });

  it("Should be able to delete contact", async function () {
    await ContactTest.create();
    const contacts = await ContactTest.get();
    const response = await app.request(`api/contacts/${contacts[0].id}`, {
      method: "delete",
      headers: { Authorization: "test" },
    });

    const afterResponse = await ContactTest.get();

    const body = await response.json();
    logger.debug(body);
    expect(response.status).toBe(200);
    expect(body.data).toBeTrue();
    expect(afterResponse.length).toBe(contacts.length - 1);
  });

  it("Should bot be able to delete contact if contact id is invalid", async function () {
    await ContactTest.create();
    const contacts = await ContactTest.get();
    const response = await app.request(
      `/api/contacts/${contacts[0].id + 100}`,
      {
        method: "delete",
        headers: { Authorization: "test" },
      }
    );

    const afterResponse = await ContactTest.get();

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(500);
    expect(body.errors).toBeDefined();
    expect(afterResponse.length).toBe(contacts.length);
  });

  it("Should not be able to delete contact if there is no Authorization headers", async function () {
    await ContactTest.create();
    const contacts = await ContactTest.get();
    const response = await app.request(
      `/api/contacts/${contacts[0].id + 100}`,
      {
        method: "delete",
      }
    );

    const afterResponse = await ContactTest.get();

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
    expect(afterResponse.length).toBe(contacts.length);
  });
});

describe("GET /api/contacts?", async function () {
  beforeEach(async function () {
    await UserTest.create();
  });

  afterEach(async function () {
    await UserTest.delete();
  });

  it("Should be able to search contact by all query params", async function () {
    const contacts = await ContactTest.create();
    const response = await app.request(
      `/api/contacts?name=${encodeURIComponent(
        contacts[0].first_name
      )}&email=${encodeURIComponent(
        contacts[0].email!
      )}&phone=${encodeURIComponent(contacts[0].phone!)}&size=5`,
      {
        method: "get",
        headers: { Authorization: "test" },
      }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data.length).toBe(1);
    expect(body.data[0].first_name).toBe(contacts[0].first_name);
    expect(body.data[0].last_name).toBe(contacts[0].last_name);
    expect(body.data[0].email).toBe(contacts[0].email);
    expect(body.data[0].phone).toBe(contacts[0].phone);
    expect(body.page.current_page).toBe(1);
    expect(body.page.total_page).toBe(1);
    expect(body.page.size).toBe(5);
  });

  it("Should be able to search contact by query param name", async function () {
    await ContactTest.create();
    const response = await app.request(
      `/api/contacts?name=${encodeURIComponent("al-a'")}`,
      {
        method: "get",
        headers: { Authorization: "test" },
      }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.length).toBe(1);
    expect(body.data[0].first_name).toBe("Al-Barak");
    expect(body.data[0].last_name).toBe("Al-A'yun");
    expect(body.data[0].email).toBe("turu@test.test");
    expect(body.data[0].phone).toBe("+696969696996");
    expect(body.page).toBeDefined();
    expect(body.page.current_page).toBe(DEFAULT_CURRENT_PAGE);
    expect(body.page.size).toBe(DEFAULT_PAGE_SIZE);
    expect(body.page.total_page).toBe(1);
  });

  it("Should be able to search contact by query param email", async function () {
    await ContactTest.create();
    const response = await app.request(
      `/api/contacts?email=${encodeURIComponent("turu@")}`,
      {
        method: "get",
        headers: { Authorization: "test" },
      }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.length).toBe(1);
    expect(body.data[0].first_name).toBe("Al-Barak");
    expect(body.data[0].last_name).toBe("Al-A'yun");
    expect(body.data[0].email).toBe("turu@test.test");
    expect(body.data[0].phone).toBe("+696969696996");
    expect(body.page).toBeDefined();
    expect(body.page.current_page).toBe(DEFAULT_CURRENT_PAGE);
    expect(body.page.size).toBe(DEFAULT_PAGE_SIZE);
    expect(body.page.total_page).toBe(1);
  });

  it("Should be able to search contact by query param phone", async function () {
    await ContactTest.create();
    const response = await app.request(
      `/api/contacts?phone=${encodeURIComponent("96996")}`,
      {
        method: "get",
        headers: { Authorization: "test" },
      }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.length).toBe(1);
    expect(body.data[0].first_name).toBe("Al-Barak");
    expect(body.data[0].last_name).toBe("Al-A'yun");
    expect(body.data[0].email).toBe("turu@test.test");
    expect(body.data[0].phone).toBe("+696969696996");
    expect(body.page).toBeDefined();
    expect(body.page.current_page).toBe(DEFAULT_CURRENT_PAGE);
    expect(body.page.size).toBe(DEFAULT_PAGE_SIZE);
    expect(body.page.total_page).toBe(1);
  });

  it("Should be able to search all contacts if query params is not given", async function () {
    await ContactTest.create();
    const response = await app.request("api/contacts", {
      method: "get",
      headers: { Authorization: "test" },
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.length).toBe(10);
    expect(body.page).toBeDefined();
    expect(body.page.current_page).toBe(DEFAULT_CURRENT_PAGE);
    expect(body.page.total_page).toBe(2);
    expect(body.page.size).toBe(DEFAULT_PAGE_SIZE);
  });

  it("Should be able to set size to 5 and access page number 3", async function () {
    await ContactTest.create();
    const response = await app.request("/api/contacts?size=5&page=3", {
      method: "get",
      headers: { Authorization: "test" },
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.page).toBeDefined();
    expect(body.data.length).toBe(2);
    expect(body.page.current_page).toBe(3);
    expect(body.page.size).toBe(5);
    expect(body.page.total_page).toBe(3);
  });

  it("Should not be able to get contact if there is no Authorization header while getting all contacts", async function () {
    await ContactTest.create();
    const response = await app.request("/api/contacts", {
      method: "get",
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });

  it("Should not be able to get contact if contact is not registered", async function () {
    await ContactTest.create();
    const response = await app.request("/api/contacts?name=unregistered", {
      method: "get",
      headers: { Authorization: "test" },
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });
});
