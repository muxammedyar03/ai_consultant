AI Consultant SaaS Platform - Project Documentation
1. Loyiha haqida qisqacha
Ushbu platforma do‘kon egalariga o‘z mahsulotlarini sotish uchun e-commerce sayti va sun’iy intellektga asoslangan Telegram konsultant-botini taqdim etuvchi SaaS tizimidir. AI bot mijozlarga mahsulot tanlashda yordam beradi, savollarga javob beradi va buyurtmalarni qabul qiladi.
2. Arxitektura (System Design)
2.1. Monorepo strukturasi
Loyiha pnpm workspaces yordamida mono-repo ko‘rinishida tashkil etiladi. Bu kodni qayta ishlatish va boshqarishni osonlashtiradi.
code
Text

download

content_copy

expand_less
ai-consultant-monorepo/
├── apps/
│   ├── dashboard/          # Super Admin va Shop Admin (Next.js)
│   ├── storefront/         # Har bir do'kon uchun dinamik sayt (Next.js)
│   ├── bot/                # Telegram Bot AI engine (Node.js/TypeScript)
│   └── landing/            # SaaS marketing sahifasi (Next.js)
├── packages/
│   ├── db/                 # Drizzle ORM, Schema, Migrations
│   ├── ui/                 # Shared UI Components (Shadcn/UI + Tailwind)
│   ├── ai/                 # AI Logic, OpenAI/LangChain utils
│   └── config/             # Shared ESLint, TSConfig, Tailwind Config
├── pnpm-workspace.yaml
└── package.json
2.2. Multi-tenancy (Dinamik subdomenlar)
Har bir do‘kon o‘z subdomeni orqali saytiga ega bo‘ladi (masalan: adidas.platform.uz). Next.js Middleware hostnameni tekshiradi va tegishli do‘kon ma’lumotlarini ko‘rsatadi.
3. Texnologik Stek
Qatlam	Texnologiya
Frontend	Next.js 15 (App Router), Tailwind CSS, Shadcn/UI
Backend API	Next.js Server Actions & Route Handlers
Database	PostgreSQL (Neon yoki Supabase) + pgvector
ORM	Drizzle ORM (Tezkor va SQL-ga yaqin)
Cache & Queue	Redis (Upstash)
AI Engine	OpenAI (GPT-4o), LangChain, Vector Embeddings
Telegram Bot	GrammY yoki Telegraf
Auth	Auth.js (NextAuth v5)
4. Ma’lumotlar Bazasi Sxemasi (Core Tables)
code
TypeScript

download

content_copy

expand_less
// Do'konlar
export const shops = pgTable("shops", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(), // 'adidas', 'nike'
  subdomain: text("subdomain").unique(),
  aiSettings: jsonb("ai_settings"), // Promptlar, behavior
  status: text("status").default("active"),
});

// Foydalanuvchilar va Rollar
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  shopId: uuid("shop_id").references(() => shops.id), // Super Admin uchun null
  role: text("role"), // SUPER_ADMIN, SHOP_ADMIN, SELLER, CUSTOMER
  email: text("email").unique(),
  password: text("password"),
});

// Mahsulotlar (Vector Search uchun embedding bilan)
export const products = pgTable("products", {
  id: uuid("id").primaryKey(),
  shopId: uuid("shop_id").references(() => shops.id),
  name: text("name"),
  description: text("description"),
  price: decimal("price"),
  images: text("images").array(),
  embedding: vector("embedding", { dimensions: 1536 }), // AI qidiruv uchun
});
5. Amalga oshirish bosqichlari (Roadmap)
Phase 1: Poydevor va Auth (Hafta 1-2)
Monorepo strukturasini sozlash.
PostgreSQL va Drizzle ORM migratsiyalarini tayyorlash.
Auth.js orqali Role-based Authentication (Super Admin va Shop Admin) tizimini qurish.
Phase 2: Dashboards (Hafta 3-4)
Super Admin: Do‘konlarni yaratish, billingni boshqarish.
Shop Admin: Mahsulotlar (CRUD), kategoriyalar va do‘kon sozlamalari.
Statistik grafiklar (Redis orqali keshlab ko‘rsatish).
Phase 3: AI Engine va Telegram Bot (Hafta 5-7)
Telegram botni yaratish va Dashboard orqali ulanish (5 xonali kod logikasi).
RAG (Retrieval-Augmented Generation) tizimi: Mahsulotlarni AI tushunishi uchun vektorlashtirish.
NLP qidiruv: "Menga oq paxtali futbolka top" kabi so‘rovlarni tushunish.
Image recognition: Rasm orqali mahsulot topish.
Phase 4: E-commerce Storefront (Hafta 8-9)
Har bir shop uchun subdomen orqali dinamik sayt.
Savat, Sevimlilar va Checkout (To‘lov tizimi integratsiyasi).
Buyurtmalar tarixi va holatini Telegram orqali bildirish.
Phase 5: Automation va Deploy (Hafta 10)
Vercel Workflow orqali 2 kunlik rezervatsiyani avtomatik bekor qilish.
Loyihani Vercel (Web) va Docker (Bot) orqali deploy qilish.
6. Dizayn tizimi (System Design Guidelines)
Atomic Components: packages/ui ichida umumiy tugmalar, modallar, inputlar.
Responsive Layout: Dashboardlarda desktop sidebar, mobile versiyada bottom-nav yoki burger-menu.
Dark/Light Mode: next-themes yordamida barcha dashbord va storefrontlarda qo‘llash.
7. Xavfsizlik va Monitoring
Rate Limiting: Upstash Redis orqali AI so‘rovlarini cheklash.
Audit Logs: Shop admin harakatlarini (mahsulot o‘zgarishi, narxlar) saqlash.
Error Tracking: Sentry integratsiyasi.