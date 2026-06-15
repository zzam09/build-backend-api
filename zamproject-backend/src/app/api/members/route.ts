import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { members, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { ApiErrorHandler, formatApiResponse } from '@/lib/validation';

export const dynamic = 'force-dynamic';

// Validation schemas
const createMemberSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').max(100),
  bio: z.string().optional(),
});

const updateMemberSchema = z.object({
  bio: z.string().optional(),
  profilePicture: z.string().optional(),
}).partial();

// GET /api/members - List all members
export async function GET(request: NextRequest) {
  try {
    const allMembers = await db.query.members.findMany({
      with: {
        user: {
          columns: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        badges: {
          with: {
            badge: true,
          },
        },
      },
      limit: 50,
    });

    return NextResponse.json(
      formatApiResponse(true, allMembers),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[API] GET /members error:', error);
    
    const apiError = ApiErrorHandler.internalServerError();
    return NextResponse.json(
      formatApiResponse(false, undefined, apiError),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// POST /api/members - Create a new member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = createMemberSchema.safeParse(body);
    if (!validation.success) {
      const apiError = ApiErrorHandler.fromZodError(validation.error);
      return NextResponse.json(
        formatApiResponse(false, undefined, apiError),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { email, password, firstName, lastName, username, bio } = validation.data;

    // Check if email already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      const apiError = ApiErrorHandler.conflict('Email already registered');
      return NextResponse.json(
        formatApiResponse(false, undefined, apiError),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if username already exists
    const existingMember = await db.query.members.findFirst({
      where: eq(members.username, username),
    });

    if (existingMember) {
      const apiError = ApiErrorHandler.conflict('Username already taken');
      return NextResponse.json(
        formatApiResponse(false, undefined, apiError),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Create user and member (in a transaction)
    const result = await db.transaction(async (tx: any) => {
      const newUser = await tx.insert(users).values({
        email,
        password, // Note: In production, hash the password using bcrypt or similar
        firstName: firstName || null,
        lastName: lastName || null,
      }).returning();

      const newMember = await tx.insert(members).values({
        userId: newUser[0].id,
        username,
        bio: bio || null,
      }).returning();

      return newMember[0];
    });

    return NextResponse.json(
      formatApiResponse(true, result),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[API] POST /members error:', error);
    
    const apiError = ApiErrorHandler.internalServerError();
    return NextResponse.json(
      formatApiResponse(false, undefined, apiError),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
