import { User } from "@prisma/client";
import {
  ContactResponse,
  CreateContactRequest,
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

    const query = {
      ...request,
      username: user.username,
    };

    const contact = await prismaClient.contact.create({
      data: query,
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

  static async update(
    user: User,
    request: UpdateContactRequest,
    idContact: number
  ): Promise<ContactResponse> {
    request = ContactValidation.UPDATE.parse(request);

    let query = {};

    if (request.first_name)
      query = { ...query, first_name: request.first_name };
    if (request.last_name) query = { ...query, last_name: request.last_name };
    if (request.email) query = { ...query, email: request.email };
    if (request.phone) query = { ...query, phone: request.phone };

    const contact = await prismaClient.contact.update({
      where: { username: user.username, id: idContact },
      data: query,
    });

    if (!contact)
      throw new HTTPException(400, { message: "could not update the contact" });

    return toContactResponse(contact);
  }
}
