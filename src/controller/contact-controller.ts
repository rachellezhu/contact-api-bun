import { Hono } from "hono";
import { ApplicationVariables } from "../model/app-model";
import { User } from "@prisma/client";
import { ContactService } from "../service/contact-service";
import {
  CreateContactRequest,
  SearchContactRequest,
  UpdateContactRequest,
} from "../model/contact-model";
import { authMiddleware } from "../middleware/auth-middleware";
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from "../settings/constant";

export const contactController = new Hono<{
  Variables: ApplicationVariables;
}>().basePath("/api/contacts");

contactController.use(authMiddleware);

contactController.post("/", async (c) => {
  const user = c.get("user") as User;
  const request = (await c.req.json()) as CreateContactRequest;
  const response = await ContactService.create(user, request);

  return c.json({
    data: response,
  });
});

contactController.get("/:idContact", async (c) => {
  const user = c.get("user") as User;
  const idContact = Number(c.req.param("idContact"));
  const response = await ContactService.get(user, idContact);

  return c.json({
    data: response,
  });
});

contactController.put("/:idContact", async (c) => {
  const user = c.get("user") as User;
  const idContact = Number(c.req.param("idContact"));
  const request = await c.req.json();
  let data: UpdateContactRequest = {
    id: idContact,
    username: user.username,
    first_name: request.first_name,
    last_name: request.last_name,
    email: request.email,
    phone: request.phone,
  };
  const response = await ContactService.update(data);

  return c.json({
    data: response,
  });
});

contactController.delete("/:idContact", async (c) => {
  const user = c.get("user") as User;
  const idContact = Number(c.req.param("idContact"));
  const response = await ContactService.delete({
    id: idContact,
    username: user.username,
  });

  return c.json({
    data: response,
  });
});

contactController.get("/", async (c) => {
  const user = c.get("user") as User;
  const name = c.req.query("name") || "";
  const email = c.req.query("email") || "";
  const phone = c.req.query("phone") || "";
  const size = Number(c.req.query("size")) || DEFAULT_PAGE_SIZE;
  const page = Number(c.req.query("page")) || DEFAULT_CURRENT_PAGE;
  let data: SearchContactRequest = { size, page };

  if (name) data = { ...data, name: decodeURIComponent(name) };
  if (email) data = { ...data, email: decodeURIComponent(email) };
  if (phone) data = { ...data, phone: decodeURIComponent(phone) };

  const response = await ContactService.search(user, data);

  return c.json({
    data: response.data,
    page: response.page,
  });
});
