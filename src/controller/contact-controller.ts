import { Hono } from "hono";
import { ApplicationVariables } from "../model/app-model";
import { User } from "@prisma/client";
import { ContactService } from "../service/contact-service";
import {
  CreateContactRequest,
  UpdateContactRequest,
} from "../model/contact-model";
import { authMiddleware } from "../middleware/auth-middleware";

export const contactController = new Hono<{
  Variables: ApplicationVariables;
}>();

contactController.use(authMiddleware);

contactController.post("/api/contacts", async (c) => {
  const user = c.get("user") as User;
  const request = (await c.req.json()) as CreateContactRequest;
  const response = await ContactService.create(user, request);

  return c.json({
    data: response,
  });
});

contactController.get("/api/contacts/:idContact", async (c) => {
  const user = c.get("user") as User;
  const idContact = Number(c.req.param("idContact"));
  const response = await ContactService.get(user, idContact);

  return c.json({
    data: response,
  });
});

contactController.put("/api/contacts/:idContact", async (c) => {
  const user = c.get("user") as User;
  const idContact = Number(c.req.param("idContact"));
  const request = (await c.req.json()) as UpdateContactRequest;
  const response = await ContactService.update(user, request, idContact);

  return c.json({
    data: response,
  });
});

contactController.delete("/api/contacts/:idContact", async (c) => {
  const user = c.get("user") as User;
  const idContact = Number(c.req.param("idContact"));
  const response = await ContactService.delete(user, idContact);

  return c.json({
    data: response,
  });
});

contactController.get("/api/contacts", async (c) => {
  const user = c.get("user") as User;
  const { name, email, phone, size, page } = c.req.query();
  const response = await ContactService.search(user, {
    name: name,
    email: email,
    phone: phone,
    size: Number(size) || 10,
    page: Number(page) || 1,
  });

  return c.json({
    data: response.data,
    page: response.page,
  });
});
