# Firebase Setup Guide for Mobile Sous Chef

This guide explains how to deploy the backend infrastructure for your app.

## 1. Prerequisites
- Create a Firebase Project at [console.firebase.google.com](https://console.firebase.google.com).
- Install Firebase Tools: `npm install -g firebase-tools`
- Login: `firebase login`

## 2. Configuration
1. Go to **Project Settings** in Firebase Console.
2. Scroll to "Your Apps" and create a **Web App** (for the JS SDK configuration).
3. Copy the configuration object (apiKey, authDomain, etc.).
4. Paste these values into `services/firebaseConfig.ts` in your project.

## 3. Deploying Cloud Functions
The backend code lives in the `firebase/functions` directory.

1. Navigate to the firebase folder:
   ```bash
   cd firebase
   ```

2. Set your Gemini API Key as a secret environment variable:
   ```bash
   firebase functions:config:set gemini.key="YOUR_GEMINI_API_KEY"
   ```
   *(Note: You might need to upgrade to the Blaze (Pay as you go) plan to use external APIs like Gemini, but the free tier is generous).*

3. Deploy the functions:
   ```bash
   firebase deploy --only functions
   ```

## 4. Switching to Cloud Service
Once deployed, you can switch your app to use `GeminiCloudService` instead of `GeminiService`.

1. Open `app/index.tsx` (or wherever you call the service).
2. Import `GeminiCloudService` from `../services/geminiCloudService`.
3. Replace `GeminiService.generateRecipesFromText` with `GeminiCloudService.generateRecipesFromText`.

## 5. iOS Release
Since you plan to release on iPhone:
1. Register an **iOS App** in Firebase Console using your Bundle ID: `com.nicholassampson.mobilesouschef`.
2. Download `GoogleService-Info.plist`.
3. Place it in the root of your project (or `app` folder).
4. Add it to your `app.json` config if using EAS Build (or rely on the JS SDK configuration which we set up, which works fine for Functions).
