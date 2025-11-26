![Tests](https://github.com/ElliesWorld/SchoolSystem/actions/workflows/test.yml/badge.svg?branch=main)

**Frontend**: React (Vite), TypeScript

cd Frontend
npm install

Create Frontend/.env:
VITE_API_BASE_URL="http://localhost:4000"

# Firebase web config (from Firebase console)

VITE_FIREBASE_API_KEY="..."
VITE_FIREBASE_AUTH_DOMAIN="schoolsystem-eac50.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="schoolsystem-eac50"
VITE_FIREBASE_STORAGE_BUCKET="schoolsystem-eac50.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="..."

npm run dev

Authentication flow
User logs in with Firebase (email/password or Google).
Frontend calls getIdToken() and stores it as idToken in:
localStorage if “Remember me” is checked
sessionStorage otherwise
Frontend also stores userEmail for display.
For all protected API calls, frontend sends:
Authorization: Bearer <idToken>

Authorization: Bearer <idToken>
Backend
authMiddleware.ts:
requireAuth:
reads Authorization header
verifies the Firebase ID token (if Firebase env vars are set)
loads or creates a matching User in the DB
attaches it to req.user
if Firebase env is not configured, runs in a “demo mode” and sets a dummy user.
requireAdmin: ensures req.user.role === "ADMIN".
verifyToken.ts is a simple middleware for verifying Firebase tokens if needed.

Core API endpoints
Student endpoints
GET /api/me/grades
Auth: requireAuth
Query:
year?: 1 | 2 | 3 – used for “Year 1 / Year 2 / Year 3 / All”
subject?: subject name – used for “Subject” dropdown

Frontend pages (mapped to the assignment)
Login page (/loginpage)

Email / Password fields

Remember me checkbox

Login button (email/password)

Login with Google button

“Forgot password?” link

“Admin” option to switch to admin login view

Student “Grades” page (/grades)

Year filters: Year 1, Year 2, Year 3, All

Subject dropdown

Table: Year / Subject / Course / Grade / Date

Back arrow to go back to login

Top-right shows current user email + Logout

Admin page (/adminpage)
Back arrow to login
Shows current admin email + Logout
Year filters: All, Year 1, Year 2, Year 3
Student table: Full name / Email / Personal ID / Tel / Address
Hover behaviour: shows a “details” card with info + Edit / Delete buttons (UI only, wiring optional)
CSV import section with “Import CSV” button
Link/button to “Register Grades” page

Admin “Register Grades” page (/adminregistergrades)
Year filters
Subject dropdown for course selection
Table: Student name / Grade / Date
Editing grades in-place (depending on your implementation)
Button to go back to “Students” admin page
