CREATE TYPE user_role AS ENUM ('Customer', 'Admin');
CREATE TABLE store_user(
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    role user_role NOT NULL DEFAULT 'Customer'
);