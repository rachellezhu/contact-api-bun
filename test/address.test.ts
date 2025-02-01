import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { AddressTest, ContactTest, UserTest } from "./test-utils";
import app from "../src";
import { logger } from "../src/settings/logging";

describe("POST /api/contacts/{idContact}/address", async function () {
  beforeEach(async function () {
    await UserTest.create();
  });

  afterEach(async function () {
    await UserTest.delete();
  });

  it("Should be able to create new address", async function () {
    await ContactTest.create();
    const contacts = await ContactTest.get();
    const response = await app.request(
      `/api/contacts/${contacts[0].id}/addresses`,
      {
        method: "post",
        headers: { Authorization: "test" },
        body: JSON.stringify({
          street: "Test Street",
          city: "Test City",
          province: "Test Province",
          country: "Test Country",
          postal_code: "12312",
        }),
      }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.street).toBe("Test Street");
    expect(body.data.city).toBe("Test City");
    expect(body.data.province).toBe("Test Province");
    expect(body.data.country).toBe("Test Country");
    expect(body.data.postal_code).toBe("12312");
  });

  it("Should not be able to create new address if there is no Authorization headers", async function () {
    await ContactTest.create();
    const contacts = await ContactTest.get();
    const response = await app.request(
      `/api/contacts/${contacts[0].id}/addresses`,
      {
        method: "post",
        body: JSON.stringify({
          street: "Test Street",
          city: "Test City",
          province: "Test Province",
          country: "Test Country",
          postal_code: "12312",
        }),
      }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });

  it("Should not be able to create new address if there are no postal_code and/or country", async function () {
    await ContactTest.create();
    const contacts = await ContactTest.get();
    const response = await app.request(
      `/api/contacts/${contacts[0].id}/addresses`,
      {
        method: "post",
        body: JSON.stringify({
          street: "Test Street",
          city: "Test City",
          province: "Test Province",
        }),
      }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/{idContact}/address/{idAddress}", async function () {
  beforeEach(async function () {
    await UserTest.create();
  });

  afterEach(async function () {
    await UserTest.delete();
  });

  it("Should be able to get address by its id", async function () {
    const contacts = await ContactTest.create();
    await AddressTest.create(contacts[0].id);
    const addresses = await AddressTest.get();
    const response = await app.request(
      `/api/contacts/${addresses[0].contact_id}/addresses/${addresses[0].id}`,
      { method: "get", headers: { Authorization: "test" } }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.street).toBe(addresses[0].street);
    expect(body.data.city).toBe(addresses[0].city);
    expect(body.data.province).toBe(addresses[0].province);
    expect(body.data.country).toBe(addresses[0].country);
    expect(body.data.postal_code).toBe(addresses[0].postal_code);
  });

  it("Should not be able to get address if there is no Authorization headers", async function () {
    const contacts = await ContactTest.create();
    await AddressTest.create(contacts[0].id);
    const addresses = await AddressTest.get();
    const response = await app.request(
      `/api/contacts/${addresses[0].contact_id}/addresses/${addresses[0].id}`,
      { method: "get" }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });

  it("Should not be able to get address if id is invalid", async function () {
    const contacts = await ContactTest.create();
    await AddressTest.create(contacts[0].id);
    const addresses = await AddressTest.get();
    const response = await app.request(
      `/api/contacts/${addresses[0].contact_id}/addresses/${
        addresses[0].id + 100
      }`,
      { method: "get" }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });
});
