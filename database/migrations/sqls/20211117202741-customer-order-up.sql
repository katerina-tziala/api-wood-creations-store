CREATE TYPE order_status AS ENUM ('Active', 'Complete');
CREATE TABLE customer_order (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES store_user(id) ON DELETE RESTRICT,
    status order_status NOT NULL DEFAULT 'Active',
    comments text,
    created_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ
);