CREATE TABLE order_item(
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES customer_order(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    product_id INTEGER REFERENCES product(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    quantity INTEGER CONSTRAINT positive_quantity CHECK (quantity > 0),
    engraving VARCHAR(200)
);