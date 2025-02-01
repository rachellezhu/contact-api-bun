import { HTTPException } from "hono/http-exception";
import {
  AddressResponse,
  CreateAddressRequest,
  toAddressResponse,
} from "../model/address-model";
import { prismaClient } from "../settings/database";
import { AddressValidation } from "../validation/address-validation";

export class AddressService {
  static async create(request: CreateAddressRequest): Promise<AddressResponse> {
    request = AddressValidation.CREATE.parse(request);

    const address = await prismaClient.address.create({ data: request });

    if (!address)
      throw new HTTPException(400, { message: "address could not be created" });

    return toAddressResponse(address);
  }

  static async get(
    idContact: number,
    idAddress: number
  ): Promise<AddressResponse> {
    const address = await prismaClient.address.findFirst({
      where: { id: idAddress, contact_id: idContact },
    });

    if (!address)
      throw new HTTPException(401, { message: "address could not be found" });

    return toAddressResponse(address);
  }
}
