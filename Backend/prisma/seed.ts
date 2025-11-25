// prisma/seed.ts - UPDATED WITH UUIDS
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

  // ✅ Create courses WITHOUT specifying IDs (let Prisma generate UUIDs)
  const course1 = await prisma.course.upsert({
    where: { id: "550e8400-e29b-41d4-a716-446655440001" }, // Hardcoded UUID for consistency
    update: {},
    create: {
      id: "550e8400-e29b-41d4-a716-446655440001",
      name: "Engelska 5",
      subject: "English",
      yearOffered: 1,
    },
  });

  const course2 = await prisma.course.upsert({
    where: { id: "550e8400-e29b-41d4-a716-446655440002" },
    update: {},
    create: {
      id: "550e8400-e29b-41d4-a716-446655440002",
      name: "Filosofi 1",
      subject: "Philosophy",
      yearOffered: 1,
    },
  });

  const course3 = await prisma.course.upsert({
    where: { id: "550e8400-e29b-41d4-a716-446655440003" },
    update: {},
    create: {
      id: "550e8400-e29b-41d4-a716-446655440003",
      name: "Engelska 6",
      subject: "English",
      yearOffered: 2,
    },
  });

  // ✅ Use the actual course IDs for grades
  await prisma.grade.upsert({
    where: {
      studentId_courseId: {
        studentId: student.id,
        courseId: course1.id,
      },
    },
    update: {},
    create: {
      studentId: student.id,
      courseId: course1.id,
      grade: "B",
      year: 1,
    },
  });

  await prisma.grade.upsert({
    where: {
      studentId_courseId: {
        studentId: student.id,
        courseId: course3.id,
      },
    },
    update: {},
    create: {
      studentId: student.id,
      courseId: course3.id,
      grade: "A",
      year: 2,
    },
  });

  console.log("Seeded test user, student, courses and grades");
  console.log("Course IDs:");
  console.log("  English 5:", course1.id);
  console.log("  Philosophy 1:", course2.id);
  console.log("  English 6:", course3.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
