# API Requirements
The "Wood Creations" company stakeholders want to create an online storefront to showcase their great product creations. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page.


You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
All api endpoints are under the route **/api**. The data contracts used to present the response of each endpoint are presented in the **Data Contracts**  section of this document.
### Products
- [GET] /products
  _Description_: Returns a list of all products.

  **_Success Response:_**

  - Code: 200 OK
  - Content: ```[ Product, ... ]```

  **_Error Response:_** 



**_Possible Errors_**
| Code                | Content                                     |
| ------------------------- | --------------------------------------------------- |
| 500 Internal Server Error | The products could not be fetched                   |

#### [GET] /products:id






#### Products
- Index 

- Show
- Create [token required]
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)

#### Users
- Index [token required]
- Show [token required]
- Create N[token required]

#### Orders
- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]



## Data Contracts
#### Product
-  id
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
