import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================
// SHOPS — Do'konlar
// ============================================================
export const shops = pgTable("shops", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  subdomain: varchar("subdomain", { length: 100 }).unique(),
  description: text("description"),
  logo: text("logo"),
  coverImage: text("cover_image"),
  address: text("address"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  telegramContact: text("telegram_contact"),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// SHOP SETTINGS — Do'kon sozlamalari
// ============================================================
export const shopSettings = pgTable("shop_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  shopId: uuid("shop_id")
    .references(() => shops.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  language: varchar("language", { length: 5 }).default("uz").notNull(),
  currency: varchar("currency", { length: 5 }).default("uzs").notNull(),
  timezone: varchar("timezone", { length: 50 }).default("Asia/Tashkent").notNull(),
  theme: varchar("theme", { length: 10 }).default("light").notNull(),
  telegramNotifications: boolean("telegram_notifications").default(true),
  pushNotifications: boolean("push_notifications").default(true),
  customTheme: jsonb("custom_theme"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// SHOP AI SETTINGS — AI konsultant sozlamalari
// ============================================================
export const shopAiSettings = pgTable("shop_ai_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  shopId: uuid("shop_id")
    .references(() => shops.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  systemPrompt: text("system_prompt"),
  chatStyle: jsonb("chat_style"),
  behavior: jsonb("behavior"),
  accessCode: varchar("access_code", { length: 10 }),
  telegramBotConnected: boolean("telegram_bot_connected").default(false),
  telegramChatId: text("telegram_chat_id"),
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
export const shopsRelations = relations(shops, ({ one, many }) => ({
  settings: one(shopSettings, {
    fields: [shops.id],
    references: [shopSettings.shopId],
  }),
  aiSettings: one(shopAiSettings, {
    fields: [shops.id],
    references: [shopAiSettings.shopId],
  }),
}));

export const shopSettingsRelations = relations(shopSettings, ({ one }) => ({
  shop: one(shops, {
    fields: [shopSettings.shopId],
    references: [shops.id],
  }),
}));

export const shopAiSettingsRelations = relations(shopAiSettings, ({ one }) => ({
  shop: one(shops, {
    fields: [shopAiSettings.shopId],
    references: [shops.id],
  }),
}));
