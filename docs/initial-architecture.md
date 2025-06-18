You're aiming to build a modern, scalable **Next.js** application with a
**petrol billing system** + **store inventory** + **multi-role user dashboard**
backed by **Supabase**. Below is a **production-grade GitHub Copilot prompt**
designed for generating code with:

-  Clean architecture
-  Strict **SRP (Single Responsibility Principle)**
-  **DRY** code practices
-  Scalable folder structure
-  Modern **UI/UX** using **shadcn/ui + TailwindCSS**

---

## ✅ GitHub Copilot Prompt (Paste into your index.tsx or Copilot chat)

```ts
/**
 * 🚀 Build a full-stack petrol bulk management system using:
 * ➤ Frontend: Next.js (App Router), React, TypeScript, zustand
 * ➤ UI: TailwindCSS, shadcn/ui
 * ➤ Backend: Supabase (Database, Auth, Storage, Realtime)
 * 
 * 🎯 Goals:
 * Build a responsive, modular web app that supports:
 * 
 * ✅ Features:
 * 1. Auth System:
 *    - Role-based login (Admin, Manager, Shift Operator - I/II/III)
 *    - Supabase Auth with JWT and RBAC
 * 
 * 2. Petrol Billing (Daily Shift Readings):
 *    - Enter pump opening/closing meter
 *    - Compute litres sold * current price
 *    - Assign pump ID, shift ID, fuel type (MS/HSD)
 * 
 * 3. Shift Checkout:
 *    - Accept payment modes (Cash, Card, UPI)
 *    - Enter cash denominations
 *    - Auto compute expected vs actual
 *    - Highlight variances

 * 4. MIS Daily Sales:
 *    - Aggregate shift data (Sales, Payments, Variance)
 *    - Price history log for MS & HSD
 *    - Net revenue computation

 * 5. Store Module:
 *    - CRUD products (store items sold at petrol bulk)
 *    - Add to bill (POS style)
 *    - Checkout & save invoice
 *    - Link store sales to shift

 * 6. Reports:
 *    - Daily / Monthly / Yearly summary for:
 *      a. Fuel Sales
 *      b. Store Sales
 *      c. Combined MIS
 *    - Download as PDF or Excel

 * 7. Admin Tools:
 *    - Manage pumps, users, roles, fuel price updates
 *    - View audit logs

 * 8. Dashboard:
 *    - Charts: fuel usage, payment trends, store sales
 *    - Cards: Net Sales, Variance, Shift-wise totals

 * ✅ Tech Guidelines:
 * - Use `app/` directory with layout.tsx and nested routing
 * - Use Server Components by default; Client only when needed
 * - Follow SRP: one component → one purpose
 * - DRY: use reusable hooks, components, services
 * - Maintain SOLID principles in data & service layers
 * - Use `zod` for schema validation
 * - Tailwind + shadcn/ui for consistent design

 * ✅ Code Structure:
 * - components/ui/           → UI primitives (buttons, modals, tables)
 * - components/forms/        → Domain-specific forms (ShiftForm, ProductForm)
 * - app/(auth|dashboard)/    → Routes grouped by purpose
 * - lib/                     → Helper functions (price calc, formatting, etc.)
 * - hooks/                   → Custom React hooks (useShift, useStoreBilling)
 * - services/                → Supabase DB/Storage/API calls
 * - types/                   → Centralized TS interfaces & enums
 * - context/                 → AuthContext, ShiftContext
 * 
 * ✅ UI/UX:
 * - Responsive design (mobile-friendly)
 * - Card-based layout for dashboard
 * - Table with filters for reports
 * - Modal for actions (Add Shift, Add Product, etc.)
 * - Notifications on success/error
 * 
 * 🛠️ Start by generating:
 * - Folder structure
 * - <ShiftReadingForm />
 * - <StoreBillingForm />
 * - supabaseService.ts
 * - useShiftData() hook
 * - admin/(pump-management)/page.tsx
 * - dashboard/overview/page.tsx
 */
```

---

## 🗂 Suggested Folder Structure (Next.js App Router)

```
app/
├── layout.tsx
├── page.tsx
├── login/
│   └── page.tsx
├── dashboard/
│   ├── layout.tsx
│   ├── overview/page.tsx
│   ├── shift/
│   │   ├── new/page.tsx
│   │   └── report/page.tsx
│   └── store/
│       ├── new/page.tsx
│       └── report/page.tsx
├── admin/
│   ├── users/page.tsx
│   ├── pumps/page.tsx
│   └── prices/page.tsx

components/
├── ui/                    # shadcn-based UI components
├── forms/
│   ├── ShiftForm.tsx
│   ├── StoreBillingForm.tsx
│   └── LoginForm.tsx
├── dashboard/
│   ├── SalesCard.tsx
│   ├── ShiftTable.tsx
│   └── Charts.tsx

hooks/
├── useShiftData.ts
├── useStoreBilling.ts

services/
├── supabaseClient.ts
├── shiftService.ts
├── storeService.ts
├── authService.ts

lib/
├── calcFuelSales.ts
├── formatCurrency.ts
├── generateReport.ts

types/
├── shift.ts
├── user.ts
├── store.ts
```

---
