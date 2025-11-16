// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Match this email to your Firebase test user!
  const email = "anna@example.com";
  const firebaseUid = "demo-firebase-uid";

  const user = await prisma.user.upsert({
    where: { email },
    update: { firebaseUid },
    create: {
      email,
      firebaseUid,
      role: "STUDENT",
    },
  });

  const student = await prisma.student.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      year: 2,
      personNr: "20010101-1234",
      phoneNr: "0701234567",
      address: "Example Street 1",
    },
  });

  await prisma.course.createMany({
    data: [
      {
        id: "course-1",
        name: "Engelska 5",
        subject: "English",
        yearOffered: 1,
      },
      {
        id: "course-2",
        name: "Filosofi 1",
        subject: "Philosophy",
        yearOffered: 1,
      },
      {
        id: "course-3",
        name: "Engelska 6",
        subject: "English",
        yearOffered: 2,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.grade.createMany({
    data: [
      {
        studentId: student.id,
        courseId: "course-1",
        grade: "B",
        year: 1,
      },
      {
        studentId: student.id,
        courseId: "course-3",
        grade: "A",
        year: 2,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seeded test user, student, courses and grades");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
