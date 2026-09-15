# AI Career Navigator

AI Career Navigator is a React and TypeScript platform that helps students plan their careers.

## Features

- Career recommendations
- Profile and skill tracking
- Career assessment
- Skill gap analysis
- Learning roadmap
- Company recommendations and details
- Saved user accounts for local development
- Express and MongoDB backend

## Run the project

Install the packages:

```bash
npm install
```

Start the frontend and backend:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173`.

The backend runs at `http://localhost:5000`.

## Build the project

```bash
npm run build
```

## Environment variables

Copy `.env.example` to `.env` and update the values if needed:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai-career
CLIENT_URL=http://localhost:5173
```

The app can still run in demo mode when MongoDB is not running locally.
