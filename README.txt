DIVINE ACADEMY - CLASS-WISE VIDEO LESSON WEBSITE

HOW STUDENTS USE IT
1. Open classes.html or class11.html / class12.html.
2. Choose Class 11 or Class 12.
3. Choose Mathematics, Science, or English.
4. Subject pages list video lessons with topic/chapter, title and description.

HOW TEACHER ADDS A LESSON
1. Open admin.html directly by typing its URL. It is not linked in the public website navigation.
2. Convenience password currently in admin.html is ChangeThis123! (change it in the source before use).
3. Select class and subject, add chapter/topic, lesson number, title, YouTube URL and description, then click Add lesson.

IMPORTANT LIMITATIONS
- This version uses browser localStorage. Lessons added on one browser/device will NOT automatically appear to students on their devices.
- The admin password is only a convenience lock. On GitHub Pages, the HTML/JavaScript is public and a client-side password is NOT secure. A person who knows the page/source can bypass it.
- For real private teacher login and lessons shared to every student, connect Firebase Authentication + Firestore (with proper security rules) or another server-side backend. Do not put confidential data in this static website.

DEPLOY
Upload all files from this folder to the GitHub Pages repository.


VIDEO PLAYBACK FIX (IMPORTANT)
- Do not double-click watch.html to play YouTube lessons. Opening from file:// causes YouTube player Error 153 in many browsers because there is no normal website referrer.
- Upload the website files to GitHub Pages and open the https:// website URL, or run a local server from this folder.
- On Windows, if Python is installed, open Command Prompt in this folder and run: py -m http.server 8000
- Then open http://localhost:8000 in your browser. Keep the Command Prompt window open while using the website.
- The player uses the privacy-enhanced youtube-nocookie embed and the website does not add a separate “streaming from YouTube” label. YouTube may still display its own player branding/controls; YouTube does not allow websites to guarantee that all branding is removed. Some videos may also block embedding.

FIREBASE VERSION
See README_FIREBASE_SETUP.txt for the required Firebase Authentication and Firestore setup.
Open admin.html directly on your hosted site to sign in and manage online lessons.
