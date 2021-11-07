CREATE TABLE product(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC CONSTRAINT positive_price CHECK (price > 0),
    sub_category_id INTEGER REFERENCES sub_category(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    description text
);