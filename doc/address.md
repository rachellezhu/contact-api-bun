# Address API Spec

## Create Address

Endpoint: POST /api/contacts/{idContact}/addresses

Request Header:

- Authorization: "token"

Request Body:

```json
{
  "street": "Ngalor Street",
  "city": "Lard City",
  "province": "Iwak",
  "country": "Indie",
  "postal_code": "69699"
}
```

Response Body (Success):

```json
{
  "data": {
    "id": 69,
    "street": "Ngalor Street",
    "city": "Lard City",
    "province": "Iwak",
    "country": "Indie",
    "postal_code": "69699"
  }
}
```

Response Body (Failed):

```json
{
  "errors": "address could not be created"
}
```

## Get Address

Endpoint: GET /api/contacts/{idContact}/addresses/{idAddress}

Request Header:

- Authorization: "token"

Response Body (Success):

```json
{
  "data": {
    "id": 69,
    "street": "Ngalor Street",
    "city": "Lard City",
    "province": "Iwak",
    "country": "Indie",
    "postal_code": "69699"
  }
}
```

Response Body (Failed):

```json
{
  "errors": "address could not be found"
}
```

## Update Address

Endpoint: PUT /api/contacts/{idContact}/addresses/{idAddress}

Request Header:

- Authorization: "token"

Request Body:

```json
{
  "street": "Edited Ngalor Street",
  "city": "Updated City",
  "province": "Replaced Iwak",
  "country": "Indie",
  "postal_code": "96969"
}
```

Response Body (Success):

```json
{
  "data": {
    "id": 69,
    "street": "Edited Ngalor Street",
    "city": "Updated City",
    "province": "Replaced Iwak",
    "country": "Indie",
    "postal_code": "96969"
  }
}
```

Response Body (Failed):

```json
{
  "errors": "address could not be updated"
}
```

## Delete Address

Endpoint: DELETE /api/contacts/{idContact}/addresses/{idAddress}

Request Header:

- Authorization: "token"

Response Body (Success):

```json
{
  "data": true
}
```

Response Body (Failed):

```json
{
  "errors": "address could not be deleted"
}
```

## List Address

Endpoint: GET /api/contacts/{idContact}/addresses

Request Header:

- Authorization: "token"

Query Parameter:

- page: number, page index (default 1)
- size: number, data per page (default 10)

Response Body (Success):

```json
{
  "data": [
    {
      "id": 69,
      "street": "Ngalor Street 12",
      "city": "Actually City",
      "province": "Iwak",
      "country": "Indie",
      "postal_code": "69699"
    },
    {
      "id": 70,
      "street": "Edited Ngalor Street",
      "city": "Updated City",
      "province": "Replaced Iwak",
      "country": "Indie",
      "postal_code": "96969"
    }
  ],
  "page": {
    "current_page": 1,
    "total_page": 5,
    "size": 10
  }
}
```

Response Body (Failed):

```json
{
  "errors": "no address could be found"
}
```
