# Advanced-E-Commerce-API
 Coding Temple - Module 11: Mini-Project


# React E-commerce Web Application

## Overview

This is a React-based E-commerce web application that provides a comprehensive set of features for managing customers, products, and orders. It integrates with a Flask backend and a MySQL database, offering users an intuitive interface for all e-commerce functionalities.

## Key Features

### Current Project Enhancements

*** Customer and CustomerAccount Management ***

1. Create, read, update, and delete customer information.
2. Capture essential customer details, including name, email, and phone number.
3. Update and delete customer records directly through the interface.

*** Product Catalog Management *** 

1. List available products with comprehensive details.
2. Create, read, update, and delete product information.
3. *** Bonus features: ***
    - View and manage product stock levels.
    - Automatically restock products when stock levels fall below a specified threshold.

*** Order Processing ***

1. Place new orders, specifying products and quantities.
2. Retrieve order details and track the status of orders.
3. *** Bonus features: ***
    - Access order history for customers.
    - Calculate total order prices based on product prices.

*** Routing and Navigation ***

1. Utilize React Router for seamless navigation throughout the application.

*** Form Handling ***

1. Implement forms with validation for managing customer and product data.
2. Use React hooks to manage form state and submission.

*** Error Handling ***

1. Graceful handling of API errors with user feedback.
2. Utilize try-catch blocks for effective error management.


# Previous Project (Flask API)

This project builds upon the foundational work done in a previous Flask-based E-Commerce API project, which provided:

1. CRUD (Create, Read, Update, Delete) endpoints for customers, products, and orders.
2. Database integration using Flask-SQLAlchemy and Marshmallow for data modeling and validation.
3. Postman collections to organize API requests.

*** For detailed information about the previous API project, please refer to the [E-Commerce API Module6-MiniProject Repository](https://github.com/Tmiseray/E-Commerce-API) ***


## Getting Started
### Prerequisites
- Node.js and npm
- MySQL Community Server for the backend
- Python 3.x for the backend
- Required Python libraries:
    - Flask
    - Flask-SQLAlchemy
    - Flask-Marshmallow
    - Flask-Bcrypt
    - mysql-connector-python


### Installation
*** **GitHub Repository** ***

[E-Commerce API Module6-MiniProject Repository](https://github.com/Tmiseray/E-Commerce-API)

[Advanced E-Commerce API Module11-MiniProject Repository](https://github.com/Tmiseray/Advanced-E-Commerce-API)

*** **Cloning Option** ***
* If you have Git Bash installed, you can clone the repository using the URL
1. Create a 'Clone' Folder
2. Within the folder, right-click for Git Bash
3. From the GitHub Repository, click on the '<> Code' button and copy the link provided
4. Paste the link into your Git Bash and click 'Enter'
* If you have GitHub Desktop, when you click on the '<> Code' button you will have an option to 'Open with GitHub Desktop'
* If you have Visual Studio Code, when you click on the '<> Code' button you will have an option to 'Open with Visual Studio'
* [HTTPS] (https://github.com/Tmiseray/Advanced-E-Commerce-API.git)
* [SSH] (git@github.com:Tmiseray/Advanced-E-Commerce-API.git)
* [GitHubCLI] (`gh repo clone Tmiseray/Advanced-E-Commerce-API`)

*** **Download Option** ***
1. From the GitHub Repository, click on the '<> Code' button
2. Click on 'Download Zip'
3. Extract contents of Zip file

*** **Update File & Run App** ***
1. Update the database connection details in the `app.py` & `password.py` files:
   - Locate the line `app.config['SQLALCHEMY_DATABASE_URI']` and replace the placeholder values with your MySQL connection details.
   - Locate the `password.py` file and replace the placeholder with your password. You can also update the secret key too!
2. Start the Flask Application:
   ```
   python app.py
   ```
   OR
   ```
   flask run
   ```
3. Start the React Application:
    ```
    npm run dev
    ```


#### API Endpoints
The application integrates with the backend API, providing endpoints for core functionalities:

*** Customer and CustomerAccount Management ***

- POST /register: Create a new customer
- GET /customers: Retrieve all customers
- GET /customers/{id}: Retrieve a customer by ID
- PUT /customers/{id}: Update customer details
- DELETE /customers/{id}: Delete a customer

- POST /create-account/{id}: Create a new customer's account for login
- GET /accounts/{id}: Retrieve account information for a specific customer
- PUT /accounts/{id}: Update customer's account information
- DELETE /accounts/{id}: Delete customer's account login information

- GET/POST /login: Login method
- POST /logout: Logout method

*** Product and Catalog Management ***

- POST /add-product: Create a new product
- GET /products/{id}: Retrieve a product by ID
- GET /products/active-products: Retrieve all active products for customer's view
- PUT /products/{id}: Update product details (name, price)
- PUT /products/deactivate/{id}: Soft-delete product, makes the product inactive so it's still available in the full Catalog, but won't show as a product a customer can order

- POST /add-to-catalog: Adds a product to the admin's Catalog
- GET /catalog: Gets all products' details in the Catalog (ID, Current Stock, Last Restock Date)
- POST /stock-monitor: Monitors stock levels of products and if any are below the threshold (10), automatically restocks them

*** Order Processing ***

- POST /place-order: Place a new order
- GET /orders: Retrieves every order
- GET /orders/{id}: Retrieve an order by ID
- PUT /orders/{id}: Updates an order by ID
- DELETE /orders/{id}: Delete an order by ID
- GET /orders/history-for-customer/{customerId}: Retrieve order history for a customer

*** Bonus Features ***
1. Manage Product Stock Levels
    - View and update stock levels for products.
2. Automatically Restock Products When Low
    - Monitor and trigger restocking of low-stock products.
3. Manage Order History
    - Access a complete history of customer orders.
4. Calculate Order Total Price
    - Calculate the total price of items in an order.


## Contributing
Contributions to this project are welcome! If you encounter any issues or have suggestions for improvements, please open a new issue or submit a pull request.
