# Portfolio-Project_BillBuddy API Project

The BillBuddy API project is designed to manage properties and their associated services, providing users with efficient task management functionalities and reminder services. This README.md file provides detailed setup instructions for setting up the project environment and running the API.

## Features

- Manage properties and their associated services (electricity, water, gas, internet, etc.).
- Create tasks for services, including recording task details and attaching images.
- Efficient reminder functionalities for tasks, such as monthly electricity consumption recording.

## Technologies Used

- Node.js
- Mongoose (MongoDB Atlas)
- Firebase Admin SDK

## Setup Instructions

Follow these steps to set up and run the BillBuddy API project:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/roqiaahmed/Portfolio-Project_BillBuddy.git

   ```

2. **Install Dependencies**:

- cd Portfolio-Project_BillBuddy
- npm install

3. **Set Environment Variables**:

- Create a .env file in the root directory and add the following variables:

MONGO_URI=your_mongodb_uri
JWT_TOKEN_SECRET=your_jwt_token_secret
API_KEY=your_api_key
AUTH_DOMAIN=your_auth_domain
MEASUREMENT_ID=your_measurement_id
PROJECT_ID=your_project_id
STORAGE_BUCKET=your_storage_bucket
MESSAGING_SENDER_ID=your_messaging_sender_id
APP_ID=your_app_id
SERVICE_ACCOUNT="path_to_firebase.json"

4. **Run the Server**:
   npm start

5. **Documentation**:
   The API documentation (Swagger) can be accessed at /api/v1/docs

# Usage

Use your favorite API development tool (Postman, Insomnia, etc.) to interact with the API endpoints.
Authenticate requests using bearer tokens provided upon login.

# Contributors

- roqiaahmed
