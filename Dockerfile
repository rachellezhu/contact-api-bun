FROM oven/bun:latest

WORKDIR /app

COPY package.json ./

RUN bun install

COPY . .

RUN bunx prisma generate

ENV DATABASE_URL=mysql://root:examplepassword@contact-api-bun-db:3306/contact_api

RUN bun build src/index.ts --compile --outfile contact-api

EXPOSE 3000

CMD ["./contact-api"]
