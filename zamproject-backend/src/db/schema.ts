// src/db/schema.ts
// Drizzle schema mirroring the exact Supabase database structure

import { pgTable, uuid, text, boolean, timestamp, numeric, date } from 'drizzle-orm/pg-core'

// ------------------------------------------------------------
// badges
// ------------------------------------------------------------
export const badges = pgTable('badges', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  tier_required: text('tier_required').notNull(),
  description: text('description'),
  icon_url: text('icon_url'),
  allows_event_booking: boolean('allows_event_booking').notNull().default(false),
  allows_guest_pass: boolean('allows_guest_pass').notNull().default(false),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// ------------------------------------------------------------
// members
// ------------------------------------------------------------
export const members = pgTable('members', {
  id: uuid('id').primaryKey().defaultRandom(),
  auth_user_id: uuid('auth_user_id'),
  badge_id: uuid('badge_id').references(() => badges.id),
  email: text('email').notNull(),
  name: text('name').notNull(),
  tier: text('tier').notNull().default('Explorer'),
  status: text('status').notNull().default('INACTIVE'),
  role: text('role').notNull().default('member'),
  clearance: text('clearance').notNull().default('INTERNAL'),
  title: text('title'),
  location: text('location'),
  member_since: date('member_since'),
  avatar_url: text('avatar_url'),
  display_level: text('display_level').notNull().default('Level 1 Applicant'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ------------------------------------------------------------
// upgrade_requests
// ------------------------------------------------------------
export const upgrade_requests = pgTable('upgrade_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  member_id: uuid('member_id').notNull().references(() => members.id),
  reviewed_by: uuid('reviewed_by').references(() => members.id),
  from_tier: text('from_tier').notNull(),
  to_tier: text('to_tier').notNull(),
  status: text('status').notNull().default('PENDING'),
  payment_reference: text('payment_reference'),
  payment_verified: boolean('payment_verified').notNull().default(false),
  admin_notes: text('admin_notes'),
  reviewed_at: timestamp('reviewed_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ------------------------------------------------------------
// tier_change_history
// ------------------------------------------------------------
export const tier_change_history = pgTable('tier_change_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  member_id: uuid('member_id').notNull().references(() => members.id),
  changed_by: uuid('changed_by').references(() => members.id),
  previous_tier: text('previous_tier').notNull(),
  new_tier: text('new_tier').notNull(),
  changed_at: timestamp('changed_at', { withTimezone: true }).notNull().defaultNow(),
})

// ------------------------------------------------------------
// profit_distributions
// ------------------------------------------------------------
export const profit_distributions = pgTable('profit_distributions', {
  id: uuid('id').primaryKey().defaultRandom(),
  member_id: uuid('member_id').notNull().references(() => members.id),
  amount: numeric('amount').notNull(),
  period_month: date('period_month').notNull(),
  tier_at_time: text('tier_at_time').notNull(),
  status: text('status').notNull().default('PENDING'),
  paid_at: timestamp('paid_at', { withTimezone: true }),
  notes: text('notes'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// ------------------------------------------------------------
// notifications
// ------------------------------------------------------------
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  member_id: uuid('member_id').notNull().references(() => members.id),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  read: boolean('read').notNull().default(false),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// ------------------------------------------------------------
// event_bookings
// ------------------------------------------------------------
export const event_bookings = pgTable('event_bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  member_id: uuid('member_id').notNull().references(() => members.id),
  event_name: text('event_name').notNull(),
  event_date: date('event_date').notNull(),
  includes_guest_pass: boolean('includes_guest_pass').notNull().default(false),
  booking_status: text('booking_status').notNull().default('CONFIRMED'),
  booked_at: timestamp('booked_at', { withTimezone: true }).notNull().defaultNow(),
})
