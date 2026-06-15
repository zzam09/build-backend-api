# ZAM Project Backend API - Quick Start Guide

## Start the Server
```bash
npm run dev
```
Server starts at `http://localhost:3000`

---

## Test the API

### Health Check
```bash
curl http://localhost:3000/api/health
```
**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-06-15T...",
    "database": "connected"
  }
}
```

### List Members
```bash
curl http://localhost:3000/api/members
```

### Create Member
```bash
curl -X POST http://localhost:3000/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

---

## Deploy Database Schema

After confirming API works, apply migrations:
```bash
npm run db:migrate
```

This creates all 9 tables in your Supabase database.

---

## Useful Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run type-check` | Check TypeScript errors |
| `npm run db:generate` | Generate migrations from schema |
| `npm run db:migrate` | Deploy migrations to database |
| `npm run db:studio` | Open Drizzle Studio UI |
| `npm run build` | Build for production |
| `npm run start` | Start production server |

---

## Key Files

| File | Purpose |
|------|---------|
| `src/db/schema.ts` | Database schema (9 tables) |
| `src/db/client.ts` | Drizzle ORM client |
| `src/lib/validation.ts` | Error handling & response formatting |
| `src/app/api/health/route.ts` | Health check endpoint |
| `src/app/api/members/route.ts` | Members CRUD API |
| `.env.local` | Environment variables |
| `drizzle.config.ts` | Drizzle ORM configuration |

---

## What's Ready ✅

- ✅ Next.js 16 API backend
- ✅ PostgreSQL/Supabase database schema
- ✅ Drizzle ORM configured
- ✅ 9 database tables with relationships
- ✅ Health check endpoint
- ✅ Members API (GET, POST)
- ✅ TypeScript strict mode
- ✅ Validation with Zod
- ✅ Error handling middleware

---

## What's Next ⏳

1. Run `npm run dev` to start the server
2. Test API endpoints with curl or Postman
3. Run `npm run db:migrate` to create database tables
4. Create remaining CRUD endpoints (badges, events, notifications, etc.)
5. Add authentication (JWT or sessions)
6. Add CORS middleware
7. Deploy to Vercel or other hosting

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@[your-project].supabase.co:5432/postgres
NODE_ENV=development
API_PORT=3000
CORS_ORIGIN=http://localhost:3000
```

---

## Database Tables

1. **users** - User accounts
2. **members** - Member profiles with roles
3. **badges** - Achievement badges
4. **member_badges** - Member-badge relationships
5. **notifications** - User notifications
6. **events** - Events/meetings
7. **event_bookings** - Event registrations
8. **upgrade_requests** - Role upgrade requests
9. **profit_distributions** - Profit sharing

See `IMPLEMENTATION_SUMMARY.md` for detailed schema.

---

## Need Help?

- Check `STATUS.md` for detailed progress and remaining tasks
- Check `IMPLEMENTATION_SUMMARY.md` for complete documentation
- Check `src/db/schema.ts` for database structure
- Check `src/lib/validation.ts` for error handling patterns

---

Ready to build! 🚀
