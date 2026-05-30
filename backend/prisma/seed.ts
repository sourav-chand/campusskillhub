import { PrismaClient, UserRole, CollegeStatus, CourseCategory, AssessmentType, SubmissionStatus, AttendanceStatus, ProjectType, ProjectStatus, CertificateStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateVerificationId(): string {
  return 'CSH-' + uuidv4().split('-')[0].toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
}

async function main() {
  console.log('🌱 Starting seed...\n');

  // Clean database in correct order for foreign keys
  console.log('🧹 Cleaning database...');
  await prisma.mCQAnswer.deleteMany();
  await prisma.mCQAttempt.deleteMany();
  await prisma.mCQOption.deleteMany();
  await prisma.mCQQuestion.deleteMany();
  await prisma.mCQTest.deleteMany();
  await prisma.codingSubmission.deleteMany();
  await prisma.codingAssessment.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.mentorFeedback.deleteMany();
  await prisma.projectMilestone.deleteMany();
  await prisma.project.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.liveClass.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.studyMaterial.deleteMany();
  await prisma.recordedVideo.deleteMany();
  await prisma.module.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.course.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.student.deleteMany();
  await prisma.trainer.deleteMany();
  await prisma.collegeAdmin.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Database cleaned\n');

  const hashedPassword = (password: string) => bcrypt.hashSync(password, 10);

  // 1. Super Admin
  console.log('👤 Creating Super Admin...');
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@campusskillhub.com',
      password: hashedPassword('Admin@123'),
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      isVerified: true,
      isActive: true,
    },
  });
  console.log(`   ✅ Super Admin: ${superAdmin.email}\n`);

  // 2. Colleges
  console.log('🏛️ Creating Colleges...');
  const collegeMIT = await prisma.college.create({
    data: {
      name: 'MIT College of Engineering',
      code: 'MITCE',
      address: '77 Massachusetts Avenue',
      city: 'Cambridge',
      state: 'Massachusetts',
      pincode: '02139',
      phone: '+1-617-253-1000',
      email: 'info@mitce.edu',
      website: 'https://mitce.edu',
      status: CollegeStatus.APPROVED,
      maxStudents: 500,
    },
  });

  const collegeStanford = await prisma.college.create({
    data: {
      name: 'Stanford Institute of Technology',
      code: 'SITECH',
      address: '450 Serra Mall',
      city: 'Stanford',
      state: 'California',
      pincode: '94305',
      phone: '+1-650-723-2300',
      email: 'info@sitech.edu',
      website: 'https://sitech.edu',
      status: CollegeStatus.APPROVED,
      maxStudents: 500,
    },
  });

  const collegeNCC = await prisma.college.create({
    data: {
      name: 'New Cambridge College',
      code: 'NCC',
      address: '123 Cambridge Road',
      city: 'Cambridge',
      state: 'United Kingdom',
      pincode: 'CB2 1TN',
      phone: '+44-1223-765400',
      email: 'info@ncc.ac.uk',
      website: 'https://ncc.ac.uk',
      status: CollegeStatus.PENDING,
      maxStudents: 300,
    },
  });
  console.log(`   ✅ Created ${3} colleges\n`);

  // 3. College Admins
  console.log('👨‍💼 Creating College Admins...');
  const mitAdminUser = await prisma.user.create({
    data: {
      email: 'college.mit@campusskillhub.com',
      password: hashedPassword('College@123'),
      firstName: 'Michael',
      lastName: 'Chen',
      role: UserRole.COLLEGE_ADMIN,
      phone: '+1-617-555-0101',
      isVerified: true,
      isActive: true,
    },
  });

  await prisma.collegeAdmin.create({
    data: {
      userId: mitAdminUser.id,
      collegeId: collegeMIT.id,
      department: 'Administration',
      designation: 'College Administrator',
    },
  });

  const stanfordAdminUser = await prisma.user.create({
    data: {
      email: 'college.stanford@campusskillhub.com',
      password: hashedPassword('College@123'),
      firstName: 'Jennifer',
      lastName: 'Martinez',
      role: UserRole.COLLEGE_ADMIN,
      phone: '+1-650-555-0202',
      isVerified: true,
      isActive: true,
    },
  });

  await prisma.collegeAdmin.create({
    data: {
      userId: stanfordAdminUser.id,
      collegeId: collegeStanford.id,
      department: 'Administration',
      designation: 'College Administrator',
    },
  });

  console.log(`   ✅ College Admins created\n`);

  // 4. Trainers
  console.log('👨‍🏫 Creating Trainers...');
  const trainerPass = hashedPassword('Trainer@123');

  const mitTrainersData = [
    { firstName: 'John', lastName: 'Smith', email: 'john.smith@campusskillhub.com', specialization: 'Full Stack Development', bio: 'Senior full stack developer with 10+ years of experience', expertise: ['JavaScript', 'React', 'Node.js', 'TypeScript'] },
    { firstName: 'Sarah', lastName: 'Wilson', email: 'sarah.wilson@campusskillhub.com', specialization: 'DevOps & Cloud', bio: 'DevOps engineer specialized in AWS and CI/CD pipelines', expertise: ['Docker', 'Kubernetes', 'AWS', 'Jenkins'] },
  ];

  const stanfordTrainersData = [
    { firstName: 'Mike', lastName: 'Johnson', email: 'mike.johnson@campusskillhub.com', specialization: 'Python & Data Science', bio: 'Data scientist with expertise in Python and ML', expertise: ['Python', 'Machine Learning', 'Data Analysis', 'NumPy'] },
    { firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@campusskillhub.com', specialization: '.NET Development', bio: 'Full stack .NET developer with Azure experience', expertise: ['C#', '.NET Core', 'Azure', 'SQL Server'] },
  ];

  const mitTrainers = [];
  for (const t of mitTrainersData) {
    const user = await prisma.user.create({
      data: {
        email: t.email,
        password: trainerPass,
        firstName: t.firstName,
        lastName: t.lastName,
        role: UserRole.TRAINER,
        isVerified: true,
        isActive: true,
      },
    });
    const trainer = await prisma.trainer.create({
      data: {
        userId: user.id,
        collegeId: collegeMIT.id,
        specialization: t.specialization,
        bio: t.bio,
        expertise: t.expertise,
        rating: parseFloat((4 + Math.random()).toFixed(1)),
      },
    });
    mitTrainers.push(trainer);
    console.log(`   ✅ Trainer: ${user.email}`);
  }

  const stanfordTrainers = [];
  for (const t of stanfordTrainersData) {
    const user = await prisma.user.create({
      data: {
        email: t.email,
        password: trainerPass,
        firstName: t.firstName,
        lastName: t.lastName,
        role: UserRole.TRAINER,
        isVerified: true,
        isActive: true,
      },
    });
    const trainer = await prisma.trainer.create({
      data: {
        userId: user.id,
        collegeId: collegeStanford.id,
        specialization: t.specialization,
        bio: t.bio,
        expertise: t.expertise,
        rating: parseFloat((4 + Math.random()).toFixed(1)),
      },
    });
    stanfordTrainers.push(trainer);
    console.log(`   ✅ Trainer: ${user.email}`);
  }
  console.log();

  // 5. Students
  console.log('👨‍🎓 Creating Students...');
  const studentPass = hashedPassword('Student@123');

  const mitStudentNames = [
    ['Alex', 'Johnson'], ['Emma', 'Williams'], ['James', 'Brown'], ['Sophia', 'Garcia'], ['Daniel', 'Miller'],
  ];
  const stanfordStudentNames = [
    ['Olivia', 'Davis'], ['Ethan', 'Rodriguez'], ['Ava', 'Martinez'], ['Liam', 'Hernandez'], ['Isabella', 'Lopez'],
  ];

  const mitStudents = [];
  for (let i = 0; i < 5; i++) {
    const [fn, ln] = mitStudentNames[i];
    const user = await prisma.user.create({
      data: {
        email: `student.mit${i + 1}@campusskillhub.com`,
        password: studentPass,
        firstName: fn,
        lastName: ln,
        role: UserRole.STUDENT,
        isVerified: true,
        isActive: true,
      },
    });
    const student = await prisma.student.create({
      data: {
        userId: user.id,
        collegeId: collegeMIT.id,
        rollNumber: `MIT202400${i + 1}`,
        batch: '2024-2025',
        semester: 3,
        enrollmentYear: 2024,
      },
    });
    mitStudents.push(student);
    console.log(`   ✅ Student: ${user.email} (${student.rollNumber})`);
  }

  const stanfordStudents = [];
  for (let i = 0; i < 5; i++) {
    const [fn, ln] = stanfordStudentNames[i];
    const user = await prisma.user.create({
      data: {
        email: `student.stanford${i + 1}@campusskillhub.com`,
        password: studentPass,
        firstName: fn,
        lastName: ln,
        role: UserRole.STUDENT,
        isVerified: true,
        isActive: true,
      },
    });
    const student = await prisma.student.create({
      data: {
        userId: user.id,
        collegeId: collegeStanford.id,
        rollNumber: `STN202400${i + 1}`,
        batch: '2024-2025',
        semester: 3,
        enrollmentYear: 2024,
      },
    });
    stanfordStudents.push(student);
    console.log(`   ✅ Student: ${user.email} (${student.rollNumber})`);
  }
  console.log();

  // 6. Courses
  console.log('📚 Creating Courses...');
  const mitCoursesData = [
    { title: 'Full Stack Web Development', category: CourseCategory.FULL_STACK_DEVELOPMENT, description: 'Comprehensive course covering frontend and backend web development using modern frameworks and tools.', duration: 120, price: 499.99, trainer: mitTrainers[0] },
    { title: 'DevOps Engineering', category: CourseCategory.DEVOPS, description: 'Learn CI/CD, containerization, orchestration, and infrastructure as code.', duration: 80, price: 399.99, trainer: mitTrainers[1] },
    { title: 'Cloud Architecture', category: CourseCategory.CLOUD_COMPUTING, description: 'Design and implement scalable cloud solutions on AWS, Azure, and GCP.', duration: 90, price: 449.99, trainer: mitTrainers[1] },
    { title: 'Advanced Java Programming', category: CourseCategory.JAVA, description: 'Advanced Java concepts including Spring Boot, Microservices, and JPA.', duration: 100, price: 349.99, trainer: mitTrainers[0] },
  ];

  const stanfordCoursesData = [
    { title: '.NET Core Development', category: CourseCategory.DOTNET, description: 'Build enterprise-grade applications using .NET Core and modern C#.', duration: 90, price: 399.99, trainer: stanfordTrainers[1] },
    { title: 'Python for Data Science', category: CourseCategory.PYTHON, description: 'Learn Python programming for data analysis, visualization, and machine learning.', duration: 75, price: 349.99, trainer: stanfordTrainers[0] },
    { title: 'Data Science & Analytics', category: CourseCategory.DATA_SCIENCE, description: 'Master data science concepts including statistics, ML algorithms, and big data tools.', duration: 110, price: 499.99, trainer: stanfordTrainers[0] },
  ];

  const mitCourses = [];
  for (const c of mitCoursesData) {
    const course = await prisma.course.create({
      data: {
        title: c.title,
        description: c.description,
        category: c.category,
        duration: c.duration,
        price: c.price,
        isPublished: true,
        collegeId: collegeMIT.id,
        trainerId: c.trainer.id,
      },
    });
    mitCourses.push(course);
    console.log(`   ✅ MIT Course: ${course.title}`);
  }

  const stanfordCourses = [];
  for (const c of stanfordCoursesData) {
    const course = await prisma.course.create({
      data: {
        title: c.title,
        description: c.description,
        category: c.category,
        duration: c.duration,
        price: c.price,
        isPublished: true,
        collegeId: collegeStanford.id,
        trainerId: c.trainer.id,
      },
    });
    stanfordCourses.push(course);
    console.log(`   ✅ Stanford Course: ${course.title}`);
  }
  console.log();

  // 7. Modules and Lessons
  console.log('📖 Creating Modules and Lessons...');
  const allCourses = [...mitCourses, ...stanfordCourses];

  for (const course of allCourses) {
    const moduleCount = randomInt(2, 3);
    for (let m = 1; m <= moduleCount; m++) {
      const moduleData = await prisma.module.create({
        data: {
          title: `Module ${m}: Core Concepts`,
          description: `Module ${m} covers foundational and advanced topics in ${course.title}.`,
          order: m,
          courseId: course.id,
        },
      });

      const lessonCount = randomInt(3, 4);
      for (let l = 1; l <= lessonCount; l++) {
        await prisma.lesson.create({
          data: {
            title: `Lesson ${l}: Topic ${l}`,
            content: `This is the detailed content for lesson ${l} of module ${m} in ${course.title}. It covers important learning objectives, examples, and practical exercises.`,
            videoUrl: `https://videos.campusskillhub.com/${course.id}/${moduleData.id}/lesson-${l}.mp4`,
            duration: randomInt(15, 60),
            order: l,
            isFree: l === 1,
            moduleId: moduleData.id,
          },
        });
      }
    }
    console.log(`   ✅ ${course.title}: ${moduleCount} modules with lessons`);
  }
  console.log();

  // 8. Enrollments
  console.log('📝 Creating Enrollments...');
  const enrollments = [];

  for (const student of mitStudents) {
    const shuffled = [...mitCourses].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, randomInt(2, 3));
    for (const course of selected) {
      const isCompleted = Math.random() > 0.7;
      const enrollment = await prisma.enrollment.create({
        data: {
          studentId: student.id,
          courseId: course.id,
          progress: isCompleted ? 100 : parseFloat((Math.random() * 80 + 10).toFixed(1)),
          completedModules: isCompleted ? 3 : randomInt(0, 2),
          completedLessons: isCompleted ? 12 : randomInt(1, 8),
          startedAt: randomDate(new Date('2025-01-01'), new Date()),
          completedAt: isCompleted ? randomDate(new Date('2025-03-01'), new Date()) : null,
          isCompleted,
        },
      });
      enrollments.push(enrollment);
    }
  }

  for (const student of stanfordStudents) {
    const shuffled = [...stanfordCourses].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, randomInt(2, 3));
    for (const course of selected) {
      const isCompleted = Math.random() > 0.7;
      const enrollment = await prisma.enrollment.create({
        data: {
          studentId: student.id,
          courseId: course.id,
          progress: isCompleted ? 100 : parseFloat((Math.random() * 80 + 10).toFixed(1)),
          completedModules: isCompleted ? 3 : randomInt(0, 2),
          completedLessons: isCompleted ? 12 : randomInt(1, 8),
          startedAt: randomDate(new Date('2025-01-01'), new Date()),
          completedAt: isCompleted ? randomDate(new Date('2025-03-01'), new Date()) : null,
          isCompleted,
        },
      });
      enrollments.push(enrollment);
    }
  }
  console.log(`   ✅ Created ${enrollments.length} enrollments\n`);

  // 9. Attendance Records
  console.log('📅 Creating Attendance Records...');
  const allStudents = [...mitStudents, ...stanfordStudents];
  const now = new Date();
  let attendanceCount = 0;

  for (const student of allStudents) {
    for (let d = 30; d >= 1; d--) {
      const date = new Date(now);
      date.setDate(date.getDate() - d);
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      await prisma.attendance.create({
        data: {
          studentId: student.id,
          date,
          status: randomElement([AttendanceStatus.PRESENT, AttendanceStatus.PRESENT, AttendanceStatus.PRESENT, AttendanceStatus.ABSENT, AttendanceStatus.LATE, AttendanceStatus.EXCUSED]),
          markedBy: mitAdminUser.id,
        },
      });
      attendanceCount++;
    }
  }
  console.log(`   ✅ Created ${attendanceCount} attendance records\n`);

  // 10. MCQ Tests with Questions and Options
  console.log('📝 Creating MCQ Tests...');
  const mcqTests = [];

  const questionTemplates = [
    { text: 'What is the primary purpose of {topic}?', options: ['To manage resources', 'To process data', 'To build applications', 'All of the above'], correct: 3 },
    { text: 'Which of the following is NOT a feature of {topic}?', options: ['Scalability', 'Portability', 'Manual Processing', 'Automation'], correct: 2 },
    { text: 'In {topic}, what is the standard approach for {task}?', options: ['Agile methodology', 'Waterfall model', 'Iterative design', 'Spiral model'], correct: 0 },
    { text: 'Which tool is commonly used for {topic}?', options: ['Docker', 'Jenkins', 'Kubernetes', 'All of the above'], correct: 3 },
    { text: 'What protocol is used in {topic} communication?', options: ['HTTP/HTTPS', 'FTP', 'SMTP', 'TCP/IP'], correct: 0 },
    { text: 'How does {topic} improve efficiency?', options: ['By automating tasks', 'By manual intervention', 'By reducing costs', 'By increasing complexity'], correct: 0 },
    { text: 'What is the best practice for {topic} security?', options: ['Regular updates', 'No password', 'Open access', 'Default config'], correct: 0 },
    { text: 'Which database is commonly used with {topic}?', options: ['PostgreSQL', 'MongoDB', 'MySQL', 'All of the above'], correct: 1 },
    { text: 'What is the key benefit of using {topic}?', options: ['Speed', 'Reliability', 'Flexibility', 'All of the above'], correct: 3 },
    { text: 'How do you debug issues in {topic}?', options: ['Logs', 'Breakpoints', 'Monitoring', 'All of the above'], correct: 3 },
  ];

  for (const course of allCourses) {
    const testCount = randomInt(1, 2);
    for (let t = 1; t <= testCount; t++) {
      const questionCount = randomInt(5, 10);
      const test = await prisma.mCQTest.create({
        data: {
          title: `${course.title} - Test ${t}`,
          description: `Assessment test for ${course.title} covering key concepts.`,
          duration: randomInt(15, 60),
          passingScore: 40,
          totalQuestions: questionCount,
          courseId: course.id,
          scheduledAt: randomDate(new Date('2025-02-01'), new Date()),
        },
      });

      for (let q = 1; q <= questionCount; q++) {
        const template = questionTemplates[q % questionTemplates.length];
        const question = await prisma.mCQQuestion.create({
          data: {
            text: template.text.replace('{topic}', course.title.split(' ')[0]).replace('{task}', 'implementation'),
            marks: 1,
            order: q,
            testId: test.id,
          },
        });

        for (let o = 0; o < template.options.length; o++) {
          await prisma.mCQOption.create({
            data: {
              text: template.options[o],
              isCorrect: o === template.correct,
              questionId: question.id,
            },
          });
        }
      }
      mcqTests.push(test);
    }
    console.log(`   ✅ MCQ tests for ${course.title}`);
  }
  console.log();

  // 11. MCQ Attempts
  console.log('📊 Creating MCQ Attempts...');
  let attemptCount = 0;
  for (const test of mcqTests) {
    const enrolledStudents = [...mitStudents, ...stanfordStudents].filter(() => Math.random() > 0.5);
    const questions = await prisma.mCQQuestion.findMany({ where: { testId: test.id }, include: { options: true } });

    for (const student of enrolledStudents.slice(0, 3)) {
      let correctCount = 0;
      const answers = [];

      for (const question of questions) {
        const chosenOption = question.options[randomInt(0, question.options.length - 1)];
        const isCorrect = chosenOption.isCorrect;
        if (isCorrect) correctCount++;
        answers.push({ questionId: question.id, optionId: chosenOption.id, isCorrect });
      }

      const totalMarks = questions.length;
      const score = correctCount;
      const passed = score / totalMarks >= 0.4;

      const attempt = await prisma.mCQAttempt.create({
        data: {
          score,
          totalMarks,
          passed,
          startedAt: randomDate(new Date('2025-02-15'), new Date()),
          completedAt: new Date(),
          studentId: student.id,
          testId: test.id,
        },
      });

      for (const answer of answers) {
        await prisma.mCQAnswer.create({
          data: {
            attemptId: attempt.id,
            questionId: answer.questionId,
            optionId: answer.optionId,
            isCorrect: answer.isCorrect,
          },
        });
      }
      attemptCount++;
    }
  }
  console.log(`   ✅ Created ${attemptCount} MCQ attempts\n`);

  // 12. Coding Assessments
  console.log('💻 Creating Coding Assessments...');
  const codingProblems = [
    { title: 'Two Sum Problem', desc: 'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.', lang: 'javascript', problem: 'Write a function twoSum(nums, target) that returns the indices of the two numbers that add up to the target. Assume exactly one solution exists.', testCases: JSON.stringify([{ input: 'twoSum([2,7,11,15], 9)', expected: '[0,1]' }, { input: 'twoSum([3,2,4], 6)', expected: '[1,2]' }, { input: 'twoSum([3,3], 6)', expected: '[0,1]' }]) },
    { title: 'Reverse a String', desc: 'Write a function to reverse a string in-place.', lang: 'javascript', problem: 'Write a function reverseString(s) that reverses a string. Do not allocate extra space for another array.', testCases: JSON.stringify([{ input: 'reverseString(["h","e","l","l","o"])', expected: '["o","l","l","e","h"]' }, { input: 'reverseString(["H","a","n","n","a","h"])', expected: '["h","a","n","n","a","H"]' }]) },
    { title: 'Palindrome Check', desc: 'Check if a string is a palindrome.', lang: 'javascript', problem: 'Write a function isPalindrome(s) that returns true if the string is a palindrome (considering only alphanumeric characters and ignoring case).', testCases: JSON.stringify([{ input: 'isPalindrome("A man, a plan, a canal: Panama")', expected: 'true' }, { input: 'isPalindrome("race a car")', expected: 'false' }]) },
    { title: 'FizzBuzz', desc: 'Classic FizzBuzz implementation.', lang: 'javascript', problem: 'Write a function fizzBuzz(n) that returns a string array where for multiples of 3 output "Fizz", for 5 output "Buzz", for both output "FizzBuzz", otherwise the number as string.', testCases: JSON.stringify([{ input: 'fizzBuzz(15)', expected: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' }]) },
    { title: 'Valid Parentheses', desc: 'Check if parentheses string is valid.', lang: 'javascript', problem: 'Write a function isValid(s) that determines if the input string containing "()", "{}", "[]" is valid - brackets must close correctly and be properly nested.', testCases: JSON.stringify([{ input: 'isValid("()")', expected: 'true' }, { input: 'isValid("()[]{}")', expected: 'true' }, { input: 'isValid("(]")', expected: 'false' }]) },
    { title: 'Binary Search', desc: 'Implement binary search on sorted array.', lang: 'python', problem: 'Write a function binarySearch(arr, target) that returns the index of target in sorted array arr using binary search, or -1 if not found.', testCases: JSON.stringify([{ input: 'binarySearch([-1,0,3,5,9,12], 9)', expected: '4' }, { input: 'binarySearch([-1,0,3,5,9,12], 2)', expected: '-1' }]) },
    { title: 'Merge Sorted Arrays', desc: 'Merge two sorted arrays into one.', lang: 'python', problem: 'Write a function merge(nums1, m, nums2, n) that merges two sorted arrays into the first array in-place.', testCases: JSON.stringify([{ input: 'merge([1,2,3,0,0,0], 3, [2,5,6], 3)', expected: '[1,2,2,3,5,6]' }]) },
  ];

  for (const course of allCourses) {
    const problem = codingProblems[allCourses.indexOf(course) % codingProblems.length];
    await prisma.codingAssessment.create({
      data: {
        title: problem.title,
        description: problem.desc,
        duration: randomInt(30, 90),
        language: problem.lang,
        problemStatement: problem.problem,
        testCases: problem.testCases,
        passingScore: 50,
        courseId: course.id,
      },
    });
    console.log(`   ✅ Coding assessment for ${course.title}: ${problem.title}`);
  }
  console.log();

  // 13. Assignments
  console.log('📄 Creating Assignments...');
  const assignmentTemplates = [
    { title: 'Research Paper', desc: 'Write a comprehensive research paper on recent advancements in {topic}. Include references and case studies.' },
    { title: 'Practical Implementation', desc: 'Implement a working prototype of {topic}. Submit code repository with documentation and test cases.' },
    { title: 'Case Study Analysis', desc: 'Analyze a real-world case study related to {topic}. Submit a detailed report with findings and recommendations.' },
  ];

  const allTrainers = [...mitTrainers, ...stanfordTrainers];
  for (const course of allCourses) {
    const assignCount = randomInt(1, 2);
    const courseTrainer = allTrainers.find(t => t.id === course.trainerId);
    for (let a = 1; a <= assignCount; a++) {
      const template = assignmentTemplates[(allCourses.indexOf(course) + a) % assignmentTemplates.length];
      await prisma.assignment.create({
        data: {
          title: `${template.title} - ${course.title}`,
          description: template.desc.replace('{topic}', course.title),
          dueDate: randomDate(new Date('2025-03-01'), new Date('2026-06-30')),
          maxScore: 100,
          passingScore: 40,
          courseId: course.id,
          trainerId: courseTrainer!.id,
        },
      });
    }
    console.log(`   ✅ Assignments for ${course.title}`);
  }
  console.log();

  // 14. Assignment Submissions
  console.log('📋 Creating Assignment Submissions...');
  const assignments = await prisma.assignment.findMany();
  let submissionCount = 0;

  for (const assignment of assignments) {
    const enrolledStudents = [...mitStudents, ...stanfordStudents].filter(() => Math.random() > 0.4);
    for (const student of enrolledStudents.slice(0, 3)) {
      const score = randomInt(30, 100);
      await prisma.assignmentSubmission.create({
        data: {
          studentId: student.id,
          assignmentId: assignment.id,
          content: `This is the submission for ${assignment.title} by student ${student.id}. The work covers all required topics and includes detailed analysis.`,
          fileUrl: `https://files.campusskillhub.com/submissions/${assignment.id}/${student.id}.pdf`,
          score,
          feedback: score >= 40 ? 'Good work! Well-structured and comprehensive submission.' : 'Needs improvement. Please review the feedback and resubmit.',
          status: SubmissionStatus.GRADED,
          submittedAt: randomDate(new Date('2025-03-01'), new Date()),
          gradedAt: new Date(),
        },
      });
      submissionCount++;
    }
  }
  console.log(`   ✅ Created ${submissionCount} assignment submissions\n`);

  // 15. Projects
  console.log('🛠️ Creating Projects...');
  const projectTemplates = [
    { type: ProjectType.MINOR, status: ProjectStatus.IN_PROGRESS, title: 'E-commerce API', desc: 'Build a RESTful API for an e-commerce platform with authentication, product management, and order processing.' },
    { type: ProjectType.MAJOR, status: ProjectStatus.IN_PROGRESS, title: 'Learning Management System', desc: 'Full-stack LMS platform with user roles, course management, and progress tracking.' },
    { type: ProjectType.MINOR, status: ProjectStatus.COMPLETED, title: 'Weather Dashboard', desc: 'Real-time weather dashboard using third-party API integration and data visualization.' },
    { type: ProjectType.MAJOR, status: ProjectStatus.NOT_STARTED, title: 'AI Chat Application', desc: 'Real-time chat application with AI-powered responses and natural language processing.' },
    { type: ProjectType.MINOR, status: ProjectStatus.COMPLETED, title: 'Portfolio Builder', desc: 'Dynamic portfolio website builder with customizable templates and deployment automation.' },
    { type: ProjectType.MAJOR, status: ProjectStatus.ON_HOLD, title: 'Blockchain Voting System', desc: 'Decentralized voting system using blockchain technology with smart contracts.' },
  ];

  const projects = [];
  for (let i = 0; i < 6; i++) {
    const student = allStudents[i % allStudents.length];
    const template = projectTemplates[i];
    const project = await prisma.project.create({
      data: {
        title: template.title,
        description: template.desc,
        type: template.type,
        status: template.status,
        progress: template.status === ProjectStatus.COMPLETED ? 100 : template.status === ProjectStatus.IN_PROGRESS ? parseFloat((Math.random() * 60 + 20).toFixed(1)) : 0,
        startDate: randomDate(new Date('2025-01-01'), new Date()),
        endDate: template.status === ProjectStatus.COMPLETED ? randomDate(new Date('2025-03-01'), new Date()) : null,
        githubUrl: `https://github.com/campusskill-hub/${template.title.toLowerCase().replace(/\s+/g, '-')}`,
        demoUrl: template.status === ProjectStatus.COMPLETED ? `https://${template.title.toLowerCase().replace(/\s+/g, '-')}.campusskillhub.com` : null,
        studentId: student.id,
        courseId: mitCourses[i % mitCourses.length]?.id,
      },
    });
    projects.push(project);
    console.log(`   ✅ Project: ${project.title}`);
  }
  console.log();

  // 16. Project Milestones
  console.log('🎯 Creating Project Milestones...');
  for (const project of projects) {
    const milestoneCount = project.type === ProjectType.MAJOR ? randomInt(4, 6) : randomInt(2, 3);
    for (let m = 1; m <= milestoneCount; m++) {
      const isCompleted = project.status === ProjectStatus.COMPLETED || (project.status === ProjectStatus.IN_PROGRESS && m <= milestoneCount / 2);
      await prisma.projectMilestone.create({
        data: {
          title: `Milestone ${m}: Phase ${m}`,
          description: `Complete phase ${m} of the ${project.title} project including deliverables and documentation.`,
          dueDate: randomDate(new Date('2025-02-01'), new Date('2026-06-30')),
          completedAt: isCompleted ? randomDate(new Date('2025-02-15'), new Date()) : null,
          status: isCompleted ? ProjectStatus.COMPLETED : ProjectStatus.IN_PROGRESS,
          projectId: project.id,
        },
      });
    }
    console.log(`   ✅ Milestones for ${project.title}`);
  }
  console.log();

  // 17. Certificates
  console.log('🎓 Creating Certificates...');
  const completedEnrollments = await prisma.enrollment.findMany({ where: { isCompleted: true }, include: { student: true, course: true } });
  let certCount = 0;

  for (const enrollment of completedEnrollments) {
    const certId = generateVerificationId();
    await prisma.certificate.create({
      data: {
        certificateId: certId,
        title: `Certificate of Completion - ${enrollment.course.title}`,
        description: `This certifies successful completion of ${enrollment.course.title} with a comprehensive understanding of all modules.`,
        issueDate: randomDate(new Date('2025-03-01'), new Date()),
        status: CertificateStatus.GENERATED,
        studentId: enrollment.student.id,
        courseId: enrollment.course.id,
        verificationUrl: `https://verify.campusskillhub.com/${certId}`,
      },
    });
    certCount++;
  }
  console.log(`   ✅ Created ${certCount} certificates\n`);

  // 18. Subscriptions
  console.log('💳 Creating Subscriptions...');
  const subscriptionPlans = [
    { collegeId: collegeMIT.id, plan: 'PREMIUM', price: 9999.99, start: new Date('2025-01-01'), end: new Date('2026-01-01') },
    { collegeId: collegeStanford.id, plan: 'STANDARD', price: 4999.99, start: new Date('2025-01-01'), end: new Date('2026-01-01') },
  ];

  for (const sub of subscriptionPlans) {
    await prisma.subscription.create({
      data: {
        plan: sub.plan,
        price: sub.price,
        startDate: sub.start,
        endDate: sub.end,
        isActive: true,
        paymentId: `PAY-${uuidv4().split('-')[0].toUpperCase()}`,
        collegeId: sub.collegeId,
      },
    });
    console.log(`   ✅ Subscription for ${sub.collegeId}`);
  }
  console.log();

  // 19. Notifications
  console.log('🔔 Creating Notifications...');
  const allUsers = await prisma.user.findMany();
  const notificationTypes = ['ASSIGNMENT', 'TEST', 'CLASS', 'GENERAL'] as const;
  const notificationMessages = [
    { title: 'New Assignment Posted', msg: 'A new assignment has been posted for your course. Please check the deadline.' },
    { title: 'Test Scheduled', msg: 'A new MCQ test has been scheduled. Please prepare accordingly.' },
    { title: 'Class Reminder', msg: 'Reminder: You have a live class in 1 hour. Please join on time.' },
    { title: 'Grade Published', msg: 'Your grades have been published. Check your results now.' },
    { title: 'Welcome to CampusSkill Hub', msg: 'Welcome! You are now part of CampusSkill Hub. Start exploring courses.' },
  ];

  let notifCount = 0;
  for (const user of allUsers) {
    const notifCountForUser = randomInt(2, 5);
    for (let n = 0; n < notifCountForUser; n++) {
      const template = notificationMessages[randomInt(0, notificationMessages.length - 1)];
      await prisma.notification.create({
        data: {
          title: template.title,
          message: template.msg,
          type: 'IN_APP',
          category: randomElement([...notificationTypes]),
          isRead: Math.random() > 0.4,
          userId: user.id,
          senderId: superAdmin.id,
        },
      });
      notifCount++;
    }
  }
  console.log(`   ✅ Created ${notifCount} notifications\n`);

  // 20. Live Classes
  console.log('📺 Creating Live Classes...');
  let liveClassCount = 0;
  for (const course of allCourses) {
    const trainer = allTrainers.find(t => t.id === course.trainerId);
    const classCount = randomInt(2, 3);
    for (let c = 1; c <= classCount; c++) {
      const isPast = Math.random() > 0.4;
      const startTime = isPast
        ? randomDate(new Date('2025-01-01'), new Date())
        : randomDate(new Date(), new Date('2026-12-31'));
      const endTime = new Date(startTime.getTime() + randomInt(60, 120) * 60000);

      await prisma.liveClass.create({
        data: {
          title: `Lecture ${c}: ${course.title} - ${trainer?.user?.firstName || 'TBD'}`,
          description: `Live interactive session covering advanced topics in ${course.title}.`,
          meetLink: `https://meet.campusskillhub.com/${course.id}-${c}`,
          startTime,
          endTime,
          courseId: course.id,
          trainerId: trainer!.id,
          recordingUrl: isPast ? `https://recordings.campusskillhub.com/${course.id}/lecture-${c}.mp4` : null,
          isCompleted: isPast,
        },
      });
      liveClassCount++;
    }
  }
  console.log(`   ✅ Created ${liveClassCount} live classes\n`);

  console.log('🎉 Seed completed successfully!');
  console.log('📋 Summary:');
  console.log(`   - 1 Super Admin`);
  console.log(`   - 3 Colleges`);
  console.log(`   - 2 College Admins`);
  console.log(`   - 4 Trainers`);
  console.log(`   - 10 Students`);
  console.log(`   - ${allCourses.length} Courses`);
  console.log(`   - ${enrollments.length} Enrollments`);
  console.log(`   - ${attendanceCount} Attendance Records`);
  console.log(`   - ${mcqTests.length} MCQ Tests`);
  console.log(`   - ${attemptCount} MCQ Attempts`);
  console.log(`   - ${allCourses.length} Coding Assessments`);
  console.log(`   - ${assignments.length} Assignments`);
  console.log(`   - ${submissionCount} Assignment Submissions`);
  console.log(`   - ${projects.length} Projects`);
  console.log(`   - ${certCount} Certificates`);
  console.log(`   - ${subscriptionPlans.length} Subscriptions`);
  console.log(`   - ${notifCount} Notifications`);
  console.log(`   - ${liveClassCount} Live Classes`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
