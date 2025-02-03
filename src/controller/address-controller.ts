import { Hono } from "hono";
import { ApplicationVariables } from "../model/app-model";
import { authMiddleware } from "../middleware/auth-middleware";
import { AddressService } from "../service/address-service";
import {
  CreateAddressRequest,
  DeleteAddressRequest,
  GetAddressRequest,
  ListAddressRequest,
  UpdateAddressRequest,
} from "../model/address-model";
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from "../settings/constant";

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
  const request: GetAddressRequest = { id: idAddress, contact_id: idContact };
  const response = await AddressService.get(request);

  return c.json({ data: response });
});

addressController.put("/:idAddress", async (c) => {
  const idContact = Number(c.req.param("idContact"));
  const idAddress = Number(c.req.param("idAddress"));
  const request = (await c.req.json()) as UpdateAddressRequest;
  const response = await AddressService.update(idContact, idAddress, request);

  return c.json({
    data: response,
  });
});

addressController.delete("/:idAddress", async (c) => {
  const idContact = Number(c.req.param("idContact"));
  const idAddress = Number(c.req.param("idAddress"));
  const request: DeleteAddressRequest = {
    id: idAddress,
    contact_id: idContact,
  };
  const response = await AddressService.delete(request);

  return c.json({
    data: response,
  });
});

addressController.get("/", async (c) => {
  const idContact = Number(c.req.param("idContact"));
  const size = Number(c.req.query("size")) || DEFAULT_PAGE_SIZE;
  const page = Number(c.req.query("page")) || DEFAULT_CURRENT_PAGE;
  const request: ListAddressRequest = { contact_id: idContact, size, page };
  const response = await AddressService.list(request);

  return c.json({
    data: response.data,
    page: response.page,
  });
});
