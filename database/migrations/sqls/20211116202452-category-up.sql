CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL UNIQUE CONSTRAINT name_min_length CHECK (char_length(name) >= 3)
);