Thanks for sharing the petrol bulk **daily sales report** Excel sheet. Here's a
structured breakdown of the **features and functionalities** based on the
analysis of all the sheets:

---

## ✅ **Summary of Each Sheet:**

### 1. **MIS Daily Sales**

-  High-level summary sheet (management overview).
-  Contains:

   -  **Date**
   -  **Net Sales**
   -  **Payments (cash, card, UPI, etc.)**
   -  **Today's Fuel Prices**
   -  **Denomination breakdown** (likely cash counting).

### 2. **Shift I / II / III Checkout Sheets**

-  Daily detailed checkout data for **each shift**.
-  Structure is similar across all shifts.
-  Likely includes:

   -  **Sales by pump**
   -  **Opening/Closing meter readings**
   -  **Cash collected**
   -  **Short/Excess amounts**
   -  **Payment mode splits (cash/card/UPI/etc.)**

-  May include reconciliation formulas to check actual vs system.

### 3. **Shift Reading**

-  Tracks:

   -  **Pump readings per shift**
   -  **Fuel prices (MS - Petrol, HSD - Diesel)**
   -  **Meter reading start/end**
   -  **Sales computed by reading difference**
   -  **Shift-wise total & net sales**

---

## 🔍 Key Features to Build in Website

### 🔧 **User Roles and Login**

-  Admin
-  Manager
-  Operator (for each shift)
-  Each role should have different access levels.

---

### 📄 **Daily Entry Modules**

1. **Shift Reading Entry**

   -  Input: Pump ID, Product Type (MS/HSD), Opening & Closing Meter, Shift
   -  Auto-calculate: **Sales (litres), Sales Amount**
   -  Attach today's price automatically

2. **Shift Checkout**

   -  Input:

      -  Cash received
      -  Payment mode details (UPI, Card, etc.)
      -  Opening/Closing balance
      -  Denominations

   -  Auto-reconcile with expected vs received

3. **MIS Summary**

   -  Auto-generated based on shift data
   -  Include:

      -  Total Sales
      -  Total Collections
      -  Any cash shortage or excess
      -  Denomination counts

---

### 📊 **Reports & Analytics**

-  **MIS Report** (daily/monthly)

   -  Net Sales
   -  Total Payments (mode-wise)
   -  Price Trends

-  **Shift Reports**

   -  Per-shift readings
   -  Pump-wise summary
   -  Sales by product (Petrol/Diesel)

-  **Cash Flow Report**

   -  Expected vs Received
   -  Denomination entry details
   -  Short/Excess tracking

-  **Price Management**

   -  Update today's price
   -  Keep log/history

---

### 🔄 **Calculation & Formula Logic**

All Excel formulas can be re-created on the backend:

-  Sales = `(Closing Reading - Opening Reading) * Price`
-  Net Sales = Sum of shift sales
-  Variance = `System Sales - Cash Received`
-  Auto total based on selected date

---

### 🖥️ **Admin Interface**

-  Add/Edit Pumps
-  Set Fuel Prices
-  View/Edit any past data
-  Download Excel/PDF Reports

---
