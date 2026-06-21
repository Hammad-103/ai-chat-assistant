# Database Setup Instructions

## Prerequisites

- PostgreSQL installed and running
- Create a database for the project

## Setup Steps

### 1. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ai_chat_assistant;

# Exit
\q
```

### 2. Update .env

Update the `DATABASE_URL` in `.env` file with your PostgreSQL credentials:

```
DATABASE_URL=postgresql://username:password@localhost:5432/ai_chat_assistant
```

### 3. Run Migrations

```bash
npm install
npm run migrate
```

### 4. Verify Tables

```bash
psql -U postgres -d ai_chat_assistant

\dt

\d users
\d chat_sessions
\d messages
```

## Migration Files

- `database/migrations/001_init_tables.sql` - Initial schema

## Available Scripts

```bash
# Run migrations
npm run migrate

# Rollback (drop all tables)
npm run migrate:rollback

# Start server (tests connection on startup)
npm start

# Development mode with auto-reload
npm run dev
```

## Tables

### users
- `id` - Primary key
- `name` - User full name
- `email` - Unique email address
- `password_hash` - Hashed password
- `created_at` - Timestamp

### chat_sessions
- `id` - Primary key
- `user_id` - Foreign key to users
- `title` - Session title
- `created_at` - Timestamp

### messages
- `id` - Primary key
- `session_id` - Foreign key to chat_sessions
- `role` - Message role (user/assistant)
- `content` - Message content
- `created_at` - Timestamp

## Indexes

Created indexes for performance:
- `idx_chat_sessions_user_id` on chat_sessions(user_id)
- `idx_messages_session_id` on messages(session_id)
- `idx_users_email` on users(email)
