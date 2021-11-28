# API Requirements

The _"Wood Creations"_ company stakeholders want to create an online storefront to showcase their great product creations. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. Administrators should also be able to manage users, categories and products of the store.

These are the notes that describe the endpoints of the API, as well as the data contracts the frontend and backend have agreed upon to meet the requirements of the application.

## API Endpoints

There are 4 main routes in the API: users, categories, products and orders. All the endpoints of the API are under the route **/api**.

Success and error responses are described for special cases.

### Users

* **[POST] /users/authenticate/**

    Authenticates a user and provides access.
    
    *  **_Request Headers:_**
        ```
        Content-Type: application/json
        ```
    * **_Request Body:_**

        ```
        {
            "username": string,
            "password": string
        }
        ```
    * **_Success Response:_**
    
        Status Code: 200 OK

        Content: ``` { "accessToken": string } ```
                
    * **_Error Response:_**
    
       * Status Code: 400 Bad Request
          
          Content: 
            ```
            {
                "error": "CREDENTIALS_REQUIRED" | "USERNAME_REQUIRED" | "USERNAME_TOO_SHORT" | "PASSWORD_REQUIRED" | "PASSWORD_TOO_SHORT"
            }
            ``` 
        
        * Status Code: 401 Unauthorized
          
          Content: ``` { "error": "WRONG_CREDENTIALS" } ```
            
* **[GET] /users**

    Provides a list of all users. Available only for authenticated users with the **_Admin_** role.
    
    *  **_Request Headers:_**
        ```
        Content-Type: application/json
        Authorization: Bearer <accessToken>
        ```

* **[GET] /users/:id**

    Returns the requested user including the current order and the 5 most recent completed orders. Available only for authenticated users with the **_Admin_** role.
    
    *  **_Request Headers:_**
        ```
        Content-Type: application/json
        Authorization: Bearer <accessToken>
        ```
    * **_Error Response:_**
    
       * Status Code: 400 Bad Request
          
          Content: ``` { "error": "INVALID_USER_ID" } ``` 
        
        * Status Code: 403 Forbidden
          
          Content: ``` { "error": "FORBIDDEN_FOR_CUSTOMER" } ``` 

        * Status Code: 404 Not Found
          
          Content: ``` { "error": "NOT_FOUND" } ``` 

* **[POST] /users**

    Create a user. Creating a user with the **_Admin_** role is not allowed.
    
    *  **_Request Headers:_**
        ```
        Content-Type: application/json
        ```
    * **_Request Body:_**

        ```
        {
           "firstname": string,
            "lastname": string,
            "username": string,
            "password": string
        }
        ```
                
    * **_Error Response:_**
    
       * Status Code: 400 Bad Request
          
          Content: 
            ```
            {
                "error": "DATA_REQUIRED" | "USERNAME_REQUIRED" | "USERNAME_TOO_SHORT" | "PASSWORD_REQUIRED" | "PASSWORD_TOO_SHORT" | "FIRSTNAME_REQUIRED" | "FIRSTNAME_TOO_SHORT" | "LASTNAME_REQUIRED" | "LASTNAME_TOO_SHORT"
            }
            ``` 
 
* **[PATCH] /users**

    Updates the logged in user and returns the updated user.
    
    *  **_Request Headers:_**
        ```
        Content-Type: application/json
        Authorization: Bearer <accessToken>
        ```
    * **_Request Body:_**
    
    At least one of the following is required.

        ```
        {
           "firstname"?: string,
            "lastname"?: string,
            "username"?: string,
            "password"?: string
        }
        ```
                
    * **_Error Response:_**
    
       * Status Code: 400 Bad Request
          
          Content: 
            ```
            {
                "error": "DATA_REQUIRED" | "USERNAME_REQUIRED" | "USERNAME_TOO_SHORT" | "PASSWORD_REQUIRED" | "PASSWORD_TOO_SHORT" | "FIRSTNAME_REQUIRED" | "FIRSTNAME_TOO_SHORT" | "LASTNAME_REQUIRED" | "LASTNAME_TOO_SHORT"
            }
            ``` 

* **[DELETE] /users/:id**

    Deletes the user with the specified id if the user exists and the user does not have the **_Admin_** role. Available only for authenticated users with the **_Admin_** role.
    
    *  **_Request Headers:_**
        ```
        Content-Type: application/json
        Authorization: Bearer <accessToken>
        ```
     
     * **_Success Response:_**
    
        Status Code: 204 No Content
    
    * **_Error Response:_**
    
       * Status Code: 400 Bad Request
          
          Content: ``` { "error": "INVALID_USER_ID" } ``` 
        
        * Status Code: 403 Forbidden
          
          Content: ``` { "error": "FORBIDDEN_FOR_CUSTOMER" | "ADMIN_DELETION_FORBIDDEN" } ``` 

        * Status Code: 404 Not Found
          
          Content: ``` { "error": "NOT_FOUND" } ``` 


### Categories

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
