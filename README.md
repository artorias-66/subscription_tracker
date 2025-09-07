
# SubDub – Subscription Tracker
SubDub is a subscription tracking service built on Node.js, Express, MongoDB, and React (frontend planned) that manages plans, sends reminder emails, and schedules renewals with Upstash QStash Workflows.  
The goal is a reliable, durable backend with automated retries, scheduled notifications, and sensible security defaults like JWT auth and Arcjet rate limiting.

## Overview
This backend exposes authenticated endpoints for user management and subscription CRUD, plus email reminders via Nodemailer templates and scheduled workflows using Upstash QStash.  
Documentation emphasizes quick start, environment variables, and copy‑paste API examples to minimize time‑to‑first‑request for reviewers and contributors.

## Features
- Authentication with JWT: signup, signin, and protected routes with expirations aligned to common security best practices.  
- User management: fetch all users and a single user resource for administration or dashboards.  
- Subscription management: create subscriptions, fetch a user’s subscriptions, and associate records with users in MongoDB via Mongoose.  
- Email reminders: Nodemailer with templated content and Gmail App Password or OAuth2 guidance for secure transport.  
- Scheduling: Upstash Workflow/QStash for durable steps, retries, delays, and time‑based triggers.  
- Security: Arcjet rate limiting and bot detection patterns, with route‑level or global enforcement options.

## Tech stack
- Backend: Node.js and Express with RESTful routing.  
- Database: MongoDB with Mongoose schemas for User and Subscription entities.  
- Auth: JWT with short‑lived access tokens and rotation guidance.  
- Email: Nodemailer via Gmail SMTP using App Passwords or OAuth2.  
- Scheduling: Upstash QStash Workflows (durable, retryable steps and delays).  
- Security: Arcjet rate limiting patterns for IP, API key, or user characteristics.

## Project structure
A compact, conventional layout keeps configuration, controllers, models, and utilities separate for maintainability and testing clarity.

```
subscription_tracker/
├── config/              # App config (env, db, email, upstash, arcjet)
├── controllers/         # Request handlers (auth, user, subscription)
├── models/              # Mongoose schemas (User, Subscription)
├── utils/               # Helper utilities (email templates, send-email)
├── app.js               # Express app setup
├── package.json         # Dependencies and scripts
└── README.md            # Project docs
```

## Quick start
These steps prioritize the essentials—clone, install, configure env, then run—so time‑to‑first‑request is minimal.  
Replace placeholders like <repo-url> and secrets before running in any environment.

- Clone and enter the project directory.  
  - git clone <repo-url> && cd subscription_tracker  
- Install dependencies.  
  - npm install  
- Create environment file (.env.development.local) and set required vars (see next section).  
- Start the dev server with hot reload.  
  - npm run dev

## Environment variables
Keep secrets out of source control and supply via environment files or platform settings.  
For Gmail senders, prefer OAuth2 or a Google App Password when 2‑Step Verification is enabled; never use a normal Gmail password.

