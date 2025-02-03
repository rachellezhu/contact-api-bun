import { Prisma, User } from "@prisma/client";
import {
  ContactResponse,
  CreateContactRequest,
  DeleteContactRequest,
  SearchContactRequest,
  toContactResponse,
  UpdateContactRequest,
} from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { prismaClient } from "../settings/database";
import { HTTPException } from "hono/http-exception";

export class ContactService {
  static async create(
    user: User,
    request: CreateContactRequest
  ): Promise<ContactResponse> {
    request = ContactValidation.CREATE.parse(request);

    const data = {
      ...request,
      username: user.username,
    };

    const contact = await prismaClient.contact.create({
      data,
    });

    if (!contact)
      throw new HTTPException(400, {
        message: "contact could not be created",
      });

    return toContactResponse(contact);
  }

  static async get(user: User, idContact: number): Promise<ContactResponse> {
    const contact = await prismaClient.contact.findFirst({
      where: {
        username: user.username,
        id: idContact,
      },
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

  static async search(
    user: User,
    queryParams: SearchContactRequest
  ): Promise<{
    data: ContactResponse[];
    page: { current_page: number; total_page: number; size: number };
  }> {
    let query: Prisma.ContactFindManyArgs["where"] = {};

    queryParams = ContactValidation.SEARCH.parse(queryParams);

    // if (!queryParams.size) queryParams.size = 10;
    // if (!queryParams.page) queryParams.page = 1;

    if (queryParams.name)
      query = {
        ...query,
        OR: [
          { first_name: { contains: queryParams.name } },
          { last_name: { contains: queryParams.name } },
        ],
      };

    if (queryParams.email)
      query = { ...query, email: { contains: queryParams.email } };

    if (queryParams.phone)
      query = queryParams.phone.includes(" ")
        ? {
            ...query,
            phone: { contains: queryParams.phone.split(" ").join("") },
          }
        : { ...query, phone: { contains: queryParams.phone } };

    const [contacts, count] = await prismaClient.$transaction([
      prismaClient.contact.findMany({
        skip: (queryParams.page - 1) * queryParams.size,
        take: queryParams.size,
        where: { username: user.username, ...query },
      }),
      prismaClient.contact.count({
        where: { username: user.username, ...query },
      }),
    ]);

    if (!count || !contacts.length)
      throw new HTTPException(400, { message: "contact could not be found" });

    return {
      data: contacts.map((contact) => toContactResponse(contact)),
      page: {
        current_page: queryParams.page,
        total_page: Math.ceil(count / queryParams.size),
        size: queryParams.size,
      },
    };
  }
}
