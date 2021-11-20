CREATE TABLE product(
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES category(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) CONSTRAINT positive_price CHECK (price > 0),
    description text
);