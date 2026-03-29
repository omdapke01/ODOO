# ODOO

ODDO is a simple reimbursement web app for companies.

It helps employees submit expenses, managers review them, and admins control the approval process. The goal is to make reimbursement handling easier by keeping everything in one place: expense submission, receipt upload, approval flow, status tracking, and company user management.

## What This Project Does

With this app, a company can:

- create its workspace
- add employees, managers, and admins
- let employees submit expense claims
- let managers and admins approve or reject claims
- track whether an expense is pending, approved, or rejected
- define approval rules for how claims should move through the system

## Who Uses It

There are 3 main roles:

- `Admin`
  Admin creates users, manages rules, and can see all company expenses.

- `Manager`
  Manager reviews and approves team expenses.

- `Employee`
  Employee submits expenses and tracks their own claims.

## Main Screens

- `Dashboard`
  Shows a summary of spending, approvals, users, and trends.

- `Expenses`
  Used to submit expenses, upload receipts, and view expense history.

- `Users`
  Used by admins to create and manage company users.

- `Rules`
  Used by admins to define how approval should work.

## Tech Used

- React + Tailwind for the frontend
- Node.js + Express for the backend
- Prisma for database access
- SQLite for the current local prototype
- JWT for login/authentication
- Tesseract.js for receipt OCR

## Where Data Is Stored

This prototype uses a local SQLite database file:

- [server/prisma/dev.db](W:\odoo\server\prisma\dev.db)

That means you do not need PostgreSQL to run the current prototype.

## How To Run It

### Start the backend

Open a terminal:

```powershell
cd W:\odoo\server
npm install
npm run dev
```

### Start the frontend

Open another terminal:

```powershell
cd W:\odoo\client
npm install
npm run dev
```

### Open the app

Go to:

- [http://localhost:5173](http://localhost:5173)

## Demo Login Accounts

- `admin@acme.com` / `password123`
- `manager@acme.com` / `password123`
- `employee@acme.com` / `password123`

## Important Notes

- OCR is helpful but not required. If it cannot read a receipt, you can still enter the fields manually.
- Currency conversion is supported, but for full live conversion you should provide an exchange rate API key in the backend `.env`.
- This is currently a working prototype made for local use and demonstration.

## Extra Documentation

If you want a full explanation of how the app works, read:

- [Logic](W:\odoo\Logic)
