import { describe, it, expect, afterEach, beforeEach } from "bun:test";
import app from "../src";
import { logger } from "../src/settings/logging";
import { UserTest } from "./test-utils";

describe("POST /api/users", function () {
  afterEach(async function () {
    await UserTest.delete();
  });

  it("Should reject new user registration if the request is invalid", async function () {
    const response = await app.request("/api/users", {
      method: "post",
      body: JSON.stringify({
        username: "",
        password: "",
        full_name: "",
      }),
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });

  it("Should reject new user registration if the username already exists", async function () {
    await UserTest.create();

    const response = await app.request("/api/users", {
      method: "post",
      body: JSON.stringify({
        username: "test",
        password: "test1234",
        full_name: "test",
      }),
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });

  it("Should succeed register new user", async function () {
    const response = await app.request("/api/users", {
      method: "post",
      body: JSON.stringify({
        username: "rachelle",
        password: "pass1234",
        full_name: "Rachelle Zhu",
      }),
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.username).toBe("rachelle");
    expect(body.data.full_name).toBe("Rachelle Zhu");
  });
});

describe("POST /api/users/login", function () {
  beforeEach(async function () {
    await UserTest.create();
  });

  afterEach(async function () {
    await UserTest.delete();
  });

  it("Should reject login if username is invalid", async function () {
    const response = await app.request("/api/users/login", {
      method: "post",
      body: JSON.stringify({
        username: "invalid_username",
        password: "test1234",
      }),
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });

  it("Should reject login if password is invalid", async function () {
    const response = await app.request("/api/users/login", {
      method: "post",
      body: JSON.stringify({
        username: "test",
        password: "invalid123",
      }),
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });

  it("Should succeed login if username and password are valid", async function () {
    const response = await app.request("/api/users/login", {
      method: "post",
      body: JSON.stringify({
        username: "test",
        password: "test1234",
      }),
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.username).toBe("test");
    expect(body.data.full_name).toBe("test");
    expect(body.data.token).toBeDefined();
  });
});

describe("GET /api/users/current", function () {
  beforeEach(async function () {
    await UserTest.create();
  });

  afterEach(async function () {
    await UserTest.delete();
  });

  it("Should be able to get user", async function () {
    const response = await app.request("/api/users/current", {
      method: "get",
      headers: {
        Authorization: "test",
      },
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.username).toBe("test");
    expect(body.data.full_name).toBe("test");
  });

  it("Should not be able to get user if the token is invalid", async function () {
    const response = await app.request("/api/users/current", {
      headers: {
        Authorization: "invalid_token",
      },
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });

  it("Should not be able to get user if there is no Authorization header", async function () {
    const response = await app.request("/api/users/current");

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });
});
