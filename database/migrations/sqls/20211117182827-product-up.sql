CREATE TABLE product(
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES category(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL CONSTRAINT name_min_length CHECK (char_length(name) >= 3),
    price NUMERIC(10,2) NOT NULL CONSTRAINT positive_price CHECK (price > 0),
    description text
);