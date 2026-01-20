# Deployment Guide to Render.com

This guide explains how to deploy your **iSooKO** Course Platform API to **Render.com**.

## Prerequisites

1.  **GitHub Repository**: Ensure your code is pushed to GitHub (we just did this).
2.  **Neon Database**: You already have your PostgreSQL database on Neon.
3.  **Render Account**: Sign up at [render.com](https://render.com).

## Step 1: Create a Web Service

1.  Log in to your Render Dashboard.
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub account and select your repository (`iSooKO`).
4.  Configure the following settings:
    *   **Name**: `isooko-api` (or any unique name)
    *   **Region**: Choose one close to you (e.g., Oregon, Frankfurt).
    *   **Branch**: `main`
    *   **Root Directory**: `.` (leave empty)
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install && npx prisma generate && npm run build`
    *   **Start Command**: `npm run start:prod`

## Step 2: Environment Variables

Click on **Environment** (or "Advanced") and add the following keys. **Copy these values from your local `.env` file**:

| Key | Value Description |
| --- | --- |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Your Neon DB connection string (starts with `postgresql://...`) |
| `JWT_SECRET` | Your secure random secret key |
| `JWT_EXPIRES_IN` | `7d` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Your email address |
| `SMTP_PASS` | Your email app password |
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth Client Secret |
| `GOOGLE_CALLBACK_URL` | `https://<YOUR-RENDER-APP-NAME>.onrender.com/auth/google/callback` **(Important: Update this!)** |

> **Note**: For Redis, if you are using a cloud Redis (like Upstash), add:
> `REDIS_HOST`, `REDIS_PORT`, etc.
> If you are NOT using Redis yet, you can skip those, but ensure your code doesn't try to connect to localhost.

## Step 3: Database Migrations (Important)

Your production database needs the schema tables. You can run this command automatically during build, or run it manually.

**Recommended**: Update your **Build Command** to include migration deploy:

```bash
npm install && npx prisma generate && npx prisma migrate deploy && npm run build
```

*   `npx prisma migrate deploy`: Applies pending migrations to production DB without resetting data.

## Step 4: Accessing API Documentation

Once deployed, Render will give you a URL like:
`https://isooko-api.onrender.com`

Your API documentation (Swagger) will be available at:
👉 **`https://isooko-api.onrender.com/api-docs`**

## Step 5: Update Google OAuth Redirect URI

1.  Go to **Google Cloud Console**.
2.  Edit your OAuth Client.
3.  Add your **new Render URL** to "Authorized redirect URIs":
    *   `https://isooko-api.onrender.com/auth/google/callback`
    *   (Replace `isooko-api` with your actual Render app name).

## Troubleshooting

*   **Logs**: Check the "Logs" tab in Render dashboard if the deployment fails.
*   **Port**: Render automatically sets the `PORT` env var. Your code uses `process.env.PORT`, so it will work automatically.
*   **Database Connection**: If you get connection errors, ensure your Neon DB allows connections from anywhere (0.0.0.0/0) or check if you need IP whitelisting. Default Neon setup allows all.
