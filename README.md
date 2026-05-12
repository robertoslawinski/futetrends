# FuteTrends

FuteTrends is a full-stack MVP for a free points-based prediction game around Brazilian football signals.

It is not a betting product: there are no odds, deposits, withdrawals, stakes, payouts, or real-money wagering.

## Folder Structure

```text
futetrends/
  backend/   Node.js, Express, MongoDB, Mongoose, JWT auth
  frontend/  React, Vite, React Router, Axios, CSS Modules
```

## Local Setup

1. Install dependencies:

```bash
npm install --prefix backend
npm install --prefix frontend
```

2. Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Update `backend/.env` with `MONGODB_URI`, `JWT_SECRET`, and admin credentials.

4. Seed launch markets and admin:

```bash
npm run seed --prefix backend
```

5. Run the API and frontend:

```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

Frontend: `http://localhost:5173`  
Backend health: `http://localhost:5000/health`

## Admin

Create or update an admin without resetting seed data:

```bash
npm run create-admin --prefix backend
```

Admin users can create, edit, delete, and resolve markets. Resolving a market distributes points to correct predictions and updates user accuracy stats.

## API Routes

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/verify`
- `GET /api/predictions`
- `GET /api/predictions/:id`
- `POST /api/predictions`
- `PUT /api/predictions/:id`
- `DELETE /api/predictions/:id`
- `PUT /api/predictions/:id/resolve`
- `POST /api/predictions/:id/vote`
- `GET /api/ranking`
- `GET /api/users/me`

## Deployment

### Backend on Render

Create a Render Web Service from `backend`.

- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_ORIGIN`

After deployment, run the seed script once from a Render shell or locally against MongoDB Atlas.

### Frontend on Netlify

Create a Netlify site from `frontend`.

- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables: `VITE_API_URL`, optional `VITE_GA_MEASUREMENT_ID`

Point `futetrends.com` to Netlify and configure the canonical production URL.

## Analytics

Set `VITE_GA_MEASUREMENT_ID` to enable Google Analytics events:

- `page_view`
- `market_opened`
- `vote_submitted`
- `login_completed`
- `sign_up_completed`
