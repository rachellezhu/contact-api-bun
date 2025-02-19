# Simple Contact API Using Hono (Bun)

To reproduce:

- Create database (MySQL)
- Copy .env.example and rename copied file into .env
- In .env file, set `DATABASE_URL` to `mysql://DATABASE_USER:DATABASE_PASSWORD@DATABASE_HOST:PORT/YOUR_DATABASE_NAME`. eg. `DATABASE_URL=mysql://root:@localhost:3306/database_api`

To install dependencies:

```sh
bun install
bunx prisma generate
bunx prisma migrate dev --name init
```

To run:

```sh
bun run dev
```

Open <http://localhost:3000>

See [doc](https://github.com/rachellezhu/contact-api-bun/tree/master/doc) folder for the API specs.

If you want to run the distribution file using docker, execute command below:
```sh
docker compose up
```
