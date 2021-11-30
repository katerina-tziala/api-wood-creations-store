# :rocket: Wood Creations Store RESTful API

A RESTful API for an online wood creations store.

The database schema, the data contracts and the exposed API endpoints can be found in the [REQUIREMENTS.md](https://github.com/katerina-tziala/api-wood-creations-store/blob/master/REQUIREMENTS.md)

## Prerequisites

Node version >= 12.13.0
[PostgreSQL](https://www.postgresql.org/) or [Docker](https://www.docker.com/).

## Technologies

Here’s a high level list of the technologies used for this app:

- **For Development:** [Node.js v16.13.0](https://nodejs.org/en/), [TypeScript](https://www.typescriptlang.org/) and [PostgreSQL v14](https://www.postgresql.org/download/)

- **For Testing:** [Jasmine](https://www.npmjs.com/package/jasmine)

- **For Code Styling:** [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/)

## Running the App

1. Fork and clone this repository.

2. To install the dependencies of the app, run in the project directory `npm install` or `npm i`.

3. In the root directory of the project create a **_.env_** file based on the [example.env](https://github.com/katerina-tziala/api-wood-creations-store/blob/master/example.env).
   The default values of the environment variables are already provided.

4. Set up the databases for development and testing as described in the [DATABASE_SETUP.md](https://github.com/katerina-tziala/api-wood-creations-store/blob/master/DATABASE_SETUP.md).

5. Make sure your database is up and running

6. To run the app, in the project directory run: `npm run dev`.

## Code Quality and Testing

The commands to check the code quality and test the api must be run in the project directory.

### Code Quality

The preferred settings for the coding style of the app can be fount in the [.prettierrc](https://github.com/katerina-tziala/api-wood-creations-store/blob/master/.prettierrc) and [.eslintrc](https://github.com/katerina-tziala/api-wood-creations-store/blob/master/.eslintrc) files.

To check the code consistensy to the chosen coding style run `npm run prettier-check`.

To apply the chosen coding style run `npm run prettier`.

To lint the app run `npm run lint`.

### Testing

To test the app run in the project directory `npm run test`.

In order to test the endpoints through the [REST Client plugin for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=humao.rest-client), use the provided [endpoints.rest](https://github.com/katerina-tziala/api-wood-creations-store/blob/master/docs/endpoints.rest) file.

In order to test the endpoints through [Postman](https://www.postman.com/) install the app and import both the [environment](https://github.com/katerina-tziala/api-wood-creations-store/blob/master/docs/WoodCreationsStore.postman_environment.json) and the [collection](https://github.com/katerina-tziala/api-wood-creations-store/blob/master/docs/WoodCreationsStore.postman_collection.json). Make sure you the imported environment is selected when sending the requests.
