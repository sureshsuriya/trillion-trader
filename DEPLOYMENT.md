# Deployment Guide: Trillion Trader

This document provides step-by-step instructions for deploying the Trillion Trader application to production.

## Architecture Overview
- **Frontend**: React (Vite, TypeScript, TailwindCSS) -> Deployed to **Vercel**
- **Backend**: Spring Boot (Java 21, Spring Security, JWT) -> Deployed to **Render** (via Docker)
- **Database**: MongoDB -> Deployed to **MongoDB Atlas**

---

## 1. Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Database Access**, create a user with read/write privileges.
3. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere) so Render can connect.
4. Click **Connect** -> **Connect your application** and copy the URI.
5. Replace `<password>` with the database user's password. This is your `MONGO_URI`.

---

## 2. Backend (Render)
The backend is dockerized and ready for deployment using `render.yaml` infrastructure-as-code.

1. Create an account on [Render](https://render.com).
2. Go to **Dashboard** -> **Blueprints** -> **New Blueprint Instance**.
3. Connect your GitHub repository.
4. Render will automatically read the `render.yaml` file in the root and prepare the `trillion-trader-backend` service.
5. Provide the required Environment Variables in the Render Dashboard (under the service's **Environment** tab):
   - `SPRING_PROFILES_ACTIVE`: `prod`
   - `MONGO_URI`: The MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure, random 256-bit string.
   - `CORS_ALLOWED_ORIGINS`: The URL of your Vercel frontend (e.g., `https://trillion-trader.vercel.app`).

6. Deploy the application. Note the provided Render URL (e.g., `https://trillion-trader-backend.onrender.com`).

---

## 3. Frontend (Vercel)
The frontend is pre-configured for Vercel with a `vercel.json` file for routing.

1. Create an account on [Vercel](https://vercel.com).
2. Go to **Dashboard** -> **Add New** -> **Project**.
3. Import your GitHub repository.
4. **Important**: Change the "Root Directory" to `frontend`.
5. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: The URL of your Render backend + `/api/v1` (e.g., `https://trillion-trader-backend.onrender.com/api/v1`).
6. Click **Deploy**.

---

## 4. Final Security Checklist
- [ ] No `.env` files are checked into version control.
- [ ] The `JWT_SECRET` is strong and securely stored.
- [ ] Swagger API documentation is disabled in production (automatically handled by the `prod` profile).
- [ ] CORS is restricted strictly to the frontend domain.
- [ ] Passwords and sensitive data are never logged.
