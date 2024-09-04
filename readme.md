Bizaway Tech Challenge API
==================

Overview
--------

This is a Node.js application that provides an API for managing and retrieving trips. The API allows users to search for trips, add trips to their favorites, view their favorite trips, and remove trips from their favorites. The project uses MongoDB as the database, and the code is written in TypeScript.

Features
--------

-   **Search Trips**: Retrieve trips based on origin, destination, and sort by the cheapest or fastest options.
-   **Manage Favorites**: Add trips to favorites, view favorite trips, and remove trips from favorites.
-   **MongoDB Integration**: MongoDB is used to store user favorite trips.
-   **TypeScript**: The project is written in TypeScript for better type safety and development experience.
-   **In-memory MongoDB for Testing**: The project uses `mongodb-memory-server` to spin up an in-memory MongoDB instance for testing purposes.
-   **Swagger**: Implemented for API documentation.

Prerequisites
-------------

Before running the project, ensure you have the following installed:

-   **Node.js** (version 20.x or later)
-   **npm** or **yarn**

Getting Started
---------------

### Installation

1.  **Clone the repository:**

    `git clone https://github.com/alescofet/bizaway-tech-challenge.git`
    
    `cd bizaway-tech-challenge`

2.  **Install dependencies:**

    `npm install`

3.  **Set up environment variables:**

    Create a `.env` file in the root directory of the project with the following variables(The values are in the email I sent you):

    -   `API_KEY`: Your API key for fetching trips.
    -   `MONGODB_URI`: The MongoDB connection string.
    -   `PORT`: The port you want to use to launch the app.

### Running the Application

To run the application in development mode, use:

`npm run start`

This will compile the TypeScript code and start the server on `http://localhost:<PORT>`.

### Running Tests

To run the tests, use:

`npm run test`

This command will compile the TypeScript code and run the tests using Jest. The tests use `mongodb-memory-server` to mock MongoDB for unit testing.

API Endpoints
-------------

### Get Trips

-   **Endpoint:** `GET /trips`
-   **Description:** Retrieve a list of trips based on origin, destination, and sort order.
-   **Query Parameters:**
    -   `origin` (string): IATA code for the origin.
    -   `destination` (string): IATA code for the destination.
    -   `sort_by` (string): Sort by `cheapest` or `fastest`.
-   **Response:**
    -   `200`: Success with trip data.
    -   `400`: Invalid request parameters.
    -   `500`: Server error.

### Add Favorite

-   **Endpoint:** `POST /favorites/add`
-   **Description:** Add a trip to a user's favorite list.
-   **Body Parameters:**
    -   `username` (string): The user's username.
    -   `trip` (object): The trip object containing trip details.
-   **Response:**
    -   `201`: Trip added to favorites.
    -   `400`: Missing or invalid parameters.
    -   `409`: Trip already in favorites.
    -   `500`: Server error.

### Get Favorites

-   **Endpoint:** `GET /favorites/byUsername`
-   **Description:** Retrieve a user's favorite trips.
-   **Query Parameters:**
    -   `username` (string): The user's username.
-   **Response:**
    -   `200`: Success with favorite trips data.
    -   `400`: Missing username.
    -   `404`: No favorites found.
    -   `500`: Server error.

### Remove Favorite

-   **Endpoint:** `DELETE /favorites/remove`
-   **Description:** Remove a trip from a user's favorite list.
-   **Body Parameters:**
    -   `username` (string): The user's username.
    -   `tripId` (string): The ID of the trip to be removed.
-   **Response:**
    -   `200`: Trip removed from favorites.
    -   `400`: Missing or invalid parameters.
    -   `404`: User or trip not found.
    -   `500`: Server error.

### Import API Calls

-   To make it easier for the reviewer the repository has a "thunder-collection_Bizaway API calls.json" that can be imported using [ThunderClient](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) to test the API with some predefined calls.

### Swagger API documentation

-   Go to `http://localhost:<PORT>/api-docs` to view the swagger documentation once the server is up & running.