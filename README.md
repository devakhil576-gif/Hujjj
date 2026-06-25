# Alurev

Alurev is now upgraded from a dummy screen prototype into a real local MVP APK.

## What works in this MVP

- Local signup and creator profile
- Editable profile
- Home talent feed
- Create posts
- Create reel-style posts
- Stories
- Likes
- Comments
- Follow creators
- Creator discovery and collab requests
- Groups and channel-style chats
- Lens selector interface
- Tip records
- Safety center
- Data saved on the device with localStorage

## Important limitation

This version works locally on one device. It is not a full online social network yet.

For real public users, the next backend upgrade needs Firebase or Supabase for login, database, media uploads, real chat, notifications, moderation, and cloud storage.

## Build APK

Open GitHub Actions and run the APK build workflow. Download the artifact named Alurev-debug-apk. Inside it you will find app-debug.apk.

## Main files

- android/app/src/main/assets/index.html
- android/app/src/main/assets/styles.css
- android/app/src/main/assets/mvp.css
- android/app/src/main/assets/app.js
- android/app/src/main/java/com/alurev/app/MainActivity.java
