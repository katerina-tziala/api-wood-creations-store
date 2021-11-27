CREATE TYPE user_role AS ENUM ('Customer', 'Admin');
CREATE TABLE store_user(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL CONSTRAINT firstname_min_length CHECK (char_length(firstname) >= 3),
    lastname VARCHAR(50) NOT NULL CONSTRAINT lastname_min_length CHECK (char_length(lastname) >= 3),
    username VARCHAR(50) NOT NULL UNIQUE CONSTRAINT username_min_length CHECK (char_length(username) >= 4),
    password VARCHAR(200) NOT NULL CONSTRAINT password_min_length CHECK (char_length(password) >= 4),
    role user_role NOT NULL DEFAULT 'Customer'
);