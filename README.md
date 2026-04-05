# Fireverse v1.1 — Fire/Public Safety Management System

**Client:** MFES – Maharashtra Fire & Emergency Services (NMMC)
**Platform:** Cloud-hosted Web + Mobile (iOS & Android) + GPS IoT
**Stack:** Node.js · Express · Prisma · PostgreSQL · React · IBM Carbon Design System

---

## Modules

| # | Module |
|---|--------|
| 1 | Fire Administrative Module |
| 2 | NOC Management Module |
| 3 | Systematic Fire / Building Inspection |
| 4 | Digitalization & Renewal Management |
| 5 | Fire Store / Equipment Management |
| 6 | Fire Vehicle Management / GPS Tracking |
| 7 | Incident Management |
| 8 | Training & Drill Activity Management |
| 9 | Mock Drill Management |
| 10 | Audit Management |

---

## Quick Start

```bash
cp .env.example .env          # fill in secrets
npm run install:all           # install all dependencies
docker-compose up -d postgres # start postgres
cd backend && npx prisma migrate dev --name init
cd backend && npx prisma db seed
npm run dev                   # start backend + frontend
```

Open http://localhost:5173 → Login as:
- **Email:** superadmin@fireverse.gov.in
- **Password:** Fire@Admin#2026

---

## Deployment (Railway)

See `railway.json` for service config.
Set all variables from `.env.example` in Railway dashboard.
