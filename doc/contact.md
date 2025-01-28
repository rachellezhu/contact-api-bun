# Contact API Spec

## Create Contact

Endpoint: POST /api/contacts

Request Header:

- Authorization: "token"

Request Body:

```json
{
  "first_name": "Rachelle",
  "last_name": "Zhu",
  "email": "example@example.com",
  "phone": "089898989898"
}
```

Response Body (Success):

```json
{
  "data": {
    "id": 69,
    "first_name": "Rachelle",
    "last_name": "Zhu",
    "email": "example@example.com",
    "phone": "089898989898"
  }
}
```

Response Body (Failed):

```json
{
  "errors": "failed to add the contact"
}
```

## Get Contact

Endpoint: GET /api/contacts/{idContact}

Request Header:

- Authorization: "token"

Response Body (Success):

```json
{
  "data": {
    "id": 69,
    "first_name": "Rachelle",
    "last_name": "Zhu",
    "email": "example@example.com",
    "phone": "089898989898"
  }
}
```

Response Body (Failed):

```json
{
  "errors": "failed to get the contact"
}
```

## Update Contact

Endpoint: PUT /api/contacts/{idContact}

Request Header:

- Authorization: "token"

Request Body:

```json
{
  "first_name": "Rachelle",
  "last_name": "Zhu",
  "email": "example@example.com",
  "phone": "089898989898"
}
```

Response Body (Success):

```json
{
  "data": {
    "id": 69,
    "first_name": "Rachelle",
    "last_name": "Zhu",
    "email": "example@example.com",
    "phone": "089898989898"
  }
}
```

Response Body (Failed):

```json
{
  "errors": "failed to update the contact"
}
```

## Remove Contact

Endpoint: DELETE /api/contacts/{idContact}

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
  "errors": "failed to delete the contact"
}
```

## Search Contact

Endpoint: GET /api/contacts

Request Header:

- Authorization: "token"

Query Parameter:

- name: string, either first_name or last_name
- email: string
- phone: string
- page: number, page index (default 1)
- size: number, data per page (default 10)

Response Body (Success):

```json
{
  "data": [
    {
      "id": 69,
      "first_name": "Rachelle",
      "last_name": "Zhu",
      "email": "example@example.com",
      "phone": "089898989898"
    },
    {
      "id": 70,
      "first_name": "Roy",
      "last_name": "Sai",
      "email": "roy@example.com",
      "phone": "081111111111"
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
  "errors": "no contact can be found"
}
```
