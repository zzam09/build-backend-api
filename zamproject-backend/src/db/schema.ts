import { pgTable, text, timestamp, numeric, uuid, boolean, integer, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const memberRoleEnum = pgEnum('member_role', ['admin', 'moderator', 'member']);
export const badgeTypeEnum = pgEnum('badge_type', ['achievement', 'participation', 'leadership', 'contribution']);
export const notificationTypeEnum = pgEnum('notification_type', ['event', 'badge', 'system', 'upgrade']);
export const eventStatusEnum = pgEnum('event_status', ['upcoming', 'ongoing', 'completed', 'cancelled']);
export const upgradeStatusEnum = pgEnum('upgrade_status', ['pending', 'approved', 'rejected', 'completed']);
export const profitStatusEnum = pgEnum('profit_status', ['pending', 'approved', 'distributed', 'cancelled']);

// Users Table (Auth)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: text('password').notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  avatar: text('avatar'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Members Table
export const members = pgTable('members', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).unique().notNull(),
  username: varchar('username', { length: 100 }).unique().notNull(),
  bio: text('bio'),
  role: memberRoleEnum('role').default('member'),
  joinedAt: timestamp('joined_at').defaultNow(),
  points: numeric('points', { precision: 10, scale: 2 }).default('0'),
  level: integer('level').default(1),
  profilePicture: text('profile_picture'),
  isVerified: boolean('is_verified').default(false),
  verifiedAt: timestamp('verified_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Badges Table
export const badges = pgTable('badges', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  icon: text('icon'),
  type: badgeTypeEnum('type').notNull(),
  criteria: text('criteria'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Member Badges (Join Table)
export const memberBadges = pgTable('member_badges', {
  id: uuid('id').primaryKey().defaultRandom(),
  memberId: uuid('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  badgeId: uuid('badge_id').references(() => badges.id, { onDelete: 'cascade' }).notNull(),
  awardedAt: timestamp('awarded_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Notifications Table
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  memberId: uuid('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  type: notificationTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message'),
  relatedId: uuid('related_id'), // References event, badge, etc.
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Events Table
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  image: text('image'),
  location: varchar('location', { length: 255 }),
  status: eventStatusEnum('status').default('upcoming'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  maxAttendees: integer('max_attendees'),
  createdBy: uuid('created_by').references(() => members.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Event Bookings Table
export const eventBookings = pgTable('event_bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  memberId: uuid('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  status: varchar('status', { length: 50 }).default('confirmed'),
  bookedAt: timestamp('booked_at').defaultNow(),
  attendedAt: timestamp('attended_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Upgrade Requests Table
export const upgradeRequests = pgTable('upgrade_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  memberId: uuid('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  fromRole: memberRoleEnum('from_role').notNull(),
  toRole: memberRoleEnum('to_role').notNull(),
  status: upgradeStatusEnum('status').default('pending'),
  reason: text('reason'),
  reviewedBy: uuid('reviewed_by').references(() => members.id, { onDelete: 'set null' }),
  reviewedAt: timestamp('reviewed_at'),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Profit Distributions Table
export const profitDistributions = pgTable('profit_distributions', {
  id: uuid('id').primaryKey().defaultRandom(),
  memberId: uuid('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  status: profitStatusEnum('status').default('pending'),
  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end').notNull(),
  distributedAt: timestamp('distributed_at'),
  transactionId: varchar('transaction_id', { length: 255 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  member: one(members, {
    fields: [users.id],
    references: [members.userId],
  }),
}));

export const membersRelations = relations(members, ({ one, many }) => ({
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  badges: many(memberBadges),
  notifications: many(notifications),
  eventBookings: many(eventBookings),
  eventsCreated: many(events),
  upgradeRequests: many(upgradeRequests),
  profitDistributions: many(profitDistributions),
}));

export const badgesRelations = relations(badges, ({ many }) => ({
  members: many(memberBadges),
}));

export const memberBadgesRelations = relations(memberBadges, ({ one }) => ({
  member: one(members, {
    fields: [memberBadges.memberId],
    references: [members.id],
  }),
  badge: one(badges, {
    fields: [memberBadges.badgeId],
    references: [badges.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  member: one(members, {
    fields: [notifications.memberId],
    references: [members.id],
  }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  creator: one(members, {
    fields: [events.createdBy],
    references: [members.id],
  }),
  bookings: many(eventBookings),
}));

export const eventBookingsRelations = relations(eventBookings, ({ one }) => ({
  event: one(events, {
    fields: [eventBookings.eventId],
    references: [events.id],
  }),
  member: one(members, {
    fields: [eventBookings.memberId],
    references: [members.id],
  }),
}));

export const upgradeRequestsRelations = relations(upgradeRequests, ({ one }) => ({
  member: one(members, {
    fields: [upgradeRequests.memberId],
    references: [members.id],
  }),
  reviewer: one(members, {
    fields: [upgradeRequests.reviewedBy],
    references: [members.id],
  }),
}));

export const profitDistributionsRelations = relations(profitDistributions, ({ one }) => ({
  member: one(members, {
    fields: [profitDistributions.memberId],
    references: [members.id],
  }),
}));
