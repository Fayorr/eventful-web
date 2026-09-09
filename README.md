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

`VITE_API_URL` contains the backend origin. The client uses the deployed `/api/v2`
API automatically.

## Quality checks

```bash
npm run lint
npm run build
```
