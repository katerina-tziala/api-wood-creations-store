# API Requirements

The [Wood Creations](https://www.instagram.com/manukhantu/) company stakeholders want to create an online storefront to showcase their great product creations.

Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page.

Administrators should also be able to manage users, categories and products of the store.

These are the notes that describe the endpoints of the API, the [database schema](#database-schema) and the [data contracts](#data-contracts) the frontend and backend have agreed upon to meet the requirements of the application.

## API Endpoints

There are 4 main routes in the RESTful API: users, categories, products and orders. All the endpoints of the API are under the route **/api**.

The following list is an overview of the exposed endpoints. More details for each endpoint can be found at the end of this document, in the [API Endpoints Details section](#api-endpoints-details).

### Users

- [[POST] /users/authenticate/](#post-usersauthenticate)

  _Authenticates a user and provides access_

- [[GET] [Token] /users](#get-users)

  _Provides a list of all users_

- [[GET] [Token] /users/:id](#get-usersid)

  _Returns the requested user including the current order and the 5 most recent completed orders_

- [[POST] /users](#post-users)

  _Creates a user_

- [[PATCH] [Token] /users](#patch-users)

    _Updates the authorized user and returns the updated user_

- [[DELETE] [Token] /users/:id](#delete-usersid)

  _Deletes the customer with the specified id_

### Categories

- [[GET] [Token] /categories](#get-categories)

  _Provides a list with the categories of the products_

- [[GET] [Token] /categories/:id](#get-categoriesid)

  _Returns the category with the specified id_

- [[POST] [Token] /categories](#post-categories)

  _Creates a new category_

- [[PATCH] [Token] /categories/:id](#patch-categoriesid)

  _Updates the category with the specified id_

- [[DELETE] [Token] /categories/:id](#delete-categoriesid)

  _Deletes the category with the specified id_

### Products

- [[GET] /products](#get-products)

  _Provides a list of all products_

- [[GET] /products/top-five](#get-productstop-five)

  _Provides a list of the 5 most popular products (most commonly ordered)_

- [[GET] /products/:id](#get-productsid)

  _Returns the product with the specified id_

- [[GET] /products/category/:id](#get-productscategoryid)

  _Provides a list of all products that belong in the specified category_

- [[POST] [Token] /products](#post-products)

  _Creates a new product_

- [[PATCH] [Token] /products/:id](#patch-productsid)

  _Updates the product with the specified id_

- [[DELETE] [Token] /products/:id](#delete-productsid)

  _Deletes the product with the specified id_

### Orders

- [[GET] [Token] /orders](#get-orders)

  _Provides a list of all orders of the user_

- [[GET] [Token] /orders/current](#get-orderscurrent)

  _Returns the current order of the user_

- [[GET] [Token] /orders/completed](#get-orderscompleted)

  _Provides a list of all completed orders of the user_

- [[POST] [Token] /orders](#post-orders)

  _Creates a new order for the user_

- [[POST] [Token] /orders/item](#post-ordersitem)

  _Adds a new order item in the current active order of the user_

- [[PATCH] [Token] /orders/item](#patch-ordersitem)

  _Updates an order item in the current active order of the user_

- [[DELETE] [Token] /orders/item/:id](#delete-ordersitemid)

  _Deletes the order item with the specified id in the current active order of the user_

- [[PATCH] [Token] /orders/current/complete](#patch-orderscurrentcomplete)

  _Completes the current active order of the user_

- [[DELETE] [Token] /orders/current/complete](#delete-orderscurrentcomplete)

  _Deletes the current active order of the user_



## Data Contracts

The following data contracts specify the expected structure of the data returned from the API endpoints.

### Category

```

{
  id: number;
  name: string;
}

```

### Product

```

{
  id: number;
  name: string;
  price: string;
  category_id: number;
  category?: string;
  description?: string | null;
}

```

### Order

```

{
  id: number;
  customer_id: number;
  status: Active | Complete;
  created_at: Date | string;
  completed_at?: Date | string | null;
  comments?: string | null;
  total?: string | null;
  number_of_products?: string | null;
  items?: [
    {
      id: number;
      order_id: number;
      product_id: number;
      quantity: number;
      engraving?: string | null;
      name?: string;
      price?: string;
      category_id?: number;
      description?: string;
    },
    ...
  ];
}

```

### User

```
{
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  role: Admin | Customer;
  password?: string | null;
  recentOrders?: Order[];
  currentOrder?: Order;
}
```

## Database Schema

The following diagram depicts the database schema that address the API endpoints and data contracts above:

<p align="center">
    <img src="https://github.com/katerina-tziala/api-wood-creations-store/blob/master/docs/wood-creations-store.png" alt="database-schema" width="100%" height="auto">
</p>


## API Endpoints Details

Success and error responses are described for special cases. In the **_Request Headers:_** the required headers for each request can be found.

Endpoints with the header

```
  Authorization: Bearer <accessToken>
```

require token authentication to be acccessed.

### Users

#### **[POST] /users/authenticate**

Authenticates a user and provides access.

- **_Request Headers:_**
  ```
  Content-Type: application/json
  ```
- **_Request Body:_**

  ```
  {
      "username": string,
      "password": string
  }
  ```

- **_Success Response:_**

  Status Code: _200 OK_

  Content: `{ "accessToken": string }`

- **_Error Response:_**

  - Status Code: _400 Bad Request_

    Content:

    ```
    {
        "error": "CREDENTIALS_REQUIRED" | "USERNAME_REQUIRED" | "USERNAME_TOO_SHORT" | "PASSWORD_REQUIRED" | "PASSWORD_TOO_SHORT"
    }
    ```

  - Status Code: _401 Unauthorized_

    Content: `{ "error": "WRONG_CREDENTIALS" }`

#### **[GET] /users**

Provides a list of all users. Available only for authenticated users with the **_Admin_** role.

- **_Request Headers:_**

  ```
  Content-Type: application/json
  Authorization: Bearer <accessToken>
  ```

#### **[GET] /users/:id**

Returns the requested user including the current order and the 5 most recent completed orders. Available only for authenticated users with the **_Admin_** role.

- **_Request Headers:_**
  ```
  Content-Type: application/json
  Authorization: Bearer <accessToken>
  ```
- **_Error Response:_**

  - Status Code: _400 Bad Request_

    Content: `{ "error": "INVALID_USER_ID" }`

  - Status Code: _403 Forbidden_

    Content: `{ "error": "FORBIDDEN_FOR_CUSTOMER" }`

  - Status Code: _404 Not Found_

    Content: `{ "error": "NOT_FOUND" }`

#### **[POST] /users**

Creates a user. Creating a user with the **_Admin_** role is not allowed.

- **_Request Headers:_**
  ```
  Content-Type: application/json
  ```
- **_Request Body:_**

  ```
  {
      "firstname": string,
      "lastname": string,
      "username": string,
      "password": string
  }
  ```

- **_Error Response:_**

  - Status Code: _400 Bad Request_
    Content:

    ```
    {
        "error": "DATA_REQUIRED" | "USERNAME_REQUIRED" | "USERNAME_TOO_SHORT" | "PASSWORD_REQUIRED" | "PASSWORD_TOO_SHORT" | "FIRSTNAME_REQUIRED" | "FIRSTNAME_TOO_SHORT" | "LASTNAME_REQUIRED" | "LASTNAME_TOO_SHORT"
    }
    ```

#### **[PATCH] /users**

Updates the authorized user and returns the updated user.

- **_Request Headers:_**
  ```
  Content-Type: application/json
  Authorization: Bearer <accessToken>
  ```
- **_Request Body:_**

  At least one of the following is required.

  ```
  {
    "firstname"?: string,
    "lastname"?: string,
    "username"?: string,
    "password"?: string
   }
  ```

- **_Error Response:_**

  - Status Code: _400 Bad Request_
    Content:

    ```
    {
        "error": "DATA_REQUIRED" | "USERNAME_REQUIRED" | "USERNAME_TOO_SHORT" | "PASSWORD_REQUIRED" | "PASSWORD_TOO_SHORT" | "FIRSTNAME_REQUIRED" | "FIRSTNAME_TOO_SHORT" | "LASTNAME_REQUIRED" | "LASTNAME_TOO_SHORT"
    }
    ```

#### **[DELETE] /users/:id**

Deletes the user with the specified id if the user exists and the user does not have the **_Admin_** role. Available only for authenticated users with the **_Admin_** role.

- **_Request Headers:_**

  ```
  Content-Type: application/json
  Authorization: Bearer <accessToken>
  ```

- **_Success Response:_**

  Status Code: _204 No Content_

- **_Error Response:_**

  - Status Code: _400 Bad Request_

    Content: `{ "error": "INVALID_USER_ID" }`

  - Status Code: _403 Forbidden_

    Content: `{ "error": "FORBIDDEN_FOR_CUSTOMER" | "ADMIN_DELETION_FORBIDDEN" }`

  - Status Code: _404 Not Found_

    Content: `{ "error": "NOT_FOUND" }`

### Categories

Categories can only be managed for authenticated users with the **_Admin_** role. When users with the **_Customer_** role try to access the endpoind they will get an error response:

Status Code: _403 Forbidden_

Content: `{ "error": "FORBIDDEN_FOR_CUSTOMER" }`

#### **[GET] /categories**

Provides a list with the categories of the products.

- **_Request Headers:_**
  ```
  Content-Type: application/json
  Authorization: Bearer <accessToken>
  ```

#### **[GET] /categories/:id**

Returns the category with the specified id.

- **_Request Headers:_**
  ```
  Content-Type: application/json
  Authorization: Bearer <accessToken>
  ```
- **_Error Response:_**

  - Status Code: _400 Bad Request_

    Content: `{ "error": "INVALID_CATEGORY_ID" }`

  - Status Code: _404 Not Found_

    Content: `{ "error": "NOT_FOUND" }`

#### **[POST] /categories**

Creates a new category.

- **_Request Headers:_**
  ```
  Content-Type: application/json
  Authorization: Bearer <accessToken>
  ```
- **_Request Body:_**

  ```
  {
      "name": string
  }
  ```

- **_Error Response:_**

  - Status Code: _400 Bad Request_

    Content: `{ "error": "NAME_REQUIRED" | "NAME_TOO_SHORT" }`

  - Status Code: _404 Not Found_

    Content: `{ "error": "NOT_FOUND" }`

#### **[PATCH] /categories/:id**

Updates the category with the specified id.

- **_Request Headers:_**
  ```
  Content-Type: application/json
  Authorization: Bearer <accessToken>
  ```
- **_Request Body:_**

  ```
  {
      "name": string
  }
  ```

- **_Error Response:_**

  - Status Code: _400 Bad Request_

    Content: `{ "error": "INVALID_CATEGORY_ID" | "NAME_REQUIRED" | "NAME_TOO_SHORT" }`

  - Status Code: _404 Not Found_

    Content: `{ "error": "NOT_FOUND" }`

#### **[DELETE] /categories/:id**

Deletes the category with the specified id.

- **_Request Headers:_**

  ```
  Content-Type: application/json
  Authorization: Bearer <accessToken>
  ```

- **_Success Response:_**

  Status Code: _204 No Content_

- **_Error Response:_**

  - Status Code: _400 Bad Request_

    Content: `{ "error": "INVALID_CATEGORY_ID" }`

  - Status Code: _404 Not Found_

    Content: `{ "error": "NOT_FOUND" }`

### Products

#### **[GET] /products**

Provides a list of all products.

- **_Request Headers:_**
  ```
  Content-Type: application/json
  ```

#### **[GET] /products/top-five**

Provides a list of the 5 most popular products (most commonly ordered).

- **_Request Headers:_**
  ```
  Content-Type: application/json
  ```

#### **[GET] /products/:id**

Returns the product with the specified id.

- **_Request Headers:_**
  ```
  Content-Type: application/json
  ```
- **_Error Response:_**

  - Status Code: _400 Bad Request_

    Content: `{ "error": "INVALID_PRODUCT_ID"}`

  - Status Code: _404 Not Found_

    Content: `{ "error": "NOT_FOUND" }`

#### **[GET] /products/category/:id**

Provides a list of all products that belong in the specified category.

- **_Request Headers:_**

  ```
  Content-Type: application/json
  ```

- **_Error Response:_**

  - Status Code: _400 Bad Request_

    Content: `{ "error": "INVALID_CATEGORY_ID"}`

#### **[POST] /products**

Creates a new product. Available only for authenticated users with the **_Admin_** role.

- **_Request Headers:_**
  ```
  Content-Type: application/json
  Authorization: Bearer <accessToken>
  ```
- **_Request Body:_**

  ```
  {
    "name": string,
    "price": string,
    "category_id": number,
    "description": string | null
  }
  ```

- **_Error Response:_**

  - Status Code: _400 Bad Request_
    Content:

    ```
    {
        "error": "DATA_REQUIRED" | "NAME_REQUIRED" | "NAME_TOO_SHORT" | "PRICE_REQUIRED" | "PRICE_MUST_BE_POSITIVE" | "INVALID_NUMBER_CATEGORY_ID"
    }
    ```

#### **[PATCH] /products/:id**

Updates the product with the specified id. Available only for authenticated users with the **_Admin_** role.

- **_Request Headers:_**

  ```
  Content-Type: application/json
  Authorization: Bearer <accessToken>
  ```

- **_Request Body:_**

At least one of the following is required.

```

{
"name"?: string,
"price"?: string,
"category_id"?: number,
"description"?: string | null
}

```

- **_Error Response:_**

  - Status Code: _400 Bad Request_
    Content:

    ```
    {
        "error": "DATA_REQUIRED" | "NAME_REQUIRED" | "NAME_TOO_SHORT" | "PRICE_REQUIRED" | "PRICE_MUST_BE_POSITIVE" | "INVALID_NUMBER_CATEGORY_ID"
    }
    ```

#### **[DELETE] /products/:id**

Deletes the product with the specified id. Available only for authenticated users with the **_Admin_** role.

- **_Request Headers:_**

  ```
  Content-Type: application/json
  Authorization: Bearer <accessToken>
  ```

- **_Success Response:_**

  Status Code: _204 No Content_

- **_Error Response:_**

  - Status Code: _400 Bad Request_

    Content: `{ "error": "INVALID_PRODUCT_ID" }`

  - Status Code: _403 Forbidden_

    Content: `{ "error": "FORBIDDEN_FOR_CUSTOMER" }`

  - Status Code: _404 Not Found_

    Content: `{ "error": "NOT_FOUND" }`

### Orders

All the orders endpoints can be accessed by the authorized and are related to that user.

#### **[GET] /orders**

Provides a list of all orders of the user.

- **_Request Headers:_**
  ```
  Content-Type: application/json
  Authorization: Bearer <accessToken>
  ```

#### **[GET] /orders/current**

Returns the current order of the user.

- **_Request Headers:_**
  ```
  Content-Type: application/json
  Authorization: Bearer <accessToken>
  ```
- **_Error Response:_**

  - Status Code: _404 Not Found_

    Content: `{ "error": "NOT_FOUND" }`

#### **[GET] /orders/completed**

Provides a list of all completed orders of the user.

- **_Request Headers:_**
  ```
  Content-Type: application/json
  Authorization: Bearer <accessToken>
  ```

#### **[POST] /orders**

Creates a new order for the user. Users are allowed to have only one active order.

- **_Request Headers:_**
  ```
  Content-Type: application/json
  Authorization: Bearer <accessToken>
  ```
- **_Request Body:_**

  ```
  {
     "item": {
        "product_id": number,
        "quantity": number,
        "engraving": string | null
    },
    "comments": string | null,
    "calledAt": number (timestamp)
  }
  ```

- **_Error Response:_**

  - Status Code: _400 Bad Request_
    Content:

    ```
    {
        "error": "CALLEDAT_REQUIRED" | "INVALID_TIMESTAMP_CALLEDAT" | "ORDER_ITEM_REQUIRED" | "INVALID_NUMBER_PRODUCT_ID" | "QUANTITY_REQUIRED" | "QUANTITY_MUST_BE_POSITIVE"
    }
    ```

  - Status Code: _403 Forbidden_
    Content: `{ "error": "CURRENT_ORDER_EXISTS" }`

#### **[POST] /orders/item**

Adds a new order item in the current active order of the user.

- **_Request Headers:_**
  ```
  Content-Type: application/json
  Authorization: Bearer <accessToken>
  ```
- **_Request Body:_**

  ```
  {
      "product_id": number,
      "quantity": number,
      "engraving": string | null
  }
  ```

- **_Error Response:_**

  - Status Code: _400 Bad Request_
    Content:

    ```
    {
        "error": "INVALID_NUMBER_PRODUCT_ID" | "QUANTITY_REQUIRED" | "QUANTITY_MUST_BE_POSITIVE"
    }
    ```

- Status Code: _404 Not Found_

  Content: `{ "error": "CURRENT_ORDER_NOT_FOUND" }`

#### **[PATCH] /orders/item**

Updates an order item in the current active order of the user.

- **_Request Headers:_**
  ```
  Content-Type: application/json
  Authorization: Bearer <accessToken>
  ```
- **_Request Body:_**

  At least one of the following is required.

  ```
  {
      "quantity?": number,
      "engraving?": string | null
  }
  ```

- **_Error Response:_**

  - Status Code: _400 Bad Request_
    Content:

    ```
    {
        "error": "DATA_REQUIRED" | "INVALID_NUMBER_PRODUCT_ID" | "QUANTITY_REQUIRED" | "QUANTITY_MUST_BE_POSITIVE"
    }
    ```

- Status Code: _404 Not Found_

  Content: `{ "error": "CURRENT_ORDER_NOT_FOUND" }`

#### **[DELETE] /orders/item/:id**

Deletes the order item with the specified id in the current active order of the user. If there are no more items in the current order then the current order is deleted.

- **_Request Headers:_**
  ```
  Content-Type: application/json
  Authorization: Bearer <accessToken>
  ```
- **_Success Response:_**

  Status Code: _200 OK_
  Content: The current order or null

- **_Error Response:_**

  - Status Code: _400 Bad Request_

    Content: `{ "error": "INVALID_ORDER_ITEM_ID" }`

  - Status Code: _404 Not Found_

    Content: `{ "error": "NOT_FOUND" }`

- Status Code: _404 Not Found_

  Content: `{ "error": "CURRENT_ORDER_NOT_FOUND" }`

#### **[PATCH] /orders/current/complete**

Completes the current active order of the user.

- **_Request Headers:_**
  ```
  Content-Type: application/json
  Authorization: Bearer <accessToken>
  ```
- **_Request Body:_**

  At least one of the following is required.

  ```
  {
      "calledAt": number (timestamp),
      "comments": string | null
  }
  ```

- **_Error Response:_**

  - Status Code: _400 Bad Request_
    Content: `{ "error": "CALLEDAT_REQUIRED" | "INVALID_TIMESTAMP_CALLEDAT" }`

- Status Code: _404 Not Found_

  Content: `{ "error": "CURRENT_ORDER_NOT_FOUND" }`

#### **[DELETE] /orders/current/complete**

Deletes the current active order of the user.

- **_Request Headers:_**

  ```
  Content-Type: application/json
  Authorization: Bearer <accessToken>
  ```

- **_Success Response:_**

  Status Code: _204 No Content_

- **_Error Response:_**

  - Status Code: _400 Bad Request_

    Content: `{ "error": "INVALID_CATEGORY_ID" }`

  - Status Code: _404 Not Found_

    Content: `{ "error": "CURRENT_ORDER_NOT_FOUND" }`
