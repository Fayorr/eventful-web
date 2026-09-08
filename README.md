# Eventful Web V2

The React and TypeScript client for Eventful. It covers confirmed-email signup,
event discovery and sharing, Paystack checkout, QR tickets and scanning, personal
reminders, and the creator analytics dashboard.

- Frontend: <https://eventfulapp-api.vercel.app>
- Backend API: <https://eventful-api.hostless.app/api/v2>

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

The app preserves an explicit version in `VITE_API_URL` (`/api/v1` or `/api/v2`).
If no version is provided, it falls back to the currently deployed `/api/v1` API.
Switch the production value to `/api/v2` when Backend V2 is deployed.

## Quality checks

```bash
npm run lint
npm run build
```
