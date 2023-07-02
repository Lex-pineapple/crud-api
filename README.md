# CRUD API

This is a simple CRUD API using in-memory database underneath.

The additional packages used for testing are: _supertest_ and _start-server-and-test_.

To start the applications in development mode:

```
npm run start:dev
```

To start the application in production mode (starts the build process and then runs the bundled file):

```
npm rn start:prod
```

To start multiple instances of application:

```
npm run start:multi
```

To simultaneously start server and run tests:

```
npm run test:ci
```

To run tests (the server has to be started separately):

```
npm run test
```

### Implemented endpoint - api/users

- **GET** api/users - to get all records
- **GET** api/users/{userId} - to get specific user

* **POST** api/users - to create a record about new user and store it in the database
* **PUT** api/users/{userId} - to update existing user
* **DELETE** api/users/{userId} - to delete existing user from database

Users have following properties:

- **id** — unique identifier (string, uuid) generated on server side
- **username** — user's name (string, required)
- **age** — user's age (number, required)
- **hobbies** — user's hobbies (array of strings or empty array, required)
