CREATE TABLE order_item(
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES customer_order(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES product(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CONSTRAINT positive_quantity CHECK (quantity > 0),
    engraving VARCHAR(200)
);