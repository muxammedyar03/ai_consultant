import {
  pgTable,
  uuid,
  text,
  timestamp,
  varchar,
  decimal,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { shops } from "./shops";

// ============================================================
// ENUMS
// ============================================================
export const billingPlanTypeEnum = pgEnum("billing_plan_type", [
  "free",
  "pro",
  "enterprise",
]);

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "pending",
  "paid",
  "overdue",
  "cancelled",
]);

// ============================================================
// BILLING PLANS — Tarif rejalari
// ============================================================
export const billingPlans = pgTable("billing_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  type: billingPlanTypeEnum("type").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 5 }).default("uzs").notNull(),
  maxProducts: integer("max_products"),
  maxUsers: integer("max_users"),
  maxAiRequests: integer("max_ai_requests"),
  features: text("features").array(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// SHOP BILLING — Do'kon billing
// ============================================================
export const shopBilling = pgTable("shop_billing", {
  id: uuid("id").defaultRandom().primaryKey(),
  shopId: uuid("shop_id")
    .references(() => shops.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  planId: uuid("plan_id")
    .references(() => billingPlans.id)
    .notNull(),
  startDate: timestamp("start_date", { withTimezone: true })
    .defaultNow()
    .notNull(),
  endDate: timestamp("end_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// INVOICES — Hisob-fakturalar
// ============================================================
export const invoices = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  shopId: uuid("shop_id")
    .references(() => shops.id, { onDelete: "cascade" })
    .notNull(),
  invoiceNumber: varchar("invoice_number", { length: 50 }).unique().notNull(),
  status: invoiceStatusEnum("status").default("draft").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 5 }).default("uzs").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date", { withTimezone: true }),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// RELATIONS
// ============================================================
export const billingPlansRelations = relations(billingPlans, ({ many }) => ({
  shopBillings: many(shopBilling),
}));

export const shopBillingRelations = relations(shopBilling, ({ one }) => ({
  shop: one(shops, {
    fields: [shopBilling.shopId],
    references: [shops.id],
  }),
  plan: one(billingPlans, {
    fields: [shopBilling.planId],
    references: [billingPlans.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  shop: one(shops, { fields: [invoices.shopId], references: [shops.id] }),
}));
