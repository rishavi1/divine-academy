DIVINE ACADEMY + FIREBASE SETUP
================================

This version connects the existing Divine Academy lesson pages to Cloud Firestore.
Teacher login uses Firebase Authentication. Published lessons are shared online.

IMPORTANT: Finish the Firebase Console setup before uploading these files.

1) FIREBASE PROJECT
   Project ID: divine-academy-4ce02
   The provided firebase-config.js uses the configuration supplied by you.

2) ENABLE AUTHENTICATION
   Firebase Console > Build > Authentication > Get started > Sign-in method
   Enable Email/Password.
   Authentication > Users > Add user: create your teacher email/password.

3) CREATE FIRESTORE
   Firebase Console > Build > Firestore Database > Create database > Production mode.

4) GET YOUR TEACHER UID
   Authentication > Users > click your teacher account > copy User UID.
   The provided firestore.rules file already contains your teacher UID: IKOFW1ZaP0erGRstYo6IMK8wNju2
   Paste all rules into Firebase Console > Firestore Database > Rules and click Publish.
   If you later change teacher accounts, update the UID in the rules first.

5) AUTHORIZE YOUR WEBSITE DOMAIN
   Authentication > Settings > Authorized domains > Add domain if needed.
   For GitHub Pages, add the hostname only, e.g. rishavi1.github.io
   (do not include https:// or a path). Your exact domain may differ.

6) UPLOAD TO GITHUB PAGES
   Upload/replace the website files in the same GitHub Pages repository, keeping
   the folder structure. Do not upload just the HTML files; upload the .js files
   and firestore.rules/README too. Commit changes and wait for Pages deployment.

7) ADD LESSONS
   Open your deployed site and navigate directly to /admin.html.
   Sign in with the Firebase teacher email/password.
   Add class, subject, chapter, lesson number, title, YouTube URL, description.
   Published lessons will be saved in Firestore and loaded on student subject/watch
   pages across devices. The teacher page is not linked in public navigation.

NOTES
- The Firebase web config (including apiKey) is not a server secret. Security must
  come from Authentication and Firestore rules. Never publish service-account keys.
- Students can read only lessons where published == true. The teacher UID can manage
  lessons. The included code creates new lessons as published=true.
- If you already added lessons in the old local-only version, those lessons do NOT
  automatically migrate. Re-add them from the new admin page, or ask to prepare a
  migration process.
- If the page shows permission-denied, verify the teacher UID in Firestore Rules and
  click Publish. If sign-in says unauthorized domain, add your website hostname in
  Authentication > Settings > Authorized domains.
- Test on a hosted HTTPS website. Opening HTML directly as file:// is not supported.
- Video embeds still follow YouTube's embed permissions and availability.
