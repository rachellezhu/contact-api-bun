import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { ContactTest, UserTest } from "./test-utils";
import app from "../src";
import { logger } from "../src/settings/logging";

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
    const contact = await ContactTest.create("test");
    const response = await app.request(`api/contacts/${contact.id}`, {
      method: "get",
      headers: {
        Authorization: "test",
      },
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe(contact.first_name);
    expect(body.data.last_name).toBe(contact.last_name);
    expect(body.data.email).toBe(contact.email);
    expect(body.data.phone).toBe(contact.phone);
  });

  it("Should not be able to get contact if contact id is invalid", async function () {
    const contact = await ContactTest.create("test");
    const response = await app.request(`/api/contacts/${contact.id + 100}`, {
      method: "get",
      headers: {
        Authorization: "test",
      },
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(403);
    expect(body.errors).toBeDefined();
  });

  it("Should not be able to get contact if there is no Authorization headers", async function () {
    const contact = await ContactTest.create("test");
    const response = await app.request(`/api/contacts/${contact.id + 100}`, {
      method: "get",
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });

  it("Should not be able to get contact if Authorization headers is invalid", async function () {
    const contact = await ContactTest.create("test");
    const response = await app.request(`/api/contacts/${contact.id + 100}`, {
      method: "get",
      headers: {
        Authorization: "invalid_token",
      },
    });

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
    const contact = await ContactTest.create("test");
    const response = await app.request(`/api/contacts/${contact.id}`, {
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
    const contact = await ContactTest.create("test");
    const response = await app.request(`/api/contacts/${contact.id}`, {
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
    const contact = await ContactTest.create("test");
    const response = await app.request(`/api/contacts/${contact.id + 100}`, {
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

    expect(response.status).toBe(500);
    expect(body.errors).toBeDefined();
  });

  it("Should not be able to update contact if there is no Authorization header", async function () {
    const contact = await ContactTest.create("test");
    const response = await app.request(`/api/contacts/${contact.id + 100}`, {
      method: "put",
      body: JSON.stringify({
        first_name: "First",
        last_name: "Last",
        email: "updated@updated.updated",
        phone: "088888888888",
      }),
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });

  it("Should not be able to update contact if Authorization header is invalid", async function () {
    const contact = await ContactTest.create("test");
    const response = await app.request(`/api/contacts/${contact.id + 100}`, {
      method: "put",
      headers: { Authorization: "invalid_token" },
      body: JSON.stringify({
        first_name: "First",
        last_name: "Last",
        email: "updated@updated.updated",
        phone: "088888888888",
      }),
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });
});
