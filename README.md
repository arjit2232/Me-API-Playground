## Me-API Playground

A very small backend + frontend that stores a single candidate profile in MongoDB and exposes it via a REST API, plus a minimal UI to view/edit the data.

### Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB (via Mongoose)
- **Frontend**: Static HTML + vanilla JS (fetching the API)

### Data Model (MongoDB / Mongoose)

- **Profile**
  - **name**: `String` (required)
  - **email**: `String` (required, unique)
  - **education**: `String` (required)
  - **skills**: `String[]`
  - **projects**: array of:
    - **title**: `String` (required)
    - **description**: `String` (required)
    - **links**: `String[]`
  - **workLinks**:
    - **github**: `String`
    - **linkedin**: `String`
    - **portfolio**: `String`

### API Endpoints

- **GET `/health`**
  - Liveness check: returns `{ status: "ok", timestamp: string }`.

- **POST `/api/profile`**
  - Create the single profile (fails with 400 if one already exists).

- **GET `/api/profile`**
  - Read the current profile document.

- **PUT `/api/profile`**
  - Update (or upsert) the single profile.

- **DELETE `/api/profile`**
  - Delete the current profile document.

### Local Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run MongoDB**

   Make sure a local MongoDB instance is running (e.g. default on `mongodb://127.0.0.1:27017`).

3. **Environment variables**

   Create a `.env` file in the project root (same folder as `package.json`):

   ```bash
   MONGO_URI=mongodb://127.0.0.1:27017/me_api_playground
   PORT=4000
   ```

4. **Seed database with a sample profile**

   ```bash
   npm run seed
   ```

5. **Start the server**

   ```bash
   npm start
   ```

   The backend runs on `http://localhost:4000`.

6. **Use the playground frontend**

   - Open `http://localhost:4000/` in your browser.
   - Left side: read-only profile view.
   - Right side: form that performs a **PUT `/api/profile`** to create/update the profile.

### Simple Hosting Notes

- You can deploy the Node.js app to any platform that supports Express (e.g. Render, Railway, Fly.io, or a simple VM).
- Set `MONGO_URI` to your hosted MongoDB connection string (e.g. MongoDB Atlas).
- Ensure the platform serves the `src/public` directory statically (already handled in `server.js`).

