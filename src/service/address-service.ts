import { HTTPException } from "hono/http-exception";
import {
  AddressResponse,
  CreateAddressRequest,
  DeleteAddressRequest,
  GetAddressRequest,
  ListAddressRequest,
  toAddressResponse,
  UpdateAddressRequest,
} from "../model/address-model";
import { prismaClient } from "../settings/database";
import { AddressValidation } from "../validation/address-validation";
import { Prisma } from "@prisma/client";

export class AddressService {
  static async create(request: CreateAddressRequest): Promise<AddressResponse> {
    request = AddressValidation.CREATE.parse(request);

    const address = await prismaClient.address.create({ data: request });

    if (!address)
      throw new HTTPException(400, { message: "address could not be created" });

    return toAddressResponse(address);
  }

  static async get(request: GetAddressRequest): Promise<AddressResponse> {
    request = AddressValidation.GET.parse(request);

    const address = await prismaClient.address.findFirst({
      where: { id: request.id, contact_id: request.contact_id },
    });

    if (!address)
      throw new HTTPException(401, { message: "address could not be found" });

    return toAddressResponse(address);
  }

  static async update(
    idContact: number,
    idAddress: number,
    request: UpdateAddressRequest
  ): Promise<AddressResponse> {
    request = AddressValidation.UPDATE.parse(request);

    let data: Prisma.AddressUpdateInput = {};

    if (request.street) data = { ...data, street: request.street };
    if (request.city) data = { ...data, city: request.city };
    if (request.province) data = { ...data, province: request.province };
    if (request.country) data = { ...data, country: request.country };
    if (request.postal_code)
      data = { ...data, postal_code: request.postal_code };

    const address = await prismaClient.address.update({
      where: { contact_id: idContact, id: idAddress },
      data,
    });

    if (!address)
      throw new HTTPException(400, { message: "address could not be updated" });

    return toAddressResponse(address);
  }

  static async delete(request: DeleteAddressRequest): Promise<true> {
    request = AddressValidation.DELETE.parse(request);

    const address = await prismaClient.address.delete({
      where: { id: request.id, contact_id: request.contact_id },
    });

    if (!address)
      throw new HTTPException(400, { message: "address could not be deleted" });

    return true;
  }

  static async list(request: ListAddressRequest): Promise<{
    data: AddressResponse[];
    page: { current_page: number; total_page: number; size: number };
  }> {
    request = AddressValidation.LIST.parse(request);

    const [addresses, count] = await prismaClient.$transaction([
      prismaClient.address.findMany({
        skip: (request.page - 1) * request.size,
        take: request.size,
        where: { contact_id: request.contact_id },
      }),
      prismaClient.address.count({ where: { contact_id: request.contact_id } }),
    ]);

    if (!count || !addresses.length)
      throw new HTTPException(400, { message: "address could not be found" });

    return {
      data: addresses,
      page: {
        current_page: request.page,
        total_page: Math.ceil(count / request.size),
        size: request.size,
      },
    };
  }
}
