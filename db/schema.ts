import { pgTable, serial, varchar, text, timestamp, pgEnum, integer } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["developer", "founder"]);

export const projectStatusEnum = pgEnum("project_status", [
  "open",
  "in_progress",
  "completed",
  "cancelled",
]);

export const applicationStatusEnum =
  pgEnum("application_status", [
    "pending",
    "accepted",
    "rejected",
  ]);

export const contractStatusEnum =
  pgEnum("contract_status", [
    "active",
    "awaiting_handoff",
    "completed",
    "cancelled",
  ]);

export const timelineUnitEnum =
  pgEnum("timeline_unit", [
    "days",
    "weeks",
    "months",
  ]);

export const experienceLevelEnum = pgEnum("experience_level", [
  "entry",
  "intermediate",
  "expert",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  // profileImage: text("profile_image")
  name: varchar("name", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  roles: roleEnum("roles").array().notNull(),
  activeRole: roleEnum("active_role").default("developer"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const developerProfiles = pgTable("developer_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bio: text("bio"),
  skills: text("skills").array(),
  portfolioLinks: text("portfolio_links").array(),
  pricingModel: varchar("pricing_model", { length: 50 }),
  availability: varchar("availability", { length: 50 }),
  category: varchar("category", { length: 100 }),
  education: text("education"),
  languages: text("languages").array(),
  github: varchar("github", { length: 255 }),
  linkedin: varchar("linkedin", { length: 255 }),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),

});

export const founderProfiles = pgTable("founder_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bio: varchar("bio", { length: 200 }),
  companyName: varchar("company_name", { length: 50 }),
  companyDescription: varchar("company_description", { length: 200 }),
  website: varchar("website", { length: 255 }),
  linkedIn: varchar("linkedin", { length: 255 }),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  founderId: integer("founder_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: varchar("description").notNull(),
  budgetMin: integer("budget_min").notNull(),
  budgetMax: integer("budget_max").notNull(),
  currency: varchar("currency", { length: 10 }).default("USD"),
  timelineValue: integer("timeline_value"),
  timelineUnit: timelineUnitEnum("timeline_unit"),
  techStack: text("tech_stack").array(),
  status: projectStatusEnum("status").default("open"),
  experienceLevel: experienceLevelEnum("experience_level")
    .default("intermediate"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  developerId: integer("developer_id").references(() => users.id).notNull(),
  proposalMessage: text("proposal_message").notNull(),
  proposedPrice: integer("proposed_price").notNull(),
  currency: varchar("currency", { length: 10 }).default("USD"),
  deliveryValue: integer("delivery_value"),
  deliveryUnit: timelineUnitEnum("delivery_unit"),
  status: applicationStatusEnum("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  developerId: integer("developer_id").references(() => users.id).notNull(),
  founderId: integer("founder_id").references(() => users.id).notNull(),
  agreedprice: integer("agreed_price"),
  currency: varchar("currency", { length: 10 }).default("USD"),
  deliveryValue: integer("delivery_value"),
  deliveryUnit: timelineUnitEnum("delivery_unit"),
  deadline: timestamp("deadline"),
  status: contractStatusEnum("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").references(() => contracts.id).notNull(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  message_text: text("message_text").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const portfolios = pgTable("portfolios", {

  id: serial("id").primaryKey(),
  developerId: integer("developer_id")
    .references(() => users.id)
    .notNull(),

  title: varchar("title", { length: 255 }),
  description: text("description"),
  projectLink: varchar("project_link", { length: 255 }),
  githubLink: varchar("github_link", { length: 255 })

})


export const deliveries = pgTable("deliveries", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").
    references(() => contracts.id).
    notNull(),

  githubUrl: varchar("github_url", { length: 500 }),
  liveUrl: varchar("live_url", { length: 500 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),

})


export const handoffs = pgTable("handoffs", {
  id: serial("id").primaryKey(),

  contractId: integer("contract_id")
    .references(() => contracts.id)
    .notNull(),

  sourceCodeUrl: varchar("source_code_url", { length: 500 }).notNull(),
  documentationUrl: varchar("documentation_url", { length: 500 }),

  notes: text("notes"),
  createdAt: timestamp("created_at")
    .defaultNow(),
});