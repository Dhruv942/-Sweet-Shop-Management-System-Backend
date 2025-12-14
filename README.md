# Sweet Shop Management System - Backend

A Node.js backend application built with TypeScript, Express, and MongoDB following Test-Driven Development (TDD) principles. This is a RESTful API for managing a sweet shop inventory with authentication, authorization, and CRUD operations.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally on default port 27017) or MongoDB Atlas
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd tdd-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```bash
cp .env.example .env
```

4. Update `.env` with your configuration:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/tdd-backend
JWT_SECRET=your-secret-key-change-this-in-production
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Testing

```bash
npm test
npm run test:watch
npm run test:coverage
```

## API Endpoints

### Authentication

- **POST /api/auth/register** - Register a new user

  - Body: `{ email, password }`
  - Returns: User object and JWT token

- **POST /api/auth/login** - Login user
  - Body: `{ email, password }`
  - Returns: User object and JWT token

### Sweets Management

- **POST /api/sweets** - Create a new sweet (Authenticated)

  - Headers: `Authorization: Bearer <token>`
  - Body: `{ name, category, price, quantity, image }`
  - Returns: Created sweet object

- **GET /api/sweets** - Get all sweets (Authenticated)

  - Headers: `Authorization: Bearer <token>`
  - Returns: Array of sweets

- **GET /api/sweets/search?query=** - Search sweets (Authenticated)

  - Headers: `Authorization: Bearer <token>`
  - Query params: `query` (searches by name, category, or price)
  - Returns: Array of matching sweets

- **PUT /api/sweets/:id** - Update a sweet (Authenticated)

  - Headers: `Authorization: Bearer <token>`
  - Body: `{ name?, category?, price?, quantity?, image? }` (partial update)
  - Returns: Updated sweet object

- **DELETE /api/sweets/:id** - Delete a sweet (Admin only)

  - Headers: `Authorization: Bearer <admin-token>`
  - Returns: Success message

- **POST /api/sweets/:id/purchase** - Purchase a sweet (Authenticated)

  - Headers: `Authorization: Bearer <token>`
  - Body: `{ quantity }`
  - Returns: Updated sweet with decreased quantity

- **POST /api/sweets/:id/restock** - Restock a sweet (Admin only)
  - Headers: `Authorization: Bearer <admin-token>`
  - Body: `{ quantity }`
  - Returns: Updated sweet with increased quantity

### Health & Status

