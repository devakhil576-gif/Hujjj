# Alurev

Alurev is a mobile-first social media APK prototype for talent discovery.

It includes:

- Instagram-style social feed and profile grid
- TikTok-style reels stage
- Stories and lens-style camera effects simulation
- Swipe-to-collab discovery cards
- Nearby talent discovery focused on safe collaboration
- Groups, channels, and chats
- Certified mentor tips area
- Safety center with report, block, verification, and mentor-only advice rules

## Build APK

I uploaded the Android source and the APK build recipe.

The file `build-apk.yml` is currently at the repo root. To enable automatic GitHub APK building, move/copy it to:

`.github/workflows/build-apk.yml`

Then open the **Actions** tab, run **Build Alurev APK**, and download the artifact named **Alurev-debug-apk**.

Inside it you will find `app-debug.apk`.

## Project folders

- `android/` — Android WebView app source
- `android/app/src/main/assets/` — Alurev web app UI loaded inside the APK
- `build-apk.yml` — APK builder workflow content

## Safety note

This prototype uses swipe and nearby features for talent discovery, collaboration, and networking only.