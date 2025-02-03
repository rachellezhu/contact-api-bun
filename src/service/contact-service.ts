import { Prisma, User } from "@prisma/client";
import {
  ContactResponse,
  CreateContactRequest,
  DeleteContactRequest,
  GetContactRequest,
  SearchContactRequest,
  toContactResponse,
  UpdateContactRequest,
} from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { prismaClient } from "../settings/database";
import { HTTPException } from "hono/http-exception";

export class ContactService {
  static async create(request: CreateContactRequest): Promise<ContactResponse> {
    request = ContactValidation.CREATE.parse(request);

    const contact = await prismaClient.contact.create({
      data: request,
    });

    if (!contact)
      throw new HTTPException(400, {
        message: "contact could not be created",
      });

    return toContactResponse(contact);
  }

  static async get(request: GetContactRequest): Promise<ContactResponse> {
    request = ContactValidation.GET.parse(request);

    const contact = await prismaClient.contact.findFirst({
      where: request,
    });

    if (!contact) throw new HTTPException(403, { message: "unauthorized" });

    return toContactResponse(contact);
  }

  static async update(request: UpdateContactRequest): Promise<ContactResponse> {
    request = ContactValidation.UPDATE.parse(request);

    let data: Prisma.ContactUpdateInput = {};

    if (request.first_name) data = { ...data, first_name: request.first_name };
    if (request.last_name) data = { ...data, last_name: request.last_name };
    if (request.email) data = { ...data, email: request.email };
    if (request.phone) data = { ...data, phone: request.phone };

    const contact = await prismaClient.contact.update({
      where: { username: request.username, id: request.id },
      data,
    });

    if (!contact)
      throw new HTTPException(400, { message: "could not update the contact" });

    return toContactResponse(contact);
  }

  static async delete(request: DeleteContactRequest): Promise<true> {
    request = ContactValidation.DELETE.parse(request);

    const contact = await prismaClient.contact.delete({
      where: {
        username: request.username,
        id: request.id,
      },
    });

    if (!contact)
      throw new HTTPException(400, { message: "could not delete the contact" });

    return true;
  }

  static async search(request: SearchContactRequest): Promise<{
    data: ContactResponse[];
    page: { current_page: number; total_page: number; size: number };
  }> {
    request = ContactValidation.SEARCH.parse(request);
    let query: Prisma.ContactFindManyArgs["where"] = {
      username: request.username,
    };

    if (request.name)
      query = {
        ...query,
        OR: [
          { first_name: { contains: request.name } },
          { last_name: { contains: request.name } },
        ],
      };

    if (request.email) query = { ...query, email: { contains: request.email } };

    if (request.phone)
      query = request.phone.includes(" ")
        ? {
            ...query,
            phone: { contains: request.phone.split(" ").join("") },
          }
        : { ...query, phone: { contains: request.phone } };

    const [contacts, count] = await prismaClient.$transaction([
      prismaClient.contact.findMany({
        skip: (request.page - 1) * request.size,
        take: request.size,
        where: query,
      }),
      prismaClient.contact.count({
        where: query,
      }),
    ]);

    if (!count || !contacts.length)
      throw new HTTPException(400, { message: "contact could not be found" });

    return {
      data: contacts.map((contact) => toContactResponse(contact)),
      page: {
        current_page: request.page,
        total_page: Math.ceil(count / request.size),
        size: request.size,
      },
    };
  }
}
