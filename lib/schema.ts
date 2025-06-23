import { pgTable, uuid, text, integer, boolean, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Enums
export const recommendationStatusEnum = pgEnum('recommendation_status', ['not-started', 'in-progress', 'completed']);

// Tables
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  location: text('location'),
  carbonGoal: integer('carbon_goal').default(2000),
  onboardingCompleted: boolean('onboarding_completed').default(false),
  emailVerified: boolean('email_verified').default(false),
  subscribeNewsletter: boolean('subscribe_newsletter').default(false),
  signupSource: text('signup_source').default('web'),
  avatarUrl: text('avatar_url'),
  preferences: jsonb('preferences').default({
    notifications: true,
    publicProfile: false,
    shareProgress: false
  }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const carbonCalculations = pgTable('carbon_calculations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  calculationData: jsonb('calculation_data').notNull(),
  results: jsonb('results').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const recommendations = pgTable('recommendations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  recommendationData: jsonb('recommendation_data').notNull(),
  status: recommendationStatusEnum('status').default('not-started'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: text('token').unique().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertCarbonCalculationSchema = createInsertSchema(carbonCalculations);
export const selectCarbonCalculationSchema = createSelectSchema(carbonCalculations);
export const insertRecommendationSchema = createInsertSchema(recommendations);
export const selectRecommendationSchema = createSelectSchema(recommendations);
export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens);
export const selectPasswordResetTokenSchema = createSelectSchema(passwordResetTokens);

// Types
export type User = z.infer<typeof selectUserSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;
export type CarbonCalculation = z.infer<typeof selectCarbonCalculationSchema>;
export type NewCarbonCalculation = z.infer<typeof insertCarbonCalculationSchema>;
export type Recommendation = z.infer<typeof selectRecommendationSchema>;
export type NewRecommendation = z.infer<typeof insertRecommendationSchema>;
export type PasswordResetToken = z.infer<typeof selectPasswordResetTokenSchema>;
export type NewPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;