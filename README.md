# AI-Powered Email Assistant
This repository hosts an AI-Powered Email Assistant, a web application designed to manage and analyze emails efficiently. The project uses modern web technologies to provide a user-friendly interface and robust backend capabilities.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Technology Choices Explanation](#technology-choices-explanation)
- [API Configuration Guide](#api-configuration-guide)
- [Architecture Overview](#architecture-overview)

---

## Setup Instructions
Follow these steps to set up the project locally:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/mohamaderrr/ai_email_assitant.git
   cd ai_email_assitant
2. **Install the Dependencies**
     ```bash
     npm install
3. **Configure the Environment**
   Create a .env file in the root directory and add the following variables:
    ```bash
    DATABASE_URL=your_database_url
    GOOGLE_API_KEY=you_gemini_api
    CLIENT_ID=your_client_id
    CLIENT_SECRET=your_client_secret
    REDIRECT_URL=https://developers.google.com/oauthplayground
    REFRESH_TOKEN=your_refresh_token
    OPENAI_API_KEY=your_openai_key
    JWT_SECRET=your_jwt_secret
    NEXT_PUBLIC_JWT_SECRET=your_NEXT_PUBLIC_JWT_SECRET
4. **Setup the Database**
    Ensure you have MySQL installed and running. Then, initialize the Prisma schema:
     ```bash
     npx prisma generate
     npx prisma migrate
5. **Run the Application**
    Start the development server:
    ```bash
    npm run dev
Open your browser and navigate to http://localhost:3000.
## Technology Choices Explanation
Frontend
Next.js: Chosen for its excellent performance, SEO capabilities, and server-side rendering.
React Context API: Provides a clean and efficient way to manage state across the application.
TypeScript: Enhances the reliability and scalability of the code with strong typing.
Backend
Prisma: A modern ORM that simplifies database operations and integrates seamlessly with TypeScript.
MySQL: A relational database known for reliability and scalability, suitable for structured email data.
APIs and Authentication
Gmail API: Enables secure and robust email management.
OAuth 2.0: Used for user authentication and authorization.
## API Configuration Guide
1. **Email Endpoints**
    GET /api/email/fetch: Fetches a list of emails
    POST /api/email/send: Sends an email
    GET /api/email/sent-emails: Retrieves a list of sent emails. 
    POST /api/email/sentiment: Returns sentiment analysis for a given email.
2. **Authentication Endpoints**
   POST /api/auth/signin: Handles user login.
   POST /api/auth/signup: Handles user registration.
   POST /api/auth/verify-credentials: Verifies Gmail API credentials.
## Architecture Overview
The application follows a modular architecture with clearly defined separation of concerns:
1 . **Frontend**
  Built with Next.js to utilize its hybrid rendering features (SSR and SSG).
  Uses React Context API for global state management, ensuring seamless interaction across components.
2. **Backend**
   Implements RESTful APIs using Next.js API routes.
   Utilizes Prisma ORM to interact with the MySQL database, ensuring efficient and type-safe data operations.
   Leverages Gmail API for handling email-related functionality.
3. **Database**
 MySQL schema managed by Prisma, storing user data, email metadata, and sentiment analysis results.
4. **Authentication and Authorization**
Powered by OAuth 2.0, integrating Google Authentication for secure and straightforward user management.

   


    
