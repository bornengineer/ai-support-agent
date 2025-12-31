# Backend - AI Chat Support

The backend service for the Spur AI Chat application. Built with Node.js, Express, and TypeScript.

## 🔧 Configuration

The application requires the following environment variables. Create a `.env` file in this directory:

```env
# Server Configuration
PORT=4000

# Database Configuration
# Format: postgres://user:password@host:5432/database
DATABASE_URL=postgres://user:password@localhost:5432/spur_chat

# AI Provider Configuration
# Get your API key from Groq Console: https://console.groq.com/
GROQ_API_KEY=gsk_...

# Caching Configuration (Redis)
REDIS_URL=redis://localhost:6379
```

## 🗄️ Database Schema

The application uses PostgreSQL. Ensure you have created the database and run the following initialization SQL:

```sql
CREATE TABLE conversations (
  id VARCHAR(255) PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id VARCHAR(255) REFERENCES conversations(id),
  sender VARCHAR(50) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Scripts

- `npm install`: Install dependencies.
- `npm run dev`: Start the server in development mode (using `tsx` watch).
- `npm run build`: Compile TypeScript to JavaScript in `dist/`.
- `npm start`: Run the compiled production server (`node dist/server.js`).

## 📂 Project Structure

- `src/server.ts`: Entry point, server setup.
- `src/config.ts`: Environment configuration.
- `src/routes/`: API route definitions.
- `src/services/`: Business logic (LLM integration, DB connection).
