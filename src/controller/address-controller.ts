import { Hono } from "hono";
import { ApplicationVariables } from "../model/app-model";
import { authMiddleware } from "../middleware/auth-middleware";
import { AddressService } from "../service/address-service";
import { CreateAddressRequest } from "../model/address-model";

export const addressController = new Hono<{
  Variables: ApplicationVariables;
}>().basePath("/api/contacts/:idContact/addresses");

addressController.use(authMiddleware);

addressController.post("/", async (c) => {
  const idContact = Number(c.req.param("idContact"));
  const request = await c.req.json();
  request.contact_id = idContact;
  const response = await AddressService.create(request as CreateAddressRequest);

  return c.json({ data: response });
});

addressController.get("/:idAddress", async (c) => {
  const idContact = Number(c.req.param("idContact"));
  const idAddress = Number(c.req.param("idAddress"));
  const response = await AddressService.get(idContact, idAddress);

  return c.json({ data: response });
});
