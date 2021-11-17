
INSERT INTO product(id, category_id, name, price, description)
VALUES (1, 1, 'earrings dark wood', 12.5, 'dark wood earrings for women');

INSERT INTO product(id, category_id, name, price, description)
VALUES (2, 1, 'bracelet', 15, 'dark wood bracelet for men');

INSERT INTO product(id, category_id, name, price, description)
VALUES (3, 1, 'bow tie', 18, 'light wood bow tie for men');

INSERT INTO product(id, category_id, name, price, description)
VALUES (4, 1, 'aviator watch', 120, 'light wood watch');

INSERT INTO product(id, category_id, name, price)
VALUES (5, 2, 'calendar', 20);

INSERT INTO product(id, category_id, name, price)
VALUES (6, 2, 'mousepad', 12);

INSERT INTO product(id, category_id, name, price, description)
VALUES (7, 2, 'pencil container', 8.6, 'pencil container for kids');

INSERT INTO product(id, category_id, name, price, description)
VALUES (8, 2, 'rule', 5.6, 'rule witm metrics in inches and cm');

INSERT INTO product(id, category_id, name, price)
VALUES (9, 2, 'bookmark', 9);

INSERT INTO product(id, category_id, name, price, description)
VALUES (10, 3, 'christmas ball', 12, 'christmas tree wooden ball');

INSERT INTO product(id, category_id, name, price)
VALUES (11, 4, 'photo frame', 20);

INSERT INTO product(id, category_id, name, price)
VALUES (12, 4, 'memory box', 32);

ALTER SEQUENCE product_id_seq RESTART WITH 13;