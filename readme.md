# Simple Twitter Clone

A full-stack social media application built from scratch. This project demonstrates a complete authentication flow, database relations (likes/retweets), and dynamic user profiles.

## Technologies Used

* **Frontend:** Next.js 15 (React), Tailwind CSS v4
* **Backend:** NestJS
* **Database:** PostgreSQL 15 (Running via Docker)
* **ORM:** Prisma v6
* **Package Manager:** npm

---

## Architecture Overview

This project follows a simple **3-Tier Architecture**:

1.  **Client (Frontend):** Built with **Next.js**. It handles the UI and state. It communicates with the backend via standard HTTP `fetch` requests using JSON.
2.  **Server (Backend):** Built with **NestJS**. It acts as the API layer. It receives requests (like "Create Tweet" or "Login"), validates them, and uses Prisma to talk to the database.
3.  **Database:** A **PostgreSQL** instance hosted in a **Docker** container. We use Docker to ensure the database runs identically on any machine without local installation conflicts.

**Data Flow:**
`User Action` -> `Next.js` -> `API Call (localhost:3000)` -> `NestJS Controller` -> `Prisma Client` -> `PostgreSQL (Docker port 5433)`

---

## How to Run Locally

Follow these steps to get the app running from scratch.

### 1. Prerequisites
Ensure you have the following installed:
* Node.js (v18 or higher)
* Docker & Docker Compose

### 2. Start the Database
The database is configured to run on port **5433** to avoid conflicts with other local Postgres installations.

1.  Open a terminal in the root project folder.
2.  Run the Docker container:

    docker-compose up -d

### 3. Setup the Backend (Server)
1.  Open a new terminal and navigate to the server:

    cd server

2.  Install dependencies:

    npm install

3.  Initialize the database tables:

    npx prisma migrate dev --name init

4.  Start the server:

    npm run start:dev

    *The API will be running at `http://localhost:3000`*

### 4. Setup the Frontend (Client)
1.  Open a new terminal and navigate to the client:

    cd client

2.  Install dependencies:

    npm install

3.  Start the application:

    npm run dev

    *The app will be accessible at `http://localhost:3001` (or 3000)*

---

## Features

* **User Accounts:** Sign Up and Login with JWT authentication.
* **Feed:** View tweets from all users in reverse chronological order.
* **Posting:** Create text-based tweets.
* **Delete Tweet:** Users can delete their own tweets
* **Interactions:**
    * **Like:** Toggle likes on posts.
    * **Retweet:** Share posts from other users.
* **Dynamic Profiles:** Click on any user's name to view their specific profile and tweet history.
