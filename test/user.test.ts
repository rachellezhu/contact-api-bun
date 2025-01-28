import { describe, it, expect, afterEach } from "bun:test";
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
