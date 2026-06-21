# AI Chat Assistant Backend

A Node.js + Express backend application with MVC architecture.

## Project Structure

```
src/
├── app.js                 # Express app configuration
├── index.js              # Server entry point
├── config/               # Configuration files
├── controllers/          # Request handlers
├── models/              # Data models
├── routes/              # Route definitions
├── services/            # Business logic
└── middleware/          # Middleware functions
tests/                   # Test files
```

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```
NODE_ENV=development
PORT=3000
APP_NAME=AI Chat Assistant
```

## Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Endpoints

### Health Check
- **GET** `/health` - Returns server health status
  ```json
  {
    "status": "ok",
    "timestamp": "2026-06-21T10:30:00.000Z",
    "uptime": 123.456
  }
  ```

## Architecture

### MVC Pattern
- **Models**: Database schemas and data structures
- **Views**: Response formatting (handled via Express JSON)
- **Controllers**: Request processing and business logic coordination
- **Services**: Reusable business logic and external integrations
- **Routes**: API endpoint definitions
- **Middleware**: Request/response processing
- **Config**: Environment and application configuration

## Error Handling

The application includes centralized error handling middleware that:
- Catches all errors in one place
- Provides consistent error responses
- Includes stack traces in development mode
- Returns user-friendly messages in production

## Testing

```bash
npm test
```

## License

ISC
