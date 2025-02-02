import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { AddressTest, ContactTest, UserTest } from "./test-utils";
import app from "../src";
import { logger } from "../src/settings/logging";
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "../src/settings/constant";

describe("POST /api/contacts/{idContact}/addresses", async function () {
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

describe("GET /api/contacts/{idContact}/addresses/{idAddress}", async function () {
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

describe("PUT /api/contacts/{idContact}/addresses/{idAddress}", async function () {
  beforeEach(async function () {
    await UserTest.create();
  });

  afterEach(async function () {
    await UserTest.delete();
  });

  it("Should be able to update address", async function () {
    await ContactTest.create();
    const contacts = await ContactTest.get();
    await AddressTest.create(contacts[0].id);
    const addresses = await AddressTest.get();
    const response = await app.request(
      `/api/contacts/${contacts[0].id}/addresses/${addresses[0].id}`,
      {
        method: "put",
        headers: {
          Authorization: "test",
        },
        body: JSON.stringify({
          street: "Updated Street 69",
          city: "Updated City",
          province: "Updated Province",
          country: "Updated Country",
          postal_code: "00000",
        }),
      }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.street).toBe("Updated Street 69");
    expect(body.data.city).toBe("Updated City");
    expect(body.data.province).toBe("Updated Province");
    expect(body.data.country).toBe("Updated Country");
    expect(body.data.postal_code).toBe("00000");
  });
  it("Should not be able to update address if no data given", async function () {
    await ContactTest.create();
    const contacts = await ContactTest.get();
    await AddressTest.create(contacts[0].id);
    const addresses = await AddressTest.get();
    const response = await app.request(
      `/api/contacts/${contacts[0].id}/addresses/${addresses[0].id}`,
      {
        method: "put",
        headers: {
          Authorization: "test",
        },
        body: JSON.stringify({
          street: "",
          city: "",
          province: "",
          country: "",
          postal_code: "",
        }),
      }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });

  it("Should not be able to update address if address id is invalid", async function () {
    await ContactTest.create();
    const contacts = await ContactTest.get();
    await AddressTest.create(contacts[0].id);
    const addresses = await AddressTest.get();
    const response = await app.request(
      `/api/contacts/${contacts[0].id}/addresses/${addresses[0].id + 100}`,
      {
        method: "put",
        headers: {
          Authorization: "test",
        },
        body: JSON.stringify({
          street: "Updated Street 69",
          city: "Updated City",
          province: "Updated Province",
          country: "Updated Country",
          postal_code: "00000",
        }),
      }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(500);
    expect(body.errors).toBeDefined();
  });

  it("Should not be able to update address if there is no Authorization headers", async function () {
    await ContactTest.create();
    const contacts = await ContactTest.get();
    await AddressTest.create(contacts[0].id);
    const addresses = await AddressTest.get();
    const response = await app.request(
      `/api/contacts/${contacts[0].id}/addresses/${addresses[0].id + 100}`,
      {
        method: "put",
        body: JSON.stringify({
          street: "Updated Street 69",
          city: "Updated City",
          province: "Updated Province",
          country: "Updated Country",
          postal_code: "00000",
        }),
      }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });
});

describe("DELETE /api/contacts/{idContact}/addresses/{idAddress}", async function () {
  beforeEach(async function () {
    await UserTest.create();
  });

  afterEach(async function () {
    await UserTest.delete();
  });

  it("Should be able to delete address", async function () {
    await ContactTest.create();
    const contacts = await ContactTest.get();
    await AddressTest.create(contacts[0].id);
    const addresses = await AddressTest.get();
    const response = await app.request(
      `/api/contacts/${contacts[0].id}/addresses/${addresses[0].id}`,
      { method: "delete", headers: { Authorization: "test" } }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeTrue();
  });

  it("Should not be able to delete address if address id is invalid", async function () {
    await ContactTest.create();
    const contacts = await ContactTest.get();
    await AddressTest.create(contacts[0].id);
    const addresses = await AddressTest.get();
    const response = await app.request(
      `/api/contacts/${contacts[0].id}/addresses/${addresses[0].id + 100}`,
      { method: "delete", headers: { Authorization: "test" } }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(500);
    expect(body.errors).toBeDefined();
  });

  it("Should not be able to delete address if there is no Authorization headers", async function () {
    await ContactTest.create();
    const contacts = await ContactTest.get();
    await AddressTest.create(contacts[0].id);
    const addresses = await AddressTest.get();
    const response = await app.request(
      `/api/contacts/${contacts[0].id}/addresses/${addresses[0].id}`,
      { method: "delete" }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/{idContact}/addresses", async function () {
  beforeEach(async function () {
    await UserTest.create();
  });

  afterEach(async function () {
    await UserTest.delete();
  });

  it("Should be able to get list of address", async function () {
    await ContactTest.create();
    const contacts = await ContactTest.get();
    await AddressTest.create(contacts[0].id);
    const response = await app.request(
      `/api/contacts/${contacts[0].id}/addresses`,
      { method: "get", headers: { Authorization: "test" } }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.page).toBeDefined();
    expect(body.data.length).toBe(DEFAULT_PAGE_SIZE);
    expect(body.page.current_page).toBe(DEFAULT_CURRENT_PAGE);
    expect(body.page.total_page).toBe(2);
    expect(body.page.size).toBe(DEFAULT_PAGE_SIZE);
  });

  it("Should be able to get addresses with query params page and size", async function () {
    await ContactTest.create();
    const contacts = await ContactTest.get();
    await AddressTest.create(contacts[0].id);
    const response = await app.request(
      `/api/contacts/${contacts[0].id}/addresses?size=5&page=3`,
      { method: "get", headers: { Authorization: "test" } }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.page).toBeDefined();
    expect(body.data.length).toBe(2);
    expect(body.page.current_page).toBe(3);
    expect(body.page.total_page).toBe(3);
    expect(body.page.size).toBe(5);
  });

  it("Should not be able to get list of address if there is no Authorization headers", async function () {
    await ContactTest.create();
    const contacts = await ContactTest.get();
    await AddressTest.create(contacts[0].id);
    const response = await app.request(
      `/api/contacts/${contacts[0].id}/addresses`,
      { method: "get" }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });

  it("Should not be able to get list of address if contact id is invalid", async function () {
    await ContactTest.create();
    const contacts = await ContactTest.get();
    await AddressTest.create(contacts[0].id);
    const response = await app.request(
      `/api/contacts/${contacts[0].id + 100}/addresses`,
      { method: "get", headers: { Authorization: "test" } }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });

  it("Should not be able to get list of address if query params size and/or page are invalid", async function () {
    await ContactTest.create();
    const contacts = await ContactTest.get();
    await AddressTest.create(contacts[0].id);
    const response = await app.request(
      `/api/contacts/${contacts[0].id}/addresses?size=5&page=500`,
      { method: "get", headers: { Authorization: "test" } }
    );

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });
});
