# YouTube Clone Backend

This is the backend service for the **YouTube Clone** project. It is built using **Node.js**, **Express**, and **MongoDB**, with integrations for authentication, video upload (Cloudinary), comments, likes, subscriptions, and more.

---

## Features

- User authentication (JWT-based)
- Channel creation & management
- Video upload (Cloudinary integration)
- Video editing & deletion
- View tracking system
- Like & dislike functionality
- Comment system (add, edit, delete)
- Trending tags aggregation

---

## Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **Cloudinary** (for video & thumbnail storage)
- **JWT** for authentication
- **Multer** for file uploads

---

## Project Structure

```
backend/
│── controllers/   # Controller logic for each route
│── config/        # configuration for MongoDB and Cloudinary
│── models/        # Mongoose models (User, Video, Comment, etc.)
│── routes/        # Express route definitions
│── middlewares/   # Authentication & error handling middleware
│── utils/         # Utility functions (e.g., Cloudinary setup)
│── index.js       # Entry point
```

---

## API Endpoints

### Authentication

- `GET  /api/user/` → get current logged in user
- `POST /api/user/register` → Register a new user
- `POST /api/user/login` → Login user
- `POST /api/user/logout` → Logout user

### Channels

- `POST /api/channel/create` → Create a channel
- `GET /api/channel/:id` → Get channel details
- `PUT /api/channel/edit` → Edit channel details

### Videos

- `GET /api/video/` → get videos collection
- `GET /api/video/:id` → Get video details
- `GET /api/video/tags/top` → Get top Categories
- `GET /api/video/tags/top` → Get top Categories
- `GET /api/video/tags/:tag` → Geting videos by Category
- `POST /api/video/upload` → Upload video
- `PUT /api/video/:id` → Edit video
- `PUT /api/video/:id/view` → setting video views
- `DELETE /api/video/:id` → Delete video

### Comments

- `POST /api/comment?videoId=xxx` → Add a comment
- `GET /api/comment/:videoId` → Fetch comments for a video
- `PUT /api/comment/:videoId` → edit a comment
- `DELETE /api/comment/:videoId` → delete comment

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/Akshat24112001/youtube-backend
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory with:

```
PORT=4040
CLIENT_URL=http://localhost:5173 //URL for frontend
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run Server

```bash
npm start
```

Server will start at: `http://localhost:4040`

---

## Future Improvements

- Add playlists feature
- Implement notifications
- watched videos
- likes & dislike functionality
- forgot password
- Enhance search & recommendations

---

## Testing

Use Postman or Thunder Client to test APIs.

## Author

**Akshat Singh**  
Email: [akshatsinghrajput24@gmail.com](mailto:akshatsinghrajput24@gmail.com)  
GitHub: [Akshat24112001](https://github.com/Akshat24112001)

Backend Repository: [YouTube Clone Backend](https://github.com/Akshat24112001/youtube-backend)

Frontend Repository: [YouTube Clone Frontend](https://github.com/Akshat24112001/youtube-frontend)

## License

This project is licensed under the MIT License.
