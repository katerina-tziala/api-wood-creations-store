# API Requirements

The _"Wood Creations"_ company stakeholders want to create an online storefront to showcase their great product creations. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. Administrators should also be able to manage users, categories and products of the store.

These are the notes that describe the endpoints of the API, as well as the data contracts the frontend and backend have agreed upon to meet the requirements of the application.

## API Endpoints

There are 4 main routes in the API: users, categories, products and orders. All the endpoints of the API are under the route **/api**.

Success and error responses are described for special cases.

For endpoints that require authorization, unauthorized users that try to access them will get an error response:

Status Code: _401 Unauthorized_

Content: `{ "error": "UNAUTHORIZED" }`

### Users

- **[POST] /users/authenticate/**

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

- **[GET] /users**

  Provides a list of all users. Available only for authenticated users with the **_Admin_** role.

  - **_Request Headers:_**
    ```
    Content-Type: application/json
    Authorization: Bearer <accessToken>
    ```

- **[GET] /users/:id**

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

- **[POST] /users**

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

- **[PATCH] /users**

  Updates the logged in user and returns the updated user.

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

- **[DELETE] /users/:id**

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

- **[GET] /categories**

  Provides a list of all categories for the products.

  - **_Request Headers:_**
    ```
    Content-Type: application/json
    Authorization: Bearer <accessToken>
    ```

- **[GET] /categories/:id**

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

- **[POST] /categories**

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

- **[PATCH] /categories/:id**

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

- **[DELETE] /categories/:id**

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

- **[GET] /products**

  Provides a list of all products.

  - **_Request Headers:_**
    ```
    Content-Type: application/json
    ```

- **[GET] /products/top-five**

  Provides a list of the 5 most popular products (most commonly ordered).

  - **_Request Headers:_**
    ```
    Content-Type: application/json
    ```

- **[GET] /products/:id**

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

- **[GET] /products/category/:id**

  Provides a list of all products that belong in the specified category.

  - **_Request Headers:_**

    ```
    Content-Type: application/json
    ```

  - **_Error Response:_**

    - Status Code: _400 Bad Request_

      Content: `{ "error": "INVALID_CATEGORY_ID"}`

- **[POST] /products**

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

- **[PATCH] /products/:id**

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

- **[DELETE] /products/:id**

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
  status: 'Active' | 'Complete';
  created_at: Date;
  completed_at?: Date;
  comments?: string | null;
  total?: string;
  number_of_products?: string;
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
  name: string;
  price: string;
  category_id: number;
  category?: string;
  description?: string | null;
}
```

## Database Schema

The following diagram depicts the database schema that address the API endpoints and data contracts above:

<p align="center">
    <img src="https://github.com/katerina-tziala/api-wood-creations-store/blob/master/docs/wood-creations-store.png" alt="database-schema" width="100%" height="auto">
</p>