Example .env.development.local:
```
PORT=5000
NODE_ENV=development
SERVER_URL=http://localhost:5000
DB_URI=mongodb://localhost:27017/subdub

JWT_SECRET=replace_me
JWT_EXPIRES_IN=7d

ARCJET_KEY=replace_me
ARCJET_ENV=development

QSTASH_TOKEN=replace_me
QSTASH_URL=http://127.0.0.1:8080

EMAIL_USER=example@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

Notes:
- Use a Gmail App Password (or OAuth2) when using Gmail SMTP; App Passwords require Google 2‑Step Verification.  
- Set short JWT expirations and plan for refresh logic to reduce risk from token theft.

## API endpoints
Endpoints are grouped by concern and return JSON; requests requiring auth expect a Bearer token.

- Auth  
  - POST /api/v1/auth/signup  
    - Body: {"name":"John Doe","email":"john@example.com","password":"123456"}  
  - POST /api/v1/auth/signin  
    - Body: {"email":"john@example.com","password":"123456"}  
- Users  
  - GET /api/v1/users  
  - GET /api/v1/users/:id  
- Subscriptions  
  - POST /api/v1/subscriptions  
    - Body: {"name":"Netflix","price":499,"currency":"INR","frequency":"monthly","renewalDate":"2025-09-15","paymentMethod":"Credit Card"}  
  - GET /api/v1/users/:id/subscriptions

## Email reminders
Templates insert user name, subscription, renewal date, price/plan, and payment method, then deliver via Nodemailer’s SMTP transport.  
Use environment configuration to swap sender, subject prefixes, or template variants without code changes.

Supported variants:
- reminder_7days — “Renews in 7 days”  
- reminder_5days — “Renews in 5 days”  
- reminder_2days — “Renews in 2 days”  
- reminder_1day — “Final reminder – tomorrow”

## Screenshot
<img width="575" height="764" alt="image" src="https://github.com/user-attachments/assets/90806319-e5e3-4279-9278-514612e44d5d" />


## Scheduling with Upstash
Workflows execute as durable, resumable steps with default retries; delays like context.sleep and sleepUntil enable precise scheduling.  
For local development, run the QStash dev server to obtain QSTASH_URL/QSTASH_TOKEN and forward requests to the workflow route in the Express app.

Typical flow:
- Install and configure @upstash/workflow in Express, exposing a POST handler for the workflow.  
- Use context.run for each step; failures retry automatically and state is persisted until completion.  
- Trigger via HTTP and monitor runs in the Upstash console (production requires a public URL).

## Security with Arcjet
Arcjet can enforce per‑route or global limits using characteristics such as IP, user ID, or API key header to avoid rate‑limiting all clients at once.  
Apply stricter limits to write routes and lighter/global limits via middleware to protect the entire surface while avoiding duplicate enforcement.

Recommended patterns:
- Identify by user ID or API key for authenticated routes to fairly apportion limits.  
- Use a global middleware limit for anonymous routes, then fine‑tune hot endpoints with route‑specific rules.  
- Verify limits in the Arcjet dashboard and iterate as traffic patterns evolve.

## Scripts
Expose standard scripts to align with reviewer expectations for local runs and CI.  
- npm run dev — start dev server with reload  
- npm start — start production server  
- npm test — reserved for unit/integration tests

## Roadmap
A staged plan helps reviewers see scope and future direction.  
- React frontend with responsive UI  
- Notifications: SMS/WhatsApp integration  
- Payment history and analytics  
- Admin dashboard and multi‑tenant roles

## Contributing
Contributions follow a short‑branch flow to stay approachable for new collaborators and recruiters evaluating process.  
Fork, branch, commit, push, and open a PR with a concise description and test notes.

Suggested flow:
- git checkout -b feature-xyz  
- git commit -m "feat: add xyz"  
- git push origin feature-xyz  
- Open a Pull Request with context and screenshots where helpful

## License
MIT License © 2025 Anubhav Verma; include the LICENSE file so redistribution terms render on the repository homepage automatically.

[1](https://docs.github.com/en/contributing/writing-for-github-docs/creating-screenshots)
[2](https://stackoverflow.com/questions/10189356/how-to-add-screenshot-to-readmes-in-github-repository)
[3](https://www.youtube.com/watch?v=NVibWKkon74)
[4](https://www.codecademy.com/learn/fscp-22-git-and-github-part-ii/modules/wdcp-22-best-practices-for-github-repositories/cheatsheet)
[5](https://news.ycombinator.com/item?id=30675357)
[6](https://www.geeksforgeeks.org/how-to-add-images-to-readmemd-on-github/)
[7](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview)
[8](https://www.reddit.com/r/github/comments/354yfb/is_including_screenshots_of_the_program_along/)
[9](https://www.reco.ai/hub/github-security-checklist)
[10](https://docs.github.com/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)
