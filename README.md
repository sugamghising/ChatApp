# 💬 ChatApp - Real-Time Chat Application

A full-stack real-time chat application built with React, TypeScript, Node.js, Express, MongoDB, and Socket.IO.

## ✨ Features

- 🔐 **JWT Authentication** - Secure login and signup
- 💬 **Real-Time Messaging** - Instant message delivery via Socket.IO
- 📷 **Image Upload** - Send images in chat (Cloudinary)
- 👥 **Online Status** - See who's online with green indicators
- 🔔 **Unseen Message Counts** - Red badges show unread messages
- ✅ **Message Status** - Seen/unseen indicators (✓/✓✓)
- 👤 **Profile Management** - Edit name, bio, and profile picture
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop
- 🎨 **Modern UI** - WhatsApp/Messenger-style interface

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Socket.IO Client** - Real-time communication
- **Zustand** - State management
- **React Router** - Navigation
- **Axios** - HTTP requests
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ChatApp
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

### 4. Configure Environment Variables

#### Backend (.env in server folder)

Create a `server/.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Frontend (.env in client folder)

Create a `client/.env` file:

```env
REACT_APP_API_URL=http://localhost:5000
```

### 5. Start the Application

#### Start Backend (Terminal 1)

```bash
cd server
npm run dev
```

Backend will run on `http://localhost:5000`

#### Start Frontend (Terminal 2)

```bash
cd client
npm start
```

Frontend will open on `http://localhost:3000`

## 📁 Project Structure

```
ChatApp/
├── server/                  # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controller/     # Route controllers
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utilities (JWT, Cloudinary)
│   │   └── index.ts        # Entry point
│   ├── .env                # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
└── client/                 # Frontend (React + TypeScript)
    ├── src/
    │   ├── components/     # React components
    │   ├── pages/          # Page components
    │   ├── store/          # Zustand stores
    │   ├── config/         # API configuration
    │   ├── lib/            # Socket.IO setup
    │   ├── types/          # TypeScript interfaces
    │   ├── utils/          # Utility functions
    │   ├── App.tsx         # Main app component
    │   └── index.tsx       # Entry point
    ├── public/
    ├── .env                # Environment variables
    ├── package.json
    ├── tailwind.config.js
    └── tsconfig.json
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/check` - Verify authentication
- `PUT /api/auth/update-profile` - Update user profile

### Messages

- `GET /api/messages/users` - Get all users with unseen counts
- `GET /api/messages/:id` - Get messages with specific user
- `POST /api/messages/send/:id` - Send message to user
- `PUT /api/messages/mark/:id` - Mark message as seen

## 🔄 Socket.IO Events

### Client → Server

- `connect` - Connect with userId in query

### Server → Client

- `getOnlineUsers` - List of online user IDs
- `newMessage` - New message received

## 🎨 Color Theme

- Sidebar Background: `#6A89A7`
- Sent Messages: `#BDDDFC`
- Received Messages: `#88BDF2`
- Dark Background: `#384959`

## 📝 Usage

1. **Sign Up**: Create a new account with full name, email, password, and bio
2. **Login**: Use your credentials to login
3. **Select User**: Click on a user from the sidebar to start chatting
4. **Send Messages**: Type text or upload images to send
5. **Real-Time**: Messages appear instantly for both users
6. **Edit Profile**: Click settings icon to update your profile

## 🐛 Troubleshooting

### Backend won't start

- Check if MongoDB connection string is correct
- Ensure port 5000 is not in use
- Verify all environment variables are set

### Frontend can't connect to backend

- Make sure backend is running on port 5000
- Check `client/src/config/api.ts` has correct API_URL
- Verify CORS is enabled in backend

### Images won't upload

- Verify Cloudinary credentials in `.env`
- Check image size is under 4MB
- Ensure Cloudinary account is active

### Socket.IO not connecting

- Verify backend server is using `server.listen()` not `app.listen()`
- Check browser console for connection errors
- Ensure userId is passed in socket connection

## 🚀 Deployment

### Backend (Heroku/Railway/Render)

1. Set environment variables on hosting platform
2. Deploy backend code
3. Update frontend API_URL to deployed backend URL

### Frontend (Vercel/Netlify)

1. Update `client/src/config/api.ts` with production backend URL
2. Build: `npm run build`
3. Deploy `build/` folder

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

**Your Name**

- GitHub: [@sugamghising](https://github.com/sugamghising)

## 🙏 Acknowledgments

- React Team for React
- Tailwind CSS for the styling framework
- Socket.IO for real-time communication
- Cloudinary for image hosting

---

**Happy Chatting! 💬✨**
