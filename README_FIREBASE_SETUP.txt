DIVINE ACADEMY - DYNAMIC CLASSES, SUBJECTS & STUDENT ACCESS
==========================================================

This upgrade adds class/subject management, student ID/password accounts, access restriction, and no-reload lesson synchronization.

IMPORTANT SETUP
1. Upload all files in this folder to the SAME GitHub Pages repository/folder, including new files login.html, student-login.js, and student-access-guard.js.
2. In Firebase Console > Authentication > Sign-in method, enable Email/Password. Add rishavi1.github.io to Authorized domains.
3. In Firestore > Rules, publish the exact rules in firestore.rules. The teacher UID in the rules and firebase-admin.js is IKOFW1ZaP0erGRstYo6IMK8wNju2. Verify this is still your teacher account UID before publishing.
4. Sign in to admin.html with that teacher account. The first load creates default Class 11, Class 12, Mathematics, Science and English records if missing.
5. Add classes and subjects from the admin panel. Newly added options become available in the lesson form.
6. Create student IDs/passwords from the admin panel. Students log in at login.html. Restrict sets their profile inactive; Revoke access removes their profile and blocks access. Firebase Auth sign-in records are NOT deleted by the browser UI. True Auth-user deletion/disable requires a trusted server/Admin SDK process; never put a service-account key in website files.

SECURITY NOTES
- Student account IDs are converted to internal Firebase Auth email aliases; students use the ID, not the alias.
- Passwords are handled by Firebase Authentication, not stored in Firestore. Share generated passwords privately.
- Firestore rules only allow active students to read published lessons. Do not use public-write rules.
- All learning pages are gated by student-access-guard.js. If you want public preview pages, remove the guard only from those pages intentionally.
- Firebase web config is public by design; security comes from Auth and rules.
- GitHub Pages deploys code, not Firebase rules. Publish rules separately in Firebase Console.
