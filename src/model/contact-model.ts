import { Contact } from "@prisma/client";

export type CreateContactRequest = {
  username: string;
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
};

export type ContactResponse = {
  id: number;
  first_name: string;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
};

export type GetContactRequest = {
  id: number;
  username: string;
};

export type UpdateContactRequest = {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
};

export type DeleteContactRequest = {
  id: number;
  username: string;
};

export type SearchContactRequest = {
  username: string;
  name?: string;
  email?: string;
  phone?: string;
  page: number;
  size: number;
};

export function toContactResponse(contact: Contact): ContactResponse {
  return {
    id: contact.id,
    first_name: contact.first_name,
    last_name: contact.last_name,
    email: contact.email,
    phone: contact.phone,
  };
}
