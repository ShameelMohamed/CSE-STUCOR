# SARA CSE - STUCOR

The digital heart of the Computer Science & Engineering department at Saranathan College of Engineering. This portal connects students, alumni, and faculty to stay updated, showcase skills, and engage with the community.

## ✨ Features
- **Role-Based Access Control**: Secure login via Google OAuth, restricting access to authorized users (Students, Admins, HoD, Event Coordinators, etc.).
- **Alumni Network**: Interactive stack of alumni cards for reading insights and professional experiences.
- **Students Corner**: A place to showcase student achievements, projects, and research work.
- **Department Updates**: Direct updates from the Head of Department, trending news, and upcoming events.
- **Coding Resources**: HackerRank challenges, leaderboards, and curated AI tools.

## 🛠️ Tech Stack
- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom claymorphism UI components
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore & Google Auth)
- **PWA**: Fully functional Progressive Web App using `next-pwa`

## 🚀 Getting Started

First, install the dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔑 Environment Variables
Create a `.env.local` file in the root directory and add your Firebase configuration keys:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🌐 Deployment
This project is optimized for deployment on [Vercel](https://vercel.com/). Ensure all environment variables are added in your Vercel project settings before deploying.
