import { Hono } from "hono";
import { ApplicationVariables } from "../model/app-model";
import { User } from "@prisma/client";
import { ContactService } from "../service/contact-service";
import {
  CreateContactRequest,
  GetContactRequest,
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
  const data = await c.req.json();
  const request: CreateContactRequest = { ...data, username: user.username };
  const response = await ContactService.create(request);

  return c.json({
    data: response,
  });
});

contactController.get("/:idContact", async (c) => {
  const user = c.get("user") as User;
  const idContact = Number(c.req.param("idContact"));
  const request: GetContactRequest = { id: idContact, username: user.username };
  const response = await ContactService.get(request);

  return c.json({
    data: response,
  });
});

contactController.put("/:idContact", async (c) => {
  const user = c.get("user") as User;
  const idContact = Number(c.req.param("idContact"));
  const data = await c.req.json();
  let request: UpdateContactRequest = {
    id: idContact,
    username: user.username,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone,
  };
  const response = await ContactService.update(request);

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
  let request: SearchContactRequest = { username: user.username, size, page };

  if (name) request = { ...request, name: decodeURIComponent(name) };
  if (email) request = { ...request, email: decodeURIComponent(email) };
  if (phone) request = { ...request, phone: decodeURIComponent(phone) };

  const response = await ContactService.search(request);

  return c.json({
    data: response.data,
    page: response.page,
  });
});
