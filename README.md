# Spur AI Chat Support Agent

A full-stack AI-powered customer support chat widget that simulates a live support agent for an e-commerce store. The application features a real-time chat interface where users can ask questions (e.g., return policies, shipping) and receive instant, context-aware responses from an LLM.

## 🚀 Features

- **Live Chat Interface**: Clean, responsive UI built with React.
- **AI-Powered Responses**: Integrated with Groq (Llama 3 / Mixtral) for fast, intelligent replies.
- **Conversation History**: Persists chat sessions and messages in PostgreSQL.
- **Robust Backend**: Node.js & Express with TypeScript.
- **Type Safety**: Full TypeScript support across frontend and backend.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TypeScript, Generic UI Components.
- **Backend**: Node.js, Express, TypeScript.
- **Database**: PostgreSQL.
- **AI/LLM**: Groq SDK (compatible with OpenAI/Anthropic APIs).

---

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL installed and running
- A Groq API Key (or OpenAI compatible key if code is adapted)

### 1. Database Setup

Create a PostgreSQL database and run the following SQL to set up the schema:

```sql
CREATE TABLE conversations (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id TEXT REFERENCES conversations(id),
    sender VARCHAR(10),
    text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `backend/` with your configuration:
   ```env
   PORT=4000
   DATABASE_URL=postgres://user:password@localhost:5432/your_database_name
   GROQ_API_KEY=gsk_your_groq_api_key_here
   ```
4. Build and start the server:
   ```bash
   npm run build
   npm start
   ```
   Or for development with hot-reload:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) to view the chat widget.

---

## 🏗️ Architecture Overview

### Backend (`/backend`)
- **Structure**: Layered architecture separating concerns.
  - **`routes/`**: API endpoints (e.g., `/chat/message`). Handles HTTP request/response validation.
  - **`services/`**: Core business logic.
    - `llm.ts`: Handles communication with the AI provider (Groq). Includes prompts and history context management.
    - `db.ts`: Manages PostgreSQL connection pool.
  - **`config.ts`**: Centralized configuration and environment variable validation.
- **Design Decisions**:
  - **Stateless API**: Usage of `sessionId` allows the backend to remain stateless, scaling easily.
  - **Implicit Schema**: Tables are queried directly for simplicity in this take-home scope, but designed to be easily migrated to an ORM like Drizzle or Prisma.
  - **Production Ready**: TypeScript compilation to `dist/` ensures type safety and optimized runtime.

### Frontend (`/frontend`)
- **Structure**: Vite + React application.
  - **Chat Component**: Manages chat state, auto-scrolling, and optimistic UI updates for a snappy feel.
  - **API Integration**: Connects to the backend REST API (`/chat/message`).

### LLM Integration
- **Provider**: **Groq** (using Llama 3 8b or Mixtral 8x7b models).
- **Why Groq?**: Extremely low latency inference, providing a "real-time" chat feel essential for customer support agents.
- **Prompting**:
  - Uses a system prompt to define the persona ("Helpful e-commerce support agent").
  - Injects conversation history to maintain context (multi-turn conversations).
  - Includes "Domain Knowledge" (shipping policy, returns, etc.) directly in the system prompt for reliable answers.

## ⚖️ Trade-offs & Future Improvements

- **Database**: Currently using raw SQL queries for simplicity. In a real production app, I would use an ORM (Prisma/Drizzle) for type-safe database access and migration management.
- **Security**: Basic CORS and input validation are implemented. Production would require stricter Content Security Policy, and Authentication.
- **Styling**: Uses basic CSS/styled components. Could be enhanced with Tailwind CSS or a UI library for better theming.
- **Modularization**: We can make the codebase more modular, efficient and optimized by utilizing best code practices.
- **Testing**: Adding unit and integration tests (backend and frontend) would increase confidence and prevent regressions.
- **Performance Optimization**: Caching prompt context with Redis or implementing streaming responses would improve responsiveness and lower LLM cost.