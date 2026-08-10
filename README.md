# Bacatinta API

Backend API for [Bacatinta](https://bacatinta.com), built with Cloudflare Workers and TypeScript.

The API currently handles:

- Contact form submissions
- Turnstile verification
- Email delivery through Resend
- User confirmation emails
- CORS protection
- Request validation
- Request IDs and structured logging
- Payload size protection
- Cloudflare rate limiting
- Health checks

## Tech Stack

- TypeScript
- Cloudflare Workers
- Wrangler
- Resend
- Cloudflare Turnstile
- Vitest
- Cloudflare Workers Vitest Pool

## Architecture

```text
Request
   │
   ▼
Cloudflare Worker
   │
   ▼
Router
   │
   ├── GET /health
   │
   └── POST /v1/contact
           │
           ▼
      Contact Controller
           │
           ├── Request context
           ├── Payload protection
           ├── Turnstile verification
           ├── Input validation
           │
           ▼
      Contact Service
           │
           ▼
          Resend
         ┌───────┐
         │       │
         ▼       ▼
       Admin   Visitor
       Email   Confirmation