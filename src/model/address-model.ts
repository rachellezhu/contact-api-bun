import { Address } from "@prisma/client";

export type CreateAddressRequest = {
  contact_id: number;
  street?: string | null;
  city?: string | null;
  province?: string | null;
  country: string;
  postal_code: string;
};

export type AddressResponse = {
  id: number;
  street?: string | null;
  city?: string | null;
  province?: string | null;
  country: string;
  postal_code: string;
};

export type GetAddressRequest = {
  id: number;
  contact_id: number;
};

export type UpdateAddressRequest = {
  street?: string | null;
  city?: string | null;
  province?: string | null;
  country?: string;
  postal_code?: string;
};

export type DeleteAddressRequest = {
  id: number;
  contact_id: number;
};

export type ListAddressRequest = {
  contact_id: number;
  page: number;
  size: number;
};

export function toAddressResponse(address: Address): AddressResponse {
  return {
    id: address.id,
    street: address.street,
    city: address.city,
    province: address.province,
    country: address.country,
    postal_code: address.postal_code,
  };
}
