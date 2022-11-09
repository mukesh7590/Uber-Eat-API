# Uber-Eat-REST-API

online food ordering API where all the three entity (Vendor,Customer,Driver) will communicate with each other.

## Built With

Here is the Technology Stack of this Application. which I have used to Built this Application.

-  MongoDB
-  AWS-S3
-  Express
-  NodeJS

<!-- GETTING STARTED -->

## Getting Started

-  Clone this project
-  Start by installing npm and mongoDB if you don't have them already.
-  Run the Mongo Server.

## API Routes

-  In this API, I have created some routes for each users like vendor, customer, driver. Some request routes needed the JWT web token for authorization, checked for the user is valid or not. I have declared all the routes given below.

## Admin Route

| Request                 |                   Route-URL                   | Request-Type | JWT-Token |
| ----------------------- | :-------------------------------------------: | :----------: | :-------: |
| Create Vendor           |      http://localhost:8000/admin/vendor       |     Post     |    No     |
| View all Vendors        |      http://localhost:8000/admin/vendors      |     Get      |    No     |
| View Vendor by ID       |   http://localhost:8000/admin/vendor/:{id}    |     Get      |    No     |
| View all Transactions   |   http://localhost:8000/admin/transactions    |     Get      |    No     |
| Transaction by ID       | http://localhost:8000/admin/transaction/:{id} |     Get      |    No     |
| View all Delivery Users |  http://localhost:8000/admin/delivery/users   |     Get      |    No     |

## Vendor Route

| Request               |                    Route-URL                     | Request-Type | JWT-Token |
| --------------------- | :----------------------------------------------: | :----------: | :-------: |
| Vendor Login          |        http://localhost:8000/vendor/login        |     Post     |    No     |
| Vendor Profile        |       http://localhost:8000/vendor/profile       |     Get      |    Yes    |
| Vendor Update Profile |       http://localhost:8000/vendor/profile       |    Patch     |    Yes    |
| Add Food              |        http://localhost:8000/vendor/food         |     Post     |    Yes    |
| View all Foods        |        http://localhost:8000/vendor/foods        |     Get      |    Yes    |
| Update Cover Image    |     http://localhost:8000/vendor/coverimage      |    Patch     |    Yes    |
| Update Service        |       http://localhost:8000/vendor/service       |    Patch     |    Yes    |
| View all Orders       |       http://localhost:8000/vendor/orders        |     Get      |    Yes    |
| Order Process         | http://localhost:8000/vendor/order/:{id}/process |     Put      |    Yes    |
| Order by ID           |     http://localhost:8000/vendor/order/:{id}     |     Get      |    Yes    |
| Add Offer             |       http://localhost:8000/vendor/offers        |     Post     |    Yes    |
| Get Offers            |        http://localhost:8000/vendor/offer        |     Get      |    Yes    |
| Edit Offer            |     http://localhost:8000/vendor/offer/:{id}     |     Put      |    Yes    |

## Shopping Route

| Request             |                    Route-URL                     | Request-Type | JWT-Token |
| ------------------- | :----------------------------------------------: | :----------: | :-------: |
| Foods Availablility |         http://localhost:8000/:{pincode}         |     Get      |    Yes    |
| Top Restaurants     | http://localhost:8000/top-restaurant/:{pincode}  |     Get      |    Yes    |
| Food in 30 minutes  | http://localhost:8000/foods-in-30-min/:{pincode} |     Get      |    Yes    |
| Foods Search        |     http://localhost:8000/search/:{pincode}      |     Get      |    Yes    |
| Restaurant by ID    |      http://localhost:8000/restaurant/:{id}      |     Get      |    Yes    |
| Available Offer     |     http://localhost:8000/offers/:{pincode}      |     Get      |    Yes    |

## Customer Route

| Request        |                     Route-URL                     | Request-Type | JWT-Token |
| -------------- | :-----------------------------------------------: | :----------: | :-------: |
| Sign Up        |       http://localhost:8000/customer/signup       |     Post     |    No     |
| Verify OTP     |       http://localhost:8000/customer/verify       |    Patch     |    Yes    |
| Login          |       http://localhost:8000/customer/login        |     Post     |    No     |
| Request OTP    |        http://localhost:8000/customer/otp         |     Get      |    Yes    |
| View Profile   |      http://localhost:8000/customer/profile       |     Get      |    Yes    |
| Edit Profile   |      http://localhost:8000/customer/profile       |    Patch     |    Yes    |
| Create Payment |   http://localhost:8000/customer/create-payment   |     Post     |    Yes    |
| Verify Offer   | http://localhost:8000/customer/offer/verify/:{id} |     Get      |    Yes    |
| Create Order   |    http://localhost:8000/customer/create-order    |     Post     |    Yes    |
| View Order     |       http://localhost:8000/customer/orders       |     Get      |    Yes    |
| Order by ID    |    http://localhost:8000/customer/order/:{id}     |     Get      |    Yes    |
| Add to Cart    |        http://localhost:8000/customer/cart        |     Post     |    Yes    |
| View Cart      |        http://localhost:8000/customer/cart        |     Get      |    Yes    |
| Delete Cart    |        http://localhost:8000/customer/cart        |    Delete    |    Yes    |

## Delivery Route

| Request       |                  Route-URL                   | Request-Type | JWT-Token |
| ------------- | :------------------------------------------: | :----------: | :-------: |
| Sign Up       |    http://localhost:8000/delivery/signup     |     Post     |    No     |
| Login         |     http://localhost:8000/delivery/login     |     Post     |    No     |
| Verify Driver |    http://localhost:8000/delivery/verify     |    Patch     |    Yes    |
| Request OTP   |      http://localhost:8000/delivery/otp      |     Get      |    Yes    |
| View Profile  |    http://localhost:8000/delivery/profile    |     Get      |    Yes    |
| Edit Profile  |    http://localhost:8000/delivery/profile    |    Patch     |    Yes    |
| Change Status | http://localhost:8000/delivery/change-status |     Put      |    Yes    |

<!-- CONTRIBUTING -->

## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch
3. Commit your Changes
4. Push to the Branch
5. Open a Pull Request
