# Full-Stack Todo Application

A modern todo application built with React frontend and Node.js/MongoDB backend.

## Features

- ✅ Create, read, update, and delete todos
- 🎯 Priority levels (High, Medium, Low)
- 📅 Due dates with overdue detection
- 📊 Statistics dashboard
- 🌐 Online/Offline status indicator
- 🎨 Beautiful Tailwind CSS design
- 📱 Responsive design

## Project Structure

```
to-do-app/
├── client/          # React frontend
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── ...
│   └── package.json
├── server/          # Node.js backend
│   ├── server.js
│   ├── .env
│   └── package.json
└── package.json     # Root package for scripts
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm run install-all
   ```

2. **Set up MongoDB:**
   - **Local MongoDB:** Make sure MongoDB is running on `mongodb://localhost:27017`
   - **MongoDB Atlas:** Update the `MONGODB_URI` in `server/.env`

3. **Configure environment variables:**
   Edit `server/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/todoapp
   PORT=5000
   CLIENT_URL=http://localhost:5173
   ```

## Running the Application

### Development Mode (Both frontend and backend)
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:5173

### Individual Services

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

**Production build:**
```bash
npm run build
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/todos` | Get all todos |
| POST | `/api/todos` | Create a new todo |
| PUT | `/api/todos/:id` | Update a todo |
| DELETE | `/api/todos/:id` | Delete a todo |
| GET | `/api/todos/stats` | Get todo statistics |

## API Usage Examples

**Create a todo:**
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "Learn React", "priority": "high", "dueDate": "2025-07-20"}'
```

**Get all todos:**
```bash
curl http://localhost:5000/api/todos
```

**Update a todo:**
```bash
curl -X PUT http://localhost:5000/api/todos/YOUR_TODO_ID \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

## Features

### Frontend Features
- React with hooks
- Tailwind CSS for styling
- Responsive design
- Real-time status indicators
- Error handling with fallback to offline mode
- Loading states

### Backend Features
- RESTful API with Express.js
- MongoDB with Mongoose ODM
- CORS enabled
- Input validation
- Error handling middleware
- Statistics endpoint

## Troubleshooting

**MongoDB Connection Issues:**
- Ensure MongoDB is running locally or check your Atlas connection string
- Verify the `MONGODB_URI` in `server/.env`

**Port Conflicts:**
- Frontend runs on port 5173 (Vite default)
- Backend runs on port 5000
- Change ports in `server/.env` if needed

**API Connection Issues:**
- Ensure both frontend and backend are running
- Check the API base URL in `client/src/services/api.js`

## Development

The application supports offline functionality - if the backend is unavailable, the frontend will show sample data and display an offline indicator.

## License

MIT License+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
