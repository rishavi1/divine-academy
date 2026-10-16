DIVINE ACADEMY — SUBJECT-WISE VIDEO LEARNING WEBSITE

Included:
- Separate Mathematics, Science, and English pages
- Class 11 and Class 12 organization
- Teacher page to add YouTube links or direct MP4 URLs
- Lessons sorted by subject, class, chapter, and lesson number
- Previous/next lesson links
- Save for later, mark completed, and continue watching
- My Learning dashboard
- Responsive design

HOW TO USE
1. Open index.html or upload the folder to your static hosting provider.
2. Go to Add Lessons in the navigation.
3. Choose class and subject, enter chapter name, lesson number, title, YouTube URL, and description.
4. Students open Subjects, choose their subject, and select a lesson.
5. Saved lessons and completed progress are stored in that browser's localStorage.

IMPORTANT LIMITATION
This is a front-end starter version. The Add Lessons page stores lesson entries in the current browser only. If you add a lesson on your laptop, students visiting from their own phones will NOT automatically see it. Student progress is also local to each browser and is not synced between devices.

For a real public academy where teacher uploads appear for every student, you need a shared backend/database and teacher authentication (for example, Supabase or Firebase), or use a hosted LMS. Direct MP4 URLs must point to publicly accessible video hosting; do not rely on uploading large video files to GitHub Pages. YouTube links are the easiest way to start.

For YouTube, use the normal share link, such as https://www.youtube.com/watch?v=VIDEO_ID. The video must allow embedding.
