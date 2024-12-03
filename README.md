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

 
