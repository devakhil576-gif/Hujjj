# HealthBot

HealthBot is an Android AI health-information chat app based on the supplied HealthBot workflow specification.

## Included

- Clinical-modern mobile UI using the supplied teal/blue palette direction
- Multi-turn health conversation
- Gemini API integration
- Google Search grounding for current information
- Local API-key storage in Android app preferences
- Safety-focused medical system instructions
- Conversation summary export as a text file
- GitHub Actions debug APK build

## Important

HealthBot provides educational health information. It is not a diagnostic service or a replacement for a licensed clinician. For severe or emergency symptoms, seek immediate medical care.

The app does not ship with an API key. Open the Settings button in the app and enter a Gemini API key on the device. API usage is subject to the account's applicable limits and charges.

## Build

1. Open the repository's **Actions** tab.
2. Select **Build HealthBot APK**.
3. Choose **Run workflow**.
4. Download the artifact named **HealthBot-debug-apk**.
5. The artifact contains `app-debug.apk`.

## Architecture

The Android shell uses a WebView for the mobile interface. Java exposes a small native bridge that stores the API key locally and sends conversation history to the Gemini `generateContent` endpoint with Google Search grounding enabled. The browser layer never contains a hard-coded API key.
