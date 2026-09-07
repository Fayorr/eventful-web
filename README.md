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

The app normalizes `VITE_API_URL` to the `/api/v2` backend prefix. Production
values should still include the full API URL shown in `.env.example`.

## Quality checks

```bash
npm run lint
npm run build
```
