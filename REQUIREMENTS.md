# API Requirements

The "Wood Creations" company stakeholders want to create an online storefront to showcase their great product creations. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. Administrators should also be able to manage users, categories and products of the store.

These are the notes that describe the endpoints of the API, as well as the data contracts the frontend and backend have agreed upon to meet the requirements of the application.

## API Endpoints

There are 4 main routes in the API: users, categories, products and orders. All the endpoints of the API are under the route **/api**.

#### Users

**[POST] /users/authenticate/**

_Request Headers_

Content-Type: application/json

_Request Body_

```
{
    "username": "admin",
    "password": "root"
}
```


* **Success Response:**
  
  <_What should the status code be on success and is there any returned data? This is useful when people need to to know what their callbacks should expect!_>

  * **Code:** 200 <br />
    **Content:** `{ id : 12 }`
 
* **Error Response:**

  <_Most endpoints will have many ways they can fail. From unauthorized access, to wrongful parameters etc. All of those should be liste d here. It might seem repetitive, but it helps prevent assumptions from being made where they should be._>

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "Log in" }`

  OR

  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    **Content:** `{ error : "Email Invalid" }`

#### [GET] /users

#### [GET] /users/:id

#### [POST] /users/

#### [PATCH] /users/:id

#### [DELETE] /users/:id

### CATEGORIES

#### [GET] /categories

#### [GET] /categories/:id

#### [POST] /categories

#### [PATCH] /categories/:id

#### [DELETE] /categories/:id

### PRODUCTS

#### [GET] /products

#### [GET] /products/:id

#### [GET] /products/category/:id

#### [GET] /products/top-five

#### [POST] /products

#### [PATCH] /products/:id

#### [DELETE] /products/:id

### ORDERS

#### [GET] /orders

#### [GET] /orders/current

#### [GET] /orders/completed

#### [POST] /orders

#### [POST] /orders/item

#### [PATCH] /orders/item/:id

#### [DELETE] /orders/item/:id

#### [PATCH] /orders/current/complete

#### [DELETE] /orders/current/complete

## Data Contracts

#### Product

- id
- name
- price
- [OPTIONAL] category

#### User

- id
- firstName
- lastName
- password

#### Orders

- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

## Database Schema

The following diagram depicts the database schema that address the API endpoints and data contracts above:

<p align="center">
    <img src="https://github.com/katerina-tziala/api-wood-creations-store/blob/master/docs/wood-creations-store.png" alt="database-schema" width="100%" height="auto">
</p>
