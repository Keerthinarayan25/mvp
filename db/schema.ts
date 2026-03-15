import { pgTable, serial, varchar, text,timestamp, pgEnum, integer } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role",["developer","founder"]);

export const users = pgTable("users",{
  id: serial("id").primaryKey(),
  name: varchar("name",{length:100}).notNull().unique(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  password: varchar("password",{length:255}).notNull(),
  role:roleEnum("role").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const developerProfiles = pgTable("developer_profiles",{
  id:serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bio: text("bio"),
  skills: text("skills"),
  techStack: text("tech_stack"),
  portfolioLinks: text("portfolio_links"),
  pricingModel: varchar("pricing_model",{length:50}),
  availability: varchar("availability",{length:50}),

});

export const projects = pgTable("projects",{
  id:serial("id").primaryKey(),
  userId: integer("user_id").references(()=> users.id),
  title: varchar("title",{length:200}).notNull(),
  description: varchar("description").notNull(),
  budgetRange: varchar("budget_range",{length:50}),
  timeline: varchar("timeline", {length:50}),
  status: varchar("status",{length:20}).default("open"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const applications = pgTable("application",{
  id:serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  developerId: integer("developer_id").references(()=> users.id),
  proposalMessage: text("proposal_message"),
  status: varchar("status", {length:20}).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