- **GET /** - Welcome message and status
- **GET /health** - Health check endpoint

## Project Structure

```
tdd-backend/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection configuration
│   ├── controllers/
│   │   ├── auth.controller.ts   # Authentication controllers
│   │   └── sweet.controller.ts  # Sweet management controllers
│   ├── middleware/
│   │   └── auth.middleware.ts   # JWT authentication & admin middleware
│   ├── models/
│   │   ├── user.model.ts        # User schema and model
│   │   └── sweet.model.ts       # Sweet schema and model
│   ├── routes/
│   │   ├── auth.routes.ts       # Authentication routes
│   │   └── sweet.routes.ts      # Sweet management routes
│   ├── services/
│   │   ├── auth.service.ts      # Authentication business logic
│   │   └── sweet.service.ts     # Sweet management business logic
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.test.ts     # Registration tests
│   │   │   └── auth.login.test.ts # Login tests
│   │   └── sweets/
│   │       ├── sweets.create.test.ts
│   │       ├── sweets.get.test.ts
│   │       ├── sweets.search.test.ts
│   │       ├── sweets.update.test.ts
│   │       ├── sweets.delete.test.ts
│   │       ├── sweets.purchase.test.ts
│   │       └── sweets.restock.test.ts
│   └── index.ts                 # Application entry point
├── dist/                        # Compiled JavaScript (generated)
├── jest.config.js               # Jest configuration
├── jest.setup.js                # Jest setup file
├── jest.teardown.js             # Jest teardown file
├── package.json
├── tsconfig.json
└── README.md
```

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (USER/ADMIN)
- **CRUD Operations**: Full CRUD for sweets management
- **Search Functionality**: Search sweets by name, category, or price
- **Inventory Management**: Purchase (decrease stock) and restock (increase stock) operations
- **Input Validation**: Comprehensive validation for all endpoints
- **Error Handling**: Proper HTTP status codes and error messages
- **Test Coverage**: Comprehensive test suite following TDD principles
- **Type Safety**: Full TypeScript support with proper typing

## Testing

The project follows Test-Driven Development (TDD) principles. All features are developed test-first.

### Test Structure

- **Unit Tests**: Service layer tests
- **Integration Tests**: API endpoint tests using Supertest
- **Test Database**: Uses MongoDB Memory Server for isolated testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Cases

![Test Cases](./images/testcases.png)

## Environment Variables

| Variable         | Description                               | Default                                 |
| ---------------- | ----------------------------------------- | --------------------------------------- |
| `PORT`           | Server port                               | `3000`                                  |
| `MONGODB_URI`    | MongoDB connection string                 | `mongodb://localhost:27017/tdd-backend` |
| `JWT_SECRET`     | Secret key for JWT tokens                 | Required                                |
| `ADMIN_EMAIL`    | Admin user email                          | Required                                |
| `ADMIN_PASSWORD` | Admin user password                       | Required                                |
| `NODE_ENV`       | Environment (test/development/production) | `development`                           |

## Deployment

### Render.com

The application is configured to run on Render.com using `tsx` for TypeScript execution.

**Build Command**: `npm install`  
**Start Command**: `npm start`

Make sure to set all environment variables in the Render dashboard.

## My AI Usage

### Overview

I used AI tools selectively and transparently throughout the development process to enhance productivity, resolve technical issues, and improve code quality. The AI tools were primarily used for problem-solving, code review, and understanding best practices rather than generating entire features from scratch.

### AI Tools Used

#### 1. ChatGPT

**Purpose**: Code refactoring, error resolution, and documentation assistance

**Specific Usage Examples**:

1. **Authentication Middleware Refactoring**

   - Used ChatGPT to simplify and refactor `auth.middleware.ts` while implementing authenticated routes
   - Asked for best practices on JWT token verification and error handling
   - Result: Cleaner, more maintainable middleware code

2. **TypeScript Error Resolution**

   - Used ChatGPT to resolve a TypeScript typing error encountered during authentication-related implementation
   - Specifically helped with `AuthRequest` interface extension and type definitions
   - Result: Properly typed request objects throughout the application

3. **Commit Message Improvement**
   - Used ChatGPT for reviewing and improving commit message clarity
   - Ensured commit messages followed conventional commit standards
   - Result: Better version control history and clearer project documentation

#### 2. Cursor AI

**Purpose**: Code review, edge case identification, deployment troubleshooting, and schema improvements

**Specific Usage Examples**:

1. **Test Case Review and Edge Case Identification**

   - Used Cursor AI to review existing test cases and identify missing edge cases in the authentication and sweets modules
   - Helped identify scenarios like duplicate email registration, invalid inputs, and boundary conditions
   - Result: More comprehensive test coverage with better edge case handling

2. **Schema Enhancement**

   - Used Cursor AI suggestions during schema review, which led to adding image support to the sweet model
   - Discussed best practices for MongoDB schema design and field validation
   - Result: Enhanced data model with image field support

3. **Deployment Troubleshooting**

   - Used Cursor AI to diagnose and fix deployment issues on Render
   - Helped identify memory issues with `ts-node` and suggested switching to `tsx`
   - Assisted in fixing PORT binding issues and environment variable configuration
   - Result: Successful deployment on Render with proper configuration

4. **Runtime Issue Resolution**
   - Used Cursor AI to assist in understanding and resolving deployment-related runtime issues
   - Specifically helped with MongoDB connection handling in test environments
   - Clarified that AI was used for deployment troubleshooting, not for generating business logic
   - Result: Stable application deployment with proper test isolation

### How AI Impacted My Workflow

#### Positive Impacts

1. **Faster Problem Resolution**: AI tools significantly reduced the time spent debugging TypeScript errors and deployment issues. What might have taken hours of research was resolved in minutes.

2. **Better Code Quality**: AI suggestions helped identify potential issues early, such as missing edge cases in tests and improper error handling patterns.

3. **Learning Enhancement**: Using AI to understand deployment configurations and best practices accelerated my learning curve for new technologies like Render.com deployment.

4. **Documentation Improvement**: AI assistance in writing clear commit messages and documentation improved the overall project maintainability.

5. **Test Coverage**: AI helped identify edge cases I might have missed, leading to more robust test suites.

#### Workflow Integration

- **Selective Usage**: AI was used strategically at specific pain points rather than for all development tasks
- **Transparency**: All AI-assisted code was reviewed and understood before integration
- **Learning-First Approach**: Used AI explanations to understand solutions, not just copy them
- **Quality Control**: All AI-generated suggestions were manually reviewed and tested

### Ethical Considerations

- All AI usage was transparent and documented
- Code quality and understanding were prioritized over speed
- AI suggestions were always reviewed and tested before integration
- The project demonstrates genuine understanding of the implemented features

---

## License

ISC

## Author

Developed following TDD principles with selective AI assistance for problem-solving and code quality improvement.
