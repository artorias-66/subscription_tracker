📌 SubDub – Subscription Tracker

SubDub is a subscription tracking application built with Node.js, Express, MongoDB, and React.
It helps users manage subscriptions, sends automated renewal reminders via email, and integrates with Upstash QStash Workflows for scheduling.

✨ Features

🔐 Authentication (JWT-based: signup, login, logout)

👤 User Management (fetch all users, fetch single user)

📦 Subscription Management

Create subscriptions

Fetch user subscriptions

Associate subscriptions with users

📧 Automated Reminder Emails with Nodemailer + Templates

⚡ Upstash Workflows for scheduling reminders

🛡️ Arcjet Security for rate limiting & bot detection

🏗️ Tech Stack

Backend: Node.js, Express

Database: MongoDB + Mongoose

Auth: JWT + bcryptjs

Email: Nodemailer (Gmail SMTP)

Scheduling: Upstash QStash Workflows

Security: Arcjet (rate limiting, bot detection)

📂 Project Structure
subscription_tracker/
├── config/              # App config (env, db, email, upstash, arcjet)
├── controllers/         # Request handlers (auth, user, subscription)
├── models/              # Mongoose schemas (User, Subscription)
├── utils/               # Helper utilities (email templates, send-email)
├── app.js               # Express app setup
├── package.json         # Dependencies and scripts
└── README.md            # Project docs

⚙️ Installation & Setup
1️⃣ Clone the repo
git clone https://github.com/artorias-66/subscription_tracker.git
cd subscription_tracker

2️⃣ Install dependencies
npm install

3️⃣ Configure environment

Create a .env.development.local file:

PORT=5000
NODE_ENV=development
SERVER_URL=http://localhost:5000

DB_URI=mongodb://localhost:27017/subdub

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development

QSTASH_TOKEN=your_qstash_token
QSTASH_URL=https://qstash.upstash.io

EMAIL_PASSWORD=your_gmail_app_password


⚠️ Use a Gmail App Password (not your main Gmail password).

4️⃣ Run the server
npm run dev

🔑 API Endpoints
Auth
Signup
POST /api/v1/auth/signup


Body

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}

Signin
POST /api/v1/auth/signin


Body

{
  "email": "john@example.com",
  "password": "123456"
}

Users
Get All Users
GET /api/v1/users

Get User by ID
GET /api/v1/users/:id

Subscriptions
Create Subscription
POST /api/v1/subscriptions


Body

{
  "name": "Netflix",
  "price": 499,
  "currency": "INR",
  "frequency": "monthly",
  "renewalDate": "2025-09-15",
  "paymentMethod": "Credit Card"
}

Get User Subscriptions
GET /api/v1/users/:id/subscriptions

📧 Email Reminder Templates

SubDub supports multiple reminder email templates:

reminder_7days → "Your subscription renews in 7 days"

reminder_5days → "Your subscription renews in 5 days"

reminder_2days → "Your subscription renews in 2 days"

reminder_1day → "Final reminder – renews tomorrow"

Each template automatically fills in:

User’s name

Subscription name

Renewal date

Price & plan

Payment method

🚀 Roadmap

 Add frontend (React) integration

 Add notifications (SMS, WhatsApp)

 Add payment history tracking

 Add admin dashboard

🤝 Contributing

Fork the repo

Create a new branch: git checkout -b feature-xyz

Commit your changes: git commit -m "Added feature xyz"

Push to branch: git push origin feature-xyz

Open a Pull Request

📜 License

MIT License © 2025 Anubhav Verma
