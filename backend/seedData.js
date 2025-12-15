const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Content = require('./models/Content');
const Quiz = require('./models/Quiz');
const Progress = require('./models/Progress');
const QuizResult = require('./models/QuizResult');

// Connect to MongoDB
//username- shrivastavrishabh003_db_user
//password- IS2XjVngopA4hPdp
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})


const seedData = async () => {
  '[,'
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Content.deleteMany({});
    await Quiz.deleteMany({});
    await Progress.deleteMany({});
    await QuizResult.deleteMany({});

    console.log('✅ Cleared existing data');

    // Create Users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@vidyasetu.com',
      password: 'password@123',
      role: 'admin',
      isActive: true
    });

    const teacher1 = await User.create({
      name: 'Dr. Priya Sharma',
      email: 'priya.sharma@vidyasetu.com',
      password: 'password@123',
      role: 'teacher',
      grade: '10',
      school: 'Delhi Public School',
      location: 'New Delhi, India',
      isActive: true
    });

    const teacher2 = await User.create({
      name: 'Prof. Rajesh Kumar',
      email: 'rajesh.kumar@vidyasetu.com',
      password: 'password@123',
      role: 'teacher',
      grade: '12',
      school: 'Kendriya Vidyalaya',
      location: 'Mumbai, India',
      isActive: true
    });

    const students = [];

    students.push(await User.create({
      name: 'Aarav Patel',
      email: 'aarav.patel@student.com',
      password: 'password@123',
      role: 'student',
      grade: '10',
      school: 'Rural High School',
      location: 'Gujarat, India',
      isActive: true
    }));

    students.push(await User.create({
      name: 'Diya Singh',
      email: 'diya.singh@student.com',
      password: 'password@123',
      role: 'student',
      grade: '10',
      school: 'Government School',
      location: 'Rajasthan, India',
      isActive: true
    }));

    students.push(await User.create({
      name: 'Arjun Reddy',
      email: 'arjun.reddy@student.com',
      password: 'password@123',
      role: 'student',
      grade: '12',
      school: 'Community School',
      location: 'Telangana, India',
      isActive: true
    }));

    console.log('✅ Created users');

    // Create Content
    const contents = await Content.insertMany([
      {
        title: 'Introduction to Algebra',
        description: 'Learn the basics of algebraic expressions and equations',
        subject: 'Mathematics',
        grade: '10',
        contentType: 'video',
        textContent: 'Algebra is a branch of mathematics dealing with symbols and rules...',
        difficulty: 'beginner',
        tags: ['algebra', 'math', 'basics'],
        createdBy: teacher1._id,
        isPublished: true,
        views: 150,
        downloads: 45,
        likes: [students[0]._id, students[1]._id]
      },
      {
        title: 'Quadratic Equations',
        description: 'Master quadratic equations and their applications',
        subject: 'Mathematics',
        grade: '10',
        contentType: 'pdf',
        textContent: 'Quadratic equations are polynomial equations of degree 2...',
        difficulty: 'intermediate',
        tags: ['quadratic', 'equations', 'algebra'],
        createdBy: teacher1._id,
        isPublished: true,
        views: 120,
        downloads: 38,
        likes: [students[0]._id]
      },
      {
        title: 'Photosynthesis Explained',
        description: 'Understanding how plants convert sunlight into energy',
        subject: 'Science',
        grade: '10',
        contentType: 'video',
        textContent: 'Photosynthesis is the process by which plants use sunlight...',
        difficulty: 'beginner',
        tags: ['biology', 'plants', 'photosynthesis'],
        createdBy: teacher1._id,
        isPublished: true,
        views: 200,
        downloads: 60,
        likes: [students[1]._id, students[2]._id]
      },
      {
        title: 'Newtons Laws of Motion',
        description: 'Explore the three fundamental laws of motion',
        subject: 'Science',
        grade: '10',
        contentType: 'text',
        textContent: 'Newtons three laws of motion describe the relationship between forces and motion...',
        difficulty: 'intermediate',
        tags: ['physics', 'motion', 'newton'],
        createdBy: teacher2._id,
        isPublished: true,
        views: 180,
        downloads: 52,
        likes: [students[0]._id, students[2]._id]
      },
      {
        title: 'English Grammar Basics',
        description: 'Master the fundamentals of English grammar',
        subject: 'English',
        grade: '10',
        contentType: 'text',
        textContent: 'Grammar is the structure of language...',
        difficulty: 'beginner',
        tags: ['grammar', 'english', 'language'],
        createdBy: teacher2._id,
        isPublished: true,
        views: 95,
        downloads: 30
      },
      {
        title: 'Indian History - Independence Movement',
        description: 'Learn about Indias struggle for independence',
        subject: 'Social Studies',
        grade: '10',
        contentType: 'video',
        textContent: 'The Indian independence movement was a series of activities...',
        difficulty: 'intermediate',
        tags: ['history', 'independence', 'india'],
        createdBy: teacher2._id,
        isPublished: true,
        views: 140,
        downloads: 42,
        likes: [students[1]._id]
      }
    ]);

    console.log('✅ Created content');

    // Create Quizzes
    const quizzes = await Quiz.insertMany([
      {
        title: 'Algebra Fundamentals Quiz',
        description: 'Test your knowledge of basic algebra concepts',
        subject: 'Mathematics',
        grade: '10',
        duration: 15,
        passingScore: 60,
        difficulty: 'beginner',
        createdBy: teacher1._id,
        isPublished: true,
        attempts: 45,
        questions: [
          {
            questionText: 'What is 2x + 3 = 11? Solve for x.',
            questionType: 'mcq',
            options: [
              { text: 'x = 3', isCorrect: false },
              { text: 'x = 4', isCorrect: true },
              { text: 'x = 5', isCorrect: false },
              { text: 'x = 6', isCorrect: false }
            ],
            correctAnswer: 'x = 4',
            explanation: 'Subtract 3 from both sides: 2x = 8, then divide by 2: x = 4',
            points: 1
          },
          {
            questionText: 'Is (x + 2)(x - 2) = x² - 4?',
            questionType: 'true-false',
            correctAnswer: 'True',
            explanation: 'This is the difference of squares formula',
            points: 1
          },
          {
            questionText: 'Simplify: 3x + 5x',
            questionType: 'short-answer',
            correctAnswer: '8x',
            explanation: 'Combine like terms: 3x + 5x = 8x',
            points: 1
          }
        ]
      },
      {
        title: 'Photosynthesis Quiz',
        description: 'Test your understanding of photosynthesis',
        subject: 'Science',
        grade: '10',
        duration: 10,
        passingScore: 70,
        difficulty: 'beginner',
        createdBy: teacher1._id,
        isPublished: true,
        attempts: 38,
        questions: [
          {
            questionText: 'Which organelle is responsible for photosynthesis?',
            questionType: 'mcq',
            options: [
              { text: 'Mitochondria', isCorrect: false },
              { text: 'Chloroplast', isCorrect: true },
              { text: 'Nucleus', isCorrect: false },
              { text: 'Ribosome', isCorrect: false }
            ],
            correctAnswer: 'Chloroplast',
            explanation: 'Chloroplasts contain chlorophyll and are the site of photosynthesis',
            points: 1
          },
          {
            questionText: 'Does photosynthesis produce oxygen?',
            questionType: 'true-false',
            correctAnswer: 'True',
            explanation: 'Oxygen is released as a byproduct of photosynthesis',
            points: 1
          }
        ]
      },
      {
        title: 'Quadratic Equations Challenge',
        description: 'Advanced quiz on quadratic equations',
        subject: 'Mathematics',
        grade: '10',
        duration: 20,
        passingScore: 75,
        difficulty: 'advanced',
        createdBy: teacher1._id,
        isPublished: true,
        attempts: 22,
        questions: [
          {
            questionText: 'Solve: x² - 5x + 6 = 0',
            questionType: 'mcq',
            options: [
              { text: 'x = 2, 3', isCorrect: true },
              { text: 'x = 1, 6', isCorrect: false },
              { text: 'x = -2, -3', isCorrect: false },
              { text: 'x = 0, 5', isCorrect: false }
            ],
            correctAnswer: 'x = 2, 3',
            explanation: 'Factor: (x-2)(x-3) = 0, so x = 2 or x = 3',
            points: 2
          },
          {
            questionText: 'What is the discriminant of x² + 4x + 4 = 0?',
            questionType: 'short-answer',
            correctAnswer: '0',
            explanation: 'Discriminant = b² - 4ac = 16 - 16 = 0',
            points: 2
          }
        ]
      }
    ]);

    console.log('✅ Created quizzes');

    // Create Progress for students
    const progressData = [];

    // Student 0 progress
    progressData.push({
      student: students[0]._id,
      content: contents[0]._id,
      status: 'completed',
      progressPercentage: 100,
      timeSpent: 45,
      completedAt: new Date(),
      lastAccessedAt: new Date()
    });

    progressData.push({
      student: students[0]._id,
      content: contents[1]._id,
      status: 'in-progress',
      progressPercentage: 65,
      timeSpent: 30,
      lastAccessedAt: new Date()
    });

    // Student 1 progress
    progressData.push({
      student: students[1]._id,
      content: contents[2]._id,
      status: 'completed',
      progressPercentage: 100,
      timeSpent: 50,
      completedAt: new Date(),
      lastAccessedAt: new Date()
    });

    progressData.push({
      student: students[1]._id,
      content: contents[0]._id,
      status: 'in-progress',
      progressPercentage: 40,
      timeSpent: 20,
      lastAccessedAt: new Date()
    });

    await Progress.insertMany(progressData);
    console.log('✅ Created progress records');

    // Create Quiz Results
    const quizResults = await QuizResult.insertMany([
      {
        quiz: quizzes[0]._id,
        student: students[0]._id,
        score: 3,
        totalPoints: 3,
        percentage: 100,
        passed: true,
        timeTaken: 12,
        attemptNumber: 1,
        startedAt: new Date(Date.now() - 3600000),
        submittedAt: new Date(),
        answers: [
          { questionId: quizzes[0].questions[0]._id, userAnswer: 'x = 4', isCorrect: true, pointsEarned: 1 },
          { questionId: quizzes[0].questions[1]._id, userAnswer: 'True', isCorrect: true, pointsEarned: 1 },
          { questionId: quizzes[0].questions[2]._id, userAnswer: '8x', isCorrect: true, pointsEarned: 1 }
        ]
      },
      {
        quiz: quizzes[1]._id,
        student: students[1]._id,
        score: 2,
        totalPoints: 2,
        percentage: 100,
        passed: true,
        timeTaken: 8,
        attemptNumber: 1,
        startedAt: new Date(Date.now() - 7200000),
        submittedAt: new Date(),
        answers: [
          { questionId: quizzes[1].questions[0]._id, userAnswer: 'Chloroplast', isCorrect: true, pointsEarned: 1 },
          { questionId: quizzes[1].questions[1]._id, userAnswer: 'True', isCorrect: true, pointsEarned: 1 }
        ]
      },
      {
        quiz: quizzes[0]._id,
        student: students[1]._id,
        score: 2,
        totalPoints: 3,
        percentage: 66.67,
        passed: true,
        timeTaken: 14,
        attemptNumber: 1,
        startedAt: new Date(Date.now() - 5400000),
        submittedAt: new Date(),
        answers: [
          { questionId: quizzes[0].questions[0]._id, userAnswer: 'x = 4', isCorrect: true, pointsEarned: 1 },
          { questionId: quizzes[0].questions[1]._id, userAnswer: 'False', isCorrect: false, pointsEarned: 0 },
          { questionId: quizzes[0].questions[2]._id, userAnswer: '8x', isCorrect: true, pointsEarned: 1 }
        ]
      }
    ]);

    console.log('✅ Created quiz results');

    console.log('\n🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Users: ${1 + 2 + students.length} (1 admin, 2 teachers, ${students.length} students)`);
    console.log(`   - Content: ${contents.length}`);
    console.log(`   - Quizzes: ${quizzes.length}`);
    console.log(`   - Progress records: ${progressData.length}`);
    console.log(`   - Quiz results: ${quizResults.length}`);
    console.log('\n👤 Login credentials:');
    console.log('   Admin: admin@vidyasetu.com / password123');
    console.log('   Teacher: priya.sharma@vidyasetu.com / password123');
    console.log('   Student: aarav.patel@student.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
