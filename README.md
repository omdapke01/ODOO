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
- Currency conversion is supported, but for full live conversion we got to add API
- This is currently a working prototype made for local use and demonstration.

## Rules

The Rules tab controls how an expense gets approved.

It lets the admin decide:

which approval style to use
which expense amounts the rule applies to
whether a manager or admin must approve
whether all approvals are needed or only a percentage
In simple terms, rules tell the system what path an expense should follow after it is submitted.

What the fields mean:

Type: decides the approval style, like one-by-one or condition-based
Threshold: used when only part of the approvers are enough, like 60%
Specific role: tells the system if a special role like Admin or Manager must be included
Min: the smallest expense amount this rule applies to
Max: the biggest expense amount this rule applies to
Example:

if a rule says SEQUENTIAL, MANAGER, 0 to 5000, then any expense in that amount range goes to the manager for approval
if a rule says HYBRID, 0.6, ADMIN, 5000+, then larger expenses need a stronger approval condition and admin involvement
So the Rules tab is basically the company’s approval policy setup page.
