# TDD Backend

A Node.js backend application built with TypeScript, Express, and MongoDB.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally on default port 27017)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional, defaults are provided):
```bash
cp .env.example .env
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

- `GET /` - Welcome message and status
- `GET /health` - Health check endpoint

## MongoDB Connection

The application connects to MongoDB at `mongodb://localhost:27017/tdd-backend` by default. Make sure MongoDB is running locally before starting the server.

## Project Structure

```
tdd-backend/
├── src/
│   └── index.ts          # Main application entry point
├── dist/                 # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

# -Sweet-Shop-Management-System-Backend
