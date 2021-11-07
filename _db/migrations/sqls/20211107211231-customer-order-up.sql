CREATE TYPE orderStatus AS ENUM ('active', 'complete');
CREATE TABLE customer_order (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES store_user(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    status orderStatus NOT NULL DEFAULT 'active',
    comments text,
    created_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);