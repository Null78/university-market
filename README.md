# University Market project

## Framework and Tools
- [Nextjs](https://nextjs.org/docs): A full stack framework (frontend + backend)
- [Prisma](https://www.prisma.io/docs/orm): Database ORM (the library that communicate with the database)
- TypeScript: Javascript with small extra features (such as types and interfaces)
- MySQL: the database used

## Getting Started using Docker

### Dependencies
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Make](https://medium.com/@samsorrahman/how-to-run-a-makefile-in-windows-b4d115d7c516)
or run this command `winget install GnuWin32.Make`
- [Postman](https://www.postman.com/downloads/) or [Insomnia](https://insomnia.rest/) or [RapidAPI](https://rapidapi.com/products/vs-code-rapidapi-client/) or generally any API Client

First run:

```bash
make up
```

then open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

to access the shell inside the container you can run:
```bash
make
```

or you can restart the containers by running:
```bash
make up-recreate
```

you can also connect to the MySQL server on `localhost:3306` using these credentials: 
- username: `root`
- password: `root`

## Getting Started locally

### Dependencies
- [Nodejs](https://nodejs.org/en)
- [MySQL](https://dev.mysql.com/downloads/installer/)
or use **XAMPP**
- [Postman](https://www.postman.com/downloads/) or [Insomnia](https://insomnia.rest/) or [RapidAPI](https://rapidapi.com/products/vs-code-rapidapi-client/) or generally any API Client

After you download the project, run:

```bash
npm install
```

and then make sure variables in `.env` file match with the database credentials 
```bash
DATABASE_URL="mysql://app:password@mysql:3306/upm-market"

DB_USERNAME="app"
DB_PASSWORD="password"
DB_DATABASE="upm-market"
```
please make sure you also updated the `DATABASE_URL` variable like this (without `{}`):
```bash
DATABASE_URL="mysql://{USERNAME}:{PASSWORD}@mysql:{PORT}/{DATABASE NAME}"
```

after you're done, make sure to run these two commands
```bash
npx prisma generate
```

```bash
npx prisma db push --force-reset
```

then run:

```bash
npm run dev
```

then open [http://localhost:3000](http://localhost:3000) with your browser to see the result.