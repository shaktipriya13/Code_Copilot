# Code-Copilot — Full Assignment Submission

> **Goal:** Build a minimal full-stack web app (Code Generation Copilot). Users enter a natural-language prompt, choose a language, get AI-generated code via a real code-generation API, and view previous generations in a paginated history feed.

---

## 1. Project Summary

Code-Copilot is a minimal full-stack web application that lets users:

- Enter a free-text prompt (e.g., "Write a Python function to reverse a string").
- Select a programming language (seeded languages: Python, JavaScript, C++, Java — customizable).
- Send the prompt to the backend which calls a real code-generation API (e.g., Gemini / OpenAI / Hugging Face), and returns generated code.
- View and copy generated code (syntax-highlighted) in a preview.
- Browse a paginated history feed of previous generations (stored in a relational DB).

This repository contains two folders: `/client` (React + Tailwind + TanStack Query) and `/server` (Node.js + Express + Prisma + PostgreSQL). The backend is deployed to Render and connected to a PostgreSQL instance.

---

## 2. Live Demo

- **Frontend URL:** `https://code-copilot-mu.vercel.app`
- **Backend URL:** `https://server-cc-0qm4.onrender.com`

---

## 3. Tech Stack

- Frontend: React (Vite/CRA/Next optional), Tailwind CSS, TanStack Query (React Query), Highlight.js (for syntax highlighting)
- Backend: Node.js, Express.js, Prisma ORM
- Database: PostgreSQL (hosted on Render)
- Code-generation API: Gemini
- Deployment: Vercel(frontend), Render (backend), PostgreSQL database on Render

---

## 4. Repository Structure

```
/ (root)
├─ frontend/
│  ├─ src/
│  ├─ public/
│  ├─ package.json
│  └─ README.md
├─ backend/
│  ├─ prisma/
│  │  ├─ schema.prisma
│  │  ├─ seed.js
│  │  └─ migrations/ (optional)
│  ├─ src/
│  │  ├─ controllers/
│  │  ├─ middleware/
│  │  ├─ services/
│  │  ├─ routes/
│  │  └─ index.js
│  ├─ package.json
│  └─ README.md
├─ docs/
│  └─ er-diagram.png
├─ .env.example
└─ README.md  <-- this file
```

---

## 5. How to Run Locally (Detailed)

### Prerequisites

- Node.js (>= 18 recommended)
- npm
- PostgreSQL instance (local or cloud)

### Backend (run locally)

1. Clone repo and install dependencies:

```bash
git clone <https://github.com/shaktipriya13/Code_Copilot>
cd server
npm install
```

2. Create `.env` in `/server` using `.env.example` and fill values.

3. Generate Prisma client & push schema:

```bash
npx prisma generate
npx prisma db push
```

> If you prefer migrations (Prisma Migrate), run `npx prisma migrate dev --name init` instead and commit generated `prisma/migrations/`.

4. Seed the database (populate languages):

```bash
node prisma/seed.js
# or
npm run seed
```

5. Start the server (development):

```bash
npm run dev
# or (production-like)
npx prisma generate && npx prisma db push && npm start
```

### Frontend (run locally)

1. In a separate terminal:

```bash
cd client
npm install
npm run dev
```

2. Ensure `FRONTEND_ORIGIN` in backend `.env` matches the frontend origin (example `http://localhost:5173`).

---

## 6. Environment Variables (`.env.example`)

Create a file at `/server/.env` with real values; do not commit secrets. Commit `.env.example` with placeholders and descriptions.

```
# .env.example
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
FRONTEND_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_code_generation_api_key_here
JWT_SECRET=some_long_random_secret
PORT=8000
NODE_ENV=development
```

**Notes:**

- `FRONTEND_ORIGIN` fixes CORS (previously a typo `FRONTEND_ORIaGIN` caused browser network errors).
- `DATABASE_URL` must point to PostgreSQL when running on Render.

---

## 7. API Documentation (End-to-end details)

Base URL (example): `https://<your-backend-url>/api`

### 1) `POST /api/generate`

- **Description:** Accepts `{ prompt, languageId }` or `{ prompt, language }`, calls the configured code-generation API and stores the generation in DB.
- **Request Body (JSON):**

```json
{
  "prompt": "Write a Python function to reverse a string",
  "languageId": 1
}
```

- **Response (JSON):**

```json
{
  "ok": true,
  "generation": {
    "id": 123,
    "prompt": "Write a Python function to reverse a string",
    "languageId": 1,
    "code": "def reverse_string(s):\n    return s[::-1]",
    "createdAt": "2025-11-22T18:00:00.000Z"
  }
}
```

- **Errors:** 400 for validation errors, 429 for rate limiting (if enabled), 500 for internal/API errors.
- **Notes:** Server validates `prompt` (required, non-empty) and `languageId` (must exist).

### 2) `GET /api/history?page=1&limit=10`

- **Description:** Returns paginated generations.
- **Query Params:** `page` (default 1), `limit` (default 10)
- **Response (JSON):**

```json
{
  "ok": true,
  "items": [
    /* array of generation objects, newest first */
  ],
  "total": 102,
  "page": 1,
  "limit": 10
}
```

- **Notes:** Uses `ORDER BY "createdAt" DESC` and `OFFSET / LIMIT` or cursor-based pagination for large datasets.

### 3) `GET /api/languages`

- **Description:** Returns seeded languages.
- **Response:**

```json
[{ "id": 1, "name": "Python", "extension": "py" }, ...]
```

---

## 8. Database Schema & ER Diagram

### Choice of related table

I have included a separate `Language` table.
Reason: normalization — languages are repeated metadata; storing them as FK avoids duplication and allows adding metadata (file extension, display name) without copying strings into every generation row.

### Prisma schema (excerpt)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  password  String
  generations Generation[]
}

model Language {
  id        Int       @id @default(autoincrement())
  name      String    @unique
  slug      String    @unique
  extension String
  generations Generation[]
}

model Generation {
  id         Int      @id @default(autoincrement())
  prompt     String
  code       String   @db.Text
  createdAt  DateTime @default(now())
  language   Language @relation(fields: [languageId], references: [id])
  languageId Int
  user       User?    @relation(fields: [userId], references: [id])
  userId     Int?
}
```

> Note: `@db.Text` used for `code` to store large text in PostgreSQL.

### ER Diagram (dbdiagram.io format)

![alt text](image-1.png)

---

## 9. Migrations & Seeding

### Migrations

Two supported workflows:

**A) Prisma Migrate (recommended for production with version control)**

```bash
# dev (creates migration files)
npx prisma migrate dev --name init
# commit prisma/migrations/
```

**B) Prisma DB Push (used in this project for Render deployments)**

- If you don't want to manage migration history, use `npx prisma db push` to sync schema.
- In the Render start command we use:

```
npx prisma generate && npx prisma db push && npm start
```

This ensures the schema is pushed on deploy.

**Note:** For reviewers who expect migration files, include one SQL file under `/backend/sql/initial_schema.sql` with table creation statements. Example:

```sql
CREATE TABLE "Language" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  extension VARCHAR(16)
);

CREATE TABLE "Generation" (
  id SERIAL PRIMARY KEY,
  prompt TEXT NOT NULL,
  code TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "languageId" INTEGER REFERENCES "Language"(id),
  "userId" INTEGER REFERENCES "User"(id)
);
```

### Seeding

`/backend/prisma/seed.js` populates the `languages` table. Example command:

```bash
node prisma/seed.js
```

Seed data example (languages):

```js
[
  { name: "Python", slug: "python", extension: "py" },
  { name: "JavaScript", slug: "javascript", extension: "js" },
  { name: "C++", slug: "cpp", extension: "cpp" },
  { name: "Java", slug: "java", extension: "java" },
];
```

---

## 10. Pagination, Complexity & Indexing (Required Answers)

### a) Time complexity of paginated retrieval of generations

- **Offset-based pagination (page & limit):** Typical query is `ORDER BY "createdAt" DESC LIMIT k OFFSET (p-1)*k`.

  - Fetching the page requires reading `k` rows (the page size) — **O(k)** to return the result set.
  - However, the database must skip the offset rows; skipping large offsets can incur an **O(n)** cost internally (depending on DB and query plan) because the DB scans index pages or table rows up to the offset.

- **Cursor-based pagination (recommended for large datasets):** Using a `createdAt` or `id` cursor (`WHERE createdAt < lastSeenCreatedAt ORDER BY createdAt DESC LIMIT k`) produces **O(k)** behavior without expensive OFFSET skipping, so overall more efficient at scale.

**Short answer:** For normal page sizes, retrieving `k` rows is **O(k)**. Unsafe large OFFSETs can cause higher costs; cursor-based pagination reduces that.

### b) How the schema affects query performance and flexibility

- **Normalization:** Having a separate `Language` table reduces duplicated strings and makes updates easier, but requires a join to read language metadata. Since `languages` is small and often cached/seeded, joins are cheap.
- **Storing `code` as TEXT:** Keeps generated code in the Generation row — eliminates joins for core data. TEXT fields are large but necessary.
- **FK constraints:** Enforce integrity (languageId must refer to existing language) but slightly increase write cost.
- **Flexibility tradeoffs:** Denormalizing (storing language name directly) speeds reads for simple queries but costs storage and duplication. Current tradeoff favors normalization for maintainability.

### c) When are indexes useful? Did you create any?

- **Indexes are useful when:** filtering (`WHERE`), joining on FK columns, or ordering (`ORDER BY`). In this app:

  - Index `Generation.createdAt` for efficient `ORDER BY` used in history queries.
  - Index `Generation.languageId` if you add filtering by language.
  - Index `Generation.userId` (if user-specific history) for fast user-scoped queries.

**Example SQL to create indexes:**

```sql
CREATE INDEX idx_generation_createdat ON "Generation" ("createdAt" DESC);
CREATE INDEX idx_generation_language ON "Generation" ("languageId");
CREATE INDEX idx_generation_user ON "Generation" ("userId");
```

**Note:** I recommend creating the `createdAt` index in production when dataset grows beyond a few thousand rows. Indexes speed reads at the cost of slower writes and more storage.

---

## 11. Deployment (Render) — exact steps and config

This project has been deployed to Render. Key deployment notes (exact working setup):

### Render service settings

- **Backend service**

  - Build command: `npm install` (or `yarn install`)
  - Start command: `npx prisma generate && npx prisma db push && npm start`
  - Environment variables set (in Render dashboard): `DATABASE_URL`, `FRONTEND_ORIGIN`, `GEMINI_API_KEY`, `JWT_SECRET`, `PORT` (if needed)

- **Database:** PostgreSQL managed by Render (DATABASE_URL provided by Render)
- **CORS:** `FRONTEND_ORIGIN` must exactly match frontend URL (including protocol)

----

## **12. Deliverables Checklist**

This section confirms the assignment’s required deliverables:

- **GitHub repository** with `/client`(frontend) and `/server`(backend)
- **Environment variables documented** in `.env.example`
- **Relational database schema using PostgreSQL**
- **At least one related table** (`Generation.languageId → Language.id`)
- **ER Diagram** included in `/docs/er-diagram.png`
- **Migration SQL or schema definition** included
- **Seed file** (`prisma/seed.js`) to populate languages
- **Fully implemented REST API:**

  - `POST /api/generate`
  - `GET /api/history`
  - `GET /api/languages`

- **Pagination implemented** using page + limit
- **Complexity and indexing explanation** included (as required)
- **Working deployed demo** (Vercel + Render + PostgreSQL)
- **2–3 minute recorded demo video**

---

## **13. Migration Scripts / SQL Schema**

Although Prisma is used with `prisma db push`, the assignment requires at least one SQL schema or migration script.
The following SQL represents the schema of this project:

```sql
-- Languages table
CREATE TABLE "Language" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  extension VARCHAR(32)
);

-- Generations table
CREATE TABLE "Generation" (
  id SERIAL PRIMARY KEY,
  prompt TEXT NOT NULL,
  code TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "languageId" INTEGER NOT NULL REFERENCES "Language"(id) ON DELETE CASCADE
);
```

### Optional recommended indexes for performance:

```sql
CREATE INDEX idx_generation_createdat ON "Generation" ("createdAt" DESC);
CREATE INDEX idx_generation_languageId ON "Generation" ("languageId");
```

These indexes improve pagination and filtering performance.

---

## **14. Submission Checklist (Final)**

- README (this file)
- Prisma schema
- SQL schema / migration equivalent
- Seed script
- ER diagram image
- Full deployment (Vercel + Render)
- Video demonstration
- Environment variables documented

---


