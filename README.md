# SocialHub

## Project Overview
SocialHub is a full-stack social networking web application that provides users with features like authentication, blogging, creating and liking posts, connecting with friends, real-time chatting, and more. Built using **ReactJS** on the frontend and **ExpressJS** with **MongoDB** on the backend, it offers a seamless user experience with interactive design and robust backend APIs.

## Features
1. **User Authentication:**
   - User registration and login with password encryption.
   - JWT-based authentication for secure API access.
2. **Dashboard:**
   - Personalized dashboard displaying user-created posts.
   - Option to create posts with captions.
3. **Posts:**
   - View, like, and unlike posts.
   - Add comments to posts.
   - View posts by other users.
4. **Friends:**
   - Add and view friends.
   - Access posts by friends.
5. **Blogs:**
   - Create and manage personal blogs.
   - View community blogs.
   - Search blogs by title or content.
6. **Chat:**
   - Real-time chat functionality.
   - Display of chat messages in an organized format.
7. **Search:**
   - Search for users and their posts.

---

## Technologies Used
### Frontend:
- **ReactJS** with React Router for navigation.
- **Tailwind CSS** for styling.
- **Socket.IO** for real-time chat.

### Backend:
- **ExpressJS** for RESTful APIs.
- **MongoDB** with Mongoose for data persistence.
- **JWT** for secure authentication.
- **Socket.IO** for real-time chat.

---

## Steps to Set Up and Run the Application Locally

### Prerequisites
- **Node.js** and **npm** installed on your machine.
- **MongoDB** installed and running locally or accessible remotely.
- A `.env` file with the following:
  ```env
  PORT=5000
  MONGO_URI=your_mongo_connection_string
  JWT_SECRET=your_jwt_secret_key
  ```

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```
   The backend will be running at `http://localhost:5000`.

### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The application will open in the browser at `http://localhost:3000`.

### Running the Application
1. Start both the backend and frontend servers.
2. Open `http://localhost:3000` in your browser.
3. Register a new account or log in with an existing account.
4. Explore the features like posts, blogs, friends, and chat.

---

## Folder Structure
### Frontend
- **`src/`**
  - `components/`: Reusable UI components (e.g., Navbar, Post, etc.).
  - `pages/`: Page-level components (e.g., Dashboard, Login, etc.).
  - `api.js`: Axios-based API client.
  - `index.js`: React entry point.

### Backend
- **`routes/`**: API route handlers for authentication, posts, blogs, etc.
- **`models/`**: Mongoose models for User, Post, Blog, etc.
- **`middleware/`**: Middleware like authentication.
- **`server.js`**: Main server entry point.

---

## Future Enhancements
1. Add profile pictures for users.
2. Implement notifications for likes, comments, and friend requests.
3. Add image uploads to posts and blogs.
4. Enhance search functionality with filters.
5. Deploy the application to cloud services like Heroku or Vercel.

---

## Contributors
- **Your Name**
  - [GitHub](https://github.com/yourusername)
  - [LinkedIn](https://www.linkedin.com/in/yourusername)

---

Feel free to contribute to this project by submitting issues or pull requests!
