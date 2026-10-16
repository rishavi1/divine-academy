DIVINE ACADEMY - DYNAMIC CLASSES, SUBJECTS & STUDENT ACCESS
==========================================================

This upgrade adds class/subject management, student ID/password accounts, access restriction, and no-reload lesson synchronization.

IMPORTANT SETUP
2. In Firebase Console > Authentication > Sign-in method, enable Email/Password. Add rishavi1.github.io to Authorized domains.
3. In Firestore > Rules, publish the exact rules in firestore.rules. The teacher UID in the rules and firebase-admin.js is IKOFW1ZaP0erGRstYo6IMK8wNju2. Verify this is still your teacher account UID before publishing.
4. Sign in to admin.html with that teacher account. The first load creates default Class 11, Class 12, Mathematics, Science and English records if missing.
5. Add classes and subjects from the admin panel. Newly added options become available in the lesson form.

SECURITY NOTES
- Student account IDs are converted to internal Firebase Auth email aliases; students use the ID, not the alias.
- Passwords are handled by Firebase Authentication, not stored in Firestore. Share generated passwords privately.
- Firestore rules only allow active students to read published lessons. Do not use public-write rules.
- Firebase web config is public by design; security comes from Auth and rules.
- GitHub Pages deploys code, not Firebase rules. Publish rules separately in Firebase Console.

Student login and student account management have been removed. Learning pages are public; keep teacher-only Firestore rules for admin operations.
