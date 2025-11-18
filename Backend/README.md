# SchoolSystem

- Students log in and see their grades by year and subject.
- Admins can view all students, import them from CSV, and register grades.

cd Backend
npm install

Create Backend/.env:

# PostgreSQL connection string

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/schoolsystem?schema=public"

# Backend port

PORT=4000

# Firebase admin (real auth mode). If you don't set these,

# backend falls back to a demo mode for development.

FIREBASE_PROJECT_ID=schoolsystem-eac50
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@schoolsystem-eac50.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n....\n-----END PRIVATE KEY-----\n"

Prisma: generate client & migrate
cd Backend
npx prisma generate
npx prisma migrate dev --name initial_db_setup
npm run seed

You can inspect the DB with Prisma Studio:
npx prisma studio

npm run dev

Testing
npm test

Linting & formatting
npm run lint
npm run format
