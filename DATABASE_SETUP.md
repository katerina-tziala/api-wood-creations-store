# Database Setup

In order to run the app you must have a database up and running. In this document you will find the instructions on how to install, run and connect to the database(s) of this app. You can either run the database through docker or host it locally.
The choice is yours! Just make sure you do not use both setups interchangeably.

## Set Up Environment

In the .env file you must create the following variables:

```
POSTGRES_HOST = 
POSTGRES_PORT = 
POSTGRES_DB = 
POSTGRES_DB_TEST = 
POSTGRES_USER = 
POSTGRES_PASSWORD = 
```

The default setting used for development and testing (but not in production) can be found in the [example.env](https://github.com/katerina-tziala/api-wood-creations-store/blob/master/example.env) file. Make sure you complete the values for all aforementioned variables.

## Set Up Database in a Docker Container

If you want to run the database in a docker container make sure you can use [docker](https://www.docker.com/get-started).

To set up the databases for the project open a terminal, navigate to the root directory of the project and run:

` docker-compose up `

The **_docker-compose.yml_** file will handle the installation. Docker-Compose will only download the image the first time you run this command.

Now postgres server is running in a docker container.

1. In a new terminal, navigate to the root directory of the project and run the following command to drop into the container shell (psql): ` docker-compose run database bash `
2. To connect to the database run:
    
    ` psql --host=database --username=<POSTGRES_USER> --dbname=<POSTGRES_DB | POSTGRES_DB_TEST> `
    
    And use the password you already set in the **_.env_** file (_POSTGRES_PASSWORD_).
    
     **Note:** When setting up the databases, you will not be able to connect to _POSTGRES_DB_TEST_ since it does not exist yet!
    
3. Then, grant all privileges to your user for the _POSTGRES_DB_:

     ` GRANT ALL PRIVILEGES ON DATABASE <POSTGRES_DB> TO <POSTGRES_USER>; `


### Create the Testing Database

In the psql shell create the database for testing and grant all privileges to your user:

1. Create the database for testing:

   `CREATE DATABASE <POSTGRES_DB_TEST>;`

2. Grant all privileges to your user:

   ``` 
   \c <POSTGRES_DB_TEST>
   
   GRANT ALL PRIVILEGES ON DATABASE <POSTGRES_DB_TEST> TO <POSTGRES_USER>;
   ```

### Docker Volumes

Docker-Compose helps us manage creating and destroying the named volumes. These volumes allow the data to persist even if we destroy the containers.
To tell Docker-Compose to destroy the volume and its data, you need to run in the root directory of the project:

` docker-compose down --volumes `

## Set Up Database Locally

If you want to run the database locally, kind of like localhost, then make sure you have installed [postgres](https://www.postgresql.org/download/).
Make sure postgres server is running and open a psql terminal.

1. To connect to the database run:
    ` psql -U postgres `

2. To create the database user run:
    ` CREATE USER <POSTGRES_USER> WITH PASSWORD <POSTGRES_PASSWORD>; `

    _Do not forget to use single quotes for the password._

3. Create the development and testing databases:

    ```
    CREATE DATABASE <POSTGRES_DB | POSTGRES_DB_TEST>;
    ```

4. Connect to the databases and grant all privileges

   ```
   \c <POSTGRES_DB | POSTGRES_DB_TEST>
   
   GRANT ALL PRIVILEGES ON DATABASE <POSTGRES_DB | POSTGRES_DB_TEST> TO <POSTGRES_USER>;
   ```

To connect to each one of the databases you can run

` psql --username=<POSTGRES_USER> --dbname=<POSTGRES_DB | POSTGRES_DB_TEST> `;

## PSQL Meta Commands Cheat Sheet

- ` \l ` List databases

- ` \c ` Connect to a database

- ` \dt ` Display Tables in a database

- ` \q ` Quit out of psql to normal terminal
