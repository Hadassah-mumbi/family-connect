# Family Connect

Family Connect is a web app that helps families stay connected with older relatives through daily questions and shared responses. Family members can manage questions and members, while older users can answer questions using text or speech recognition.

## Features

### Family members

- Create an account or sign in.
- View the family dashboard and recent activity.
- Add, find, and manage family members.
- Create and manage questions in the question bank.
- Schedule questions and review submitted responses.
- Access profile and account settings.

### Older users

- Sign in using the older-user login screen.
- Answer the daily question by typing or using speech recognition when supported by the browser.
- Save a question to answer later, and browse saved questions and response history.
- Access user settings.

## Tech stack

- React and TypeScript, bootstrapped with Create React App
- React Router for client-side navigation
- Firebase Authentication, Cloud Firestore, and Cloud Storage
- Tailwind CSS

## Getting started

### Requirements

- Node.js and npm
- A Firebase project configured for this app

### Install and run

```sh
npm install
npm start
```

The development server runs at [http://localhost:3000](http://localhost:3000).

### Firebase configuration

The Firebase app is initialized in `src/firebase/config.ts`. Before connecting the app to your own Firebase project, update the `firebaseConfig` object in that file with your project's web app configuration. Enable the Firebase services the app uses (Authentication and Cloud Firestore; Cloud Storage is also initialized).

Do not commit private credentials or service-account keys. Firebase web configuration is intended for client apps, but access to your Firebase data must still be protected with appropriate Firebase Authentication and security rules.

## Available routes

| Route | Screen |
| --- | --- |
| `/` | Landing page |
| `/family/signup` | Family account registration |
| `/family/login` | Family sign in |
| `/family/dashboard` | Family dashboard |
| `/family/question-bank` | Question bank |
| `/family/schedule` | Schedule a question |
| `/family/responses` | View responses |
| `/family/members` | Manage family members |
| `/family/settings` | Family settings |
| `/elderly/login` | Older-user sign in |
| `/elderly/daily-question` | Daily question |
| `/elderly/saved` | Saved questions |
| `/elderly/history` | Response history |
| `/elderly/settings` | Older-user settings |

## Scripts

```sh
npm start    # Start the development server
npm test     # Run tests in watch mode
npm run build # Create an optimized production build in build/
```

## Project structure

```text
src/
  firebase/   Firebase initialization
  pages/
    family/   Family registration, dashboard, questions, members, and settings
    elderly/  Older-user login, daily question, saved questions, history, and settings
  App.tsx     Application routes
```
