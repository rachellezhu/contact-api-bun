# User API Spec

## Register User

Endpoint: POST /api/users

Request Body:

```json
{
  "username": "rachelle",
  "password": "pass1234",
  "full_name": "Rachelle Zhu"
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "rachelle",
    "full_name": "Rachelle Zhu"
  }
}
```

Response Body (Failed):

```json
{
  "errors": "username must not be empty"
}
```

## Login User

Endpoint: POST /api/users/login

Request Body:

```json
{
  "username": "rachelle",
  "password": "pass1234"
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "rachelle",
    "full_name": "Rachelle Zhu",
    "token": "fasdoif23412joifdhasdifas.dfa"
  }
}
```

Response Body (Failed):

```json
{
  "errors": "username or password is invalid"
}
```

## Get User

Endpoint: GET /api/users/current

Request Header:

- Authorization: "token"

Response Body (Success):

```json
{
  "data": {
    "username": "rachelle",
    "full_name": "Rachelle Zhu"
  }
}
```

```json
{
  "error": "user does not exist"
}
```

## Update User

Endpoint: PATCH /api/users/current

Request Header:

- Authorization: "token"

Request Body:

```json
{
  "full_name": "Rachelle Test",
  "password": "test1234"
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "rachelle",
    "full_name": "Rachelle Test"
  }
}
```

Response Body (Failed):

```json
{
  "errors": "password must contain aplhabet and number"
}
```

## Logout User

Endpoint: DELETE /api/users/current

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
  "errors": "failed to logout"
}
```
