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
