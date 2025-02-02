import { HTTPException } from "hono/http-exception";
import {
  AddressResponse,
  CreateAddressRequest,
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

  static async delete(idContact: number, idAddress: number): Promise<true> {
    const address = await prismaClient.address.delete({
      where: { id: idAddress, contact_id: idContact },
    });

    if (!address)
      throw new HTTPException(400, { message: "address could not be deleted" });

    return true;
  }

  static async list(
    idContact: number,
    page: number,
    size: number
  ): Promise<{
    data: AddressResponse[];
    page: { current_page: number; total_page: number; size: number };
  }> {
    const [addresses, count] = await prismaClient.$transaction([
      prismaClient.address.findMany({
        skip: (page - 1) * size,
        take: size,
        where: { contact_id: idContact },
      }),
      prismaClient.address.count({ where: { contact_id: idContact } }),
    ]);

    if (!count || !addresses.length)
      throw new HTTPException(400, { message: "address could not be found" });

    return {
      data: addresses,
      page: {
        current_page: page,
        total_page: Math.ceil(count / size),
        size: size,
      },
    };
  }
}
