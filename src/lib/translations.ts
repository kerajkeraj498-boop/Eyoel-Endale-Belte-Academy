import { Language } from '../types';

export interface Translations {
  // Brand
  brandName: string;
  brandSub: string;
  brandTagline: string;
  
  // Navigation
  navHome: string;
  navCurriculum: string;
  navNotes: string;
  navQuizzes: string;
  navAbout: string;
  navContact: string;
  navAITutor: string;
  navFlashcards: string;
  navSearch: string;
  navSignIn: string;
  navLogin: string;
  navSignUp: string;
  navMyProgress: string;
  navAdmin: string;
  navReportCard: string;
  finalExamsHeading: string;

  // Languages
  langEnglish: string;
  langAmharic: string;
  langAfaanOromoo: string;
  langSelector: string;

  // Grade Selection
  allGrades: string;
  grade9: string;
  grade10: string;
  grade11: string;
  grade12: string;
  selectGrade: string;

  // Streams
  streamAll: string;
  streamNatural: string;
  streamSocial: string;
  streamGeneral: string;

  // Hero Section
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroDesc: string;
  btnExploreCurriculum: string;
  btnPracticeQuizzes: string;
  btnQuickRevision: string;
  statGrades: string;
  statGradesDesc: string;
  statSubjects: string;
  statSubjectsDesc: string;
  statNotes: string;
  statNotesDesc: string;
  statQuestions: string;
  statQuestionsDesc: string;

  // Features Section
  featuresHeading: string;
  featuresSub: string;
  featureCurriculumTitle: string;
  featureCurriculumDesc: string;
  featureExamsTitle: string;
  featureExamsDesc: string;
  featureAITitle: string;
  featureAIDesc: string;
  featureCertTitle: string;
  featureCertDesc: string;

  // Subjects View
  subjectsHeading: string;
  subjectsSub: string;
  btnViewNotes: string;
  btnTakeQuiz: string;
  unitsCount: string;
  notesCount: string;
  quizzesCount: string;

  // Notes View
  notesHeading: string;
  notesSub: string;
  searchNotesPlaceholder: string;
  filterBySubject: string;
  filterByGrade: string;
  readTime: string;
  tableOfContents: string;
  executiveSummary: string;
  keyFormulas: string;
  glossaryTerms: string;
  markCompleted: string;
  markIncomplete: string;
  bookmarkLesson: string;
  bookmarked: string;
  fontSize: string;
  printNotes: string;
  noNotesFound: string;

  // Quiz View
  quizHeading: string;
  quizSub: string;
  startQuiz: string;
  question: string;
  of: string;
  timeRemaining: string;
  nextQuestion: string;
  prevQuestion: string;
  submitExam: string;
  examCompleted: string;
  yourScore: string;
  passedMsg: string;
  failedMsg: string;
  viewCertificate: string;
  retakeQuiz: string;
  reviewExplanations: string;
  correctAnswer: string;
  yourAnswer: string;
  explanation: string;
  hint: string;
  questionsTotal: string;

  // AI Tutor
  aiTutorTitle: string;
  aiTutorDesc: string;
  aiPlaceholder: string;
  aiSend: string;
  aiQuickPrompts: string;

  // Flashcards
  flashcardsTitle: string;
  flashcardsDesc: string;
  flipCard: string;
  nextCard: string;
  prevCard: string;
  shuffle: string;

  // Progress & Profile
  dashboardTitle: string;
  profileTitle: string;
  totalPoints: string;
  completedLessons: string;
  examAccuracy: string;
  studyStreak: string;
  certificatesEarned: string;
  badgesTitle: string;
  savedBookmarks: string;
  recentAttempts: string;
  editProfile: string;
  saveProfile: string;

  // Certificates & Honors
  certTitle: string;
  printCert: string;
  certCertifies: string;
  certClaim: string;
  certGenerate: string;
  certStudentName: string;
  certSubject: string;
  certGrade: string;
  certDistinction: string;
  certVerifiedSeal: string;
  certVerificationId: string;
  certIssueSuccess: string;
  certDownload: string;

  // Pomodoro Study Timer
  timerTitle: string;
  timerFocus: string;
  timerShortBreak: string;
  timerLongBreak: string;
  timerStart: string;
  timerPause: string;
  timerResume: string;
  timerReset: string;
  timerSessionComplete: string;
  timerMinutesLogged: string;
  timerTotalFocusTime: string;
  timerSessionsCompleted: string;
  timerFocusSubject: string;
  timerSoundChime: string;
  timerAmbientSound: string;

  // About View
  aboutHeroTitle: string;
  aboutHeroDesc: string;
  founderTitle: string;
  founderDesc: string;
  missionTitle: string;
  missionDesc: string;
  valuesTitle: string;
  valuesDesc: string;

  // Contact View
  contactTitle: string;
  contactSub: string;
  formName: string;
  formEmail: string;
  formGrade: string;
  formSubject: string;
  formCategory: string;
  formMessage: string;
  formSubmit: string;
  formSuccess: string;

  // Footer
  footerDesc: string;
  footerRights: string;
  quickLinks: string;
  support: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    brandName: 'EYOEL ENDALE BELETE',
    brandSub: 'ACADEMY',
    brandTagline: 'Excellence in Digital Learning',
    
    navHome: 'Home',
    navCurriculum: 'Curriculum',
    navNotes: 'Notes',
    navQuizzes: 'Quizzes',
    navAbout: 'About',
    navContact: 'Contact',
    navAITutor: 'AI Tutor',
    navFlashcards: 'Flashcards',
    navSearch: 'Search...',
    navSignIn: 'Sign In',
    navLogin: 'Login',
    navSignUp: 'Sign Up',
    navMyProgress: 'My Progress',
    navAdmin: 'Admin',
    navReportCard: 'Report Card',
    finalExamsHeading: 'All-Subject Final Exams',

    langEnglish: 'English',
    langAmharic: 'አማርኛ',
    langAfaanOromoo: 'Afaan Oromoo',
    langSelector: 'Language',

    allGrades: 'All Grades',
    grade9: 'Grade 9',
    grade10: 'Grade 10',
    grade11: 'Grade 11',
    grade12: 'Grade 12',
    selectGrade: 'Select Grade',

    streamAll: 'All Streams',
    streamNatural: 'Natural Science',
    streamSocial: 'Social Science',
    streamGeneral: 'General',

    heroBadge: 'Excellence in Digital Learning • Grade 9–12',
    heroTitleLine1: 'Empowering the Next Generation of',
    heroTitleLine2: 'Scholars.',
    heroDesc: 'Access world-class curriculum designed by Eyoel Endale Belete for Ethiopian secondary students and national exam preparation. Interactive learning, chapter summaries, and 20-question exam banks for Grades 9 through 12.',
    btnExploreCurriculum: 'Explore Curriculum',
    btnPracticeQuizzes: 'Practice Quizzes',
    btnQuickRevision: 'Quick Revision',
    statGrades: '4 Grades',
    statGradesDesc: 'Grade 9, 10, 11 & 12',
    statSubjects: '10+ Subjects',
    statSubjectsDesc: 'Science & Social Streams',
    statNotes: '200+ Notes',
    statNotesDesc: 'Unit Chapter Summaries',
    statQuestions: '500+ Questions',
    statQuestionsDesc: 'Step-by-step Solutions',

    featuresHeading: 'Engineered for High-School Mastery',
    featuresSub: 'A complete academic ecosystem designed to guide secondary students from foundational understanding to national exam excellence.',
    featureCurriculumTitle: 'Structured Curriculum',
    featureCurriculumDesc: 'Aligned with official Ethiopian Ministry of Education secondary syllabi across all major STEM and social subjects.',
    featureExamsTitle: '20-Question Exam Banks',
    featureExamsDesc: 'Rigorous, timed assessments with instant grading and detailed step-by-step mathematical & conceptual solutions.',
    featureAITitle: 'Intelligent AI Tutor',
    featureAIDesc: '24/7 personal study companion ready to explain complex formulas, translate concepts, and test your knowledge.',
    featureCertTitle: 'Accredited Certificates',
    featureCertDesc: 'Earn verifiable digital certificates of distinction when you score 70% or higher on subject final examinations.',

    subjectsHeading: 'Explore Subject Curricula',
    subjectsSub: 'Select a subject below to view detailed unit summaries, chapter notes, and 20-question exam assessments.',
    btnViewNotes: 'Study Notes',
    btnTakeQuiz: 'Take 20-Q Quiz',
    unitsCount: 'Units',
    notesCount: 'Notes',
    quizzesCount: 'Exams',

    notesHeading: 'Academic Study Notes & Summaries',
    notesSub: 'Clear, concise, and structured chapter summaries with executive overviews, key formulas, and definitions.',
    searchNotesPlaceholder: 'Search notes by title, topic, or keyword...',
    filterBySubject: 'Filter by Subject',
    filterByGrade: 'Filter by Grade',
    readTime: 'min read',
    tableOfContents: 'Table of Contents',
    executiveSummary: 'Executive Summary',
    keyFormulas: 'Key Formulas & Laws',
    glossaryTerms: 'Key Terms & Definitions',
    markCompleted: 'Mark as Completed',
    markIncomplete: 'Mark as Incomplete',
    bookmarkLesson: 'Bookmark Lesson',
    bookmarked: 'Bookmarked',
    fontSize: 'Text Size',
    printNotes: 'Print / Save PDF',
    noNotesFound: 'No notes found matching your criteria.',

    quizHeading: '20-Question Subject Exam Banks',
    quizSub: 'Test your understanding with rigorous, timed multi-choice exams tailored for Ethiopian matriculation and national exam success.',
    startQuiz: 'Start 20-Question Exam',
    question: 'Question',
    of: 'of',
    timeRemaining: 'Time Left',
    nextQuestion: 'Next Question',
    prevQuestion: 'Previous',
    submitExam: 'Submit Exam',
    examCompleted: 'Exam Completed!',
    yourScore: 'Your Score',
    passedMsg: 'Outstanding performance! You have met the honors standard and earned an official Certificate of Achievement.',
    failedMsg: 'Good effort! Review the detailed step-by-step explanations below, study the chapter notes, and try again to earn your certificate.',
    viewCertificate: 'View Certificate',
    retakeQuiz: 'Retake Exam',
    reviewExplanations: 'Review Question Explanations',
    correctAnswer: 'Correct Answer',
    yourAnswer: 'Your Choice',
    explanation: 'Explanation',
    hint: 'Hint',
    questionsTotal: 'Questions',

    aiTutorTitle: 'AI Study Assistant',
    aiTutorDesc: 'Ask any academic question across Grade 9–12 subjects for instant explanations and practice problems.',
    aiPlaceholder: 'Ask a question about physics, math, chemistry, history...',
    aiSend: 'Ask Assistant',
    aiQuickPrompts: 'Quick Study Prompts',

    flashcardsTitle: 'Interactive Flashcards',
    flashcardsDesc: 'Rapid memory recall practice for formulas, definitions, and high-frequency exam concepts.',
    flipCard: 'Click to Flip Card',
    nextCard: 'Next Card',
    prevCard: 'Previous',
    shuffle: 'Shuffle Cards',

    dashboardTitle: 'Student Academic Dashboard',
    profileTitle: 'Student Profile',
    totalPoints: 'Total Points',
    completedLessons: 'Lessons Completed',
    examAccuracy: 'Exam Accuracy',
    studyStreak: 'Study Streak',
    certificatesEarned: 'Honor Certificates',
    badgesTitle: 'Academic Badges',
    savedBookmarks: 'Saved Study Bookmarks',
    recentAttempts: 'Recent Exam Attempts',
    editProfile: 'Edit Profile',
    saveProfile: 'Save Profile',

    // Certificates & Honors
    certTitle: 'Academic Certificate of Honor',
    printCert: 'Print / Download Certificate',
    certCertifies: 'This is to officially certify that',
    certClaim: 'Claim Certificate',
    certGenerate: 'Issue Certificate',
    certStudentName: 'Student Full Name',
    certSubject: 'Academic Subject',
    certGrade: 'Grade Level',
    certDistinction: 'Honors Distinction',
    certVerifiedSeal: 'Verified Official Seal',
    certVerificationId: 'Verification Record ID',
    certIssueSuccess: 'Certificate successfully verified & issued to student dossier!',
    certDownload: 'Save as PDF / Print',

    // Pomodoro Study Timer
    timerTitle: 'Study Focus Timer',
    timerFocus: 'Focus Session',
    timerShortBreak: 'Short Break',
    timerLongBreak: 'Long Break',
    timerStart: 'Start Timer',
    timerPause: 'Pause',
    timerResume: 'Resume',
    timerReset: 'Reset',
    timerSessionComplete: 'Focus session completed! Great job.',
    timerMinutesLogged: 'Focus minutes logged to your profile',
    timerTotalFocusTime: 'Total Focus Time',
    timerSessionsCompleted: 'Focus Sessions Completed',
    timerFocusSubject: 'Target Subject',
    timerSoundChime: 'Completion Chime',
    timerAmbientSound: 'Study Ambience',

    aboutHeroTitle: 'About Eyoel Endale Belete Educational Platform',
    aboutHeroDesc: 'Dedicated to democratizing high-quality secondary STEM and social education for every Ethiopian high-school student.',
    founderTitle: 'Message from Eyoel Endale Belete',
    founderDesc: 'Welcome to our digital learning platform. Our mission is to equip Ethiopian secondary scholars with comprehensive, clear, and interactive tools to conquer national exams and pursue ambitious academic futures.',
    missionTitle: 'Our Academic Mission',
    missionDesc: 'Bridging educational gaps by providing structured, accessible, and high-standard curricula in English, Amharic, and Afaan Oromoo.',
    valuesTitle: 'Core Principles',
    valuesDesc: 'Academic rigor, clarity, student empowerment, and equal access to excellence.',

    contactTitle: 'Get in Touch with Eyoel Endale Belete',
    contactSub: 'Have questions about curriculum, exams, or suggestions? Send us a message and our academic team will assist you.',
    formName: 'Full Name',
    formEmail: 'Email Address',
    formGrade: 'Current Grade',
    formSubject: 'Subject of Inquiry',
    formCategory: 'Inquiry Category',
    formMessage: 'Your Message',
    formSubmit: 'Send Message',
    formSuccess: 'Thank you! Your message has been received. Our team will get back to you shortly.',

    footerDesc: 'Empowering high school students across Grade 9 through Grade 12 with comprehensive unit notes, 20-question exam banks, multi-language support, and verifiable certificates.',
    footerRights: 'All rights reserved.',
    quickLinks: 'Quick Links',
    support: 'Support & Academic Guidance',
  },

  am: {
    brandName: 'እዮኤል እንዳለ በለጠ',
    brandSub: 'አካዳሚ',
    brandTagline: 'የላቀ የዲጂታል ትምህርት መድረክ',
    
    navHome: 'ዋና ገጽ',
    navCurriculum: 'ስርዓተ-ትምህርት',
    navNotes: 'ማስታወሻዎች',
    navQuizzes: 'ፈተናዎች',
    navAbout: 'ስለ እኛ',
    navContact: 'ያግኙን',
    navAITutor: 'AI አጋዥ',
    navFlashcards: 'ፍላሽ ካርዶች',
    navSearch: 'ይፈልጉ...',
    navSignIn: 'ይግቡ',
    navLogin: 'ይግቡ (Login)',
    navSignUp: 'ይመዝገቡ (Sign Up)',
    navMyProgress: 'የእኔ ውጤት',
    navAdmin: 'አስተዳዳሪ',
    navReportCard: 'የውጤት ካርድ',
    finalExamsHeading: 'የሁሉም ትምህርቶች የመጨረሻ ፈተናዎች',

    langEnglish: 'English',
    langAmharic: 'አማርኛ',
    langAfaanOromoo: 'Afaan Oromoo',
    langSelector: 'ቋንቋ',

    allGrades: 'ሁሉም ክፍሎች',
    grade9: 'ክፍል 9',
    grade10: 'ክፍል 10',
    grade11: 'ክፍል 11',
    grade12: 'ክፍል 12',
    selectGrade: 'ክፍል ይምረጡ',

    streamAll: 'ሁሉም ዘርፎች',
    streamNatural: 'የተፈጥሮ ሳይንስ',
    streamSocial: 'የማህበራዊ ሳይንስ',
    streamGeneral: 'ጠቅላላ',

    heroBadge: 'የላቀ የዲጂታል ትምህርት • ከ9ኛ - 12ኛ ክፍል',
    heroTitleLine1: 'የነገውን የኢትዮጵያ ምሁራን ትውልድ',
    heroTitleLine2: 'በእውቀት እናብቃ።',
    heroDesc: 'በእዮኤል እንዳለ በለጠ የተዘጋጀ ለኢትዮጵያ የሁለተኛ ደረጃ ተማሪዎች እና ለብሔራዊ ፈተና ዝግጅት የሚሆን ዓለም አቀፍ ደረጃውን የጠበቀ የትምህርት መድረክ። ከ9ኛ እስከ 12ኛ ክፍል ዝርዝር የክፍል ማስታወሻዎች እና የ20 ጥያቄዎች የፈተና ባንኮች።',
    btnExploreCurriculum: 'ስርዓተ-ትምህርቱን ይመልከቱ',
    btnPracticeQuizzes: 'ፈተናዎችን ይለማመዱ',
    btnQuickRevision: 'ፈጣን ክለሳ',
    statGrades: '4 ክፍሎች',
    statGradesDesc: '9ኛ፣ 10ኛ፣ 11ኛ እና 12ኛ ክፍል',
    statSubjects: '10+ የትምህርት ዓይነቶች',
    statSubjectsDesc: 'የተፈጥሮና ማህበራዊ ሳይንስ',
    statNotes: '200+ ማስታወሻዎች',
    statNotesDesc: 'የምዕራፍ ዝርዝር ማጠቃለያዎች',
    statQuestions: '500+ ጥያቄዎች',
    statQuestionsDesc: 'ደረጃ በደረጃ የተሰሩ ማብራሪያዎች',

    featuresHeading: 'ለከፍተኛ የትምህርት ውጤታማነት የተሰራ',
    featuresSub: 'የሁለተኛ ደረጃ ተማሪዎችን ከመሰረታዊ ግንዛቤ እስከ ብሔራዊ ፈተና ከፍተኛ ውጤት ድረስ የሚያግዝ የተሟላ የትምህርት ስነ-ምህዳር።',
    featureCurriculumTitle: 'የተዋቀረ ስርዓተ-ትምህርት',
    featureCurriculumDesc: 'ከኢትዮጵያ ትምህርት ሚኒስቴር የሁለተኛ ደረጃ ካሪኩለም ጋር ሙሉ በሙሉ የተጣጣመ።',
    featureExamsTitle: 'የ20 ጥያቄዎች የፈተና ባንኮች',
    featureExamsDesc: 'በጊዜ የተገደቡ፣ ወዲያውኑ ውጤት የሚሰጡ እና ደረጃ በደረጃ የሂሳብና የፅንሰ-ሀሳብ ማብራሪያ ያላቸው ፈተናዎች።',
    featureAITitle: 'ብልህ የ AI ረዳት ሞግዚት',
    featureAIDesc: 'በማንኛውም ጊዜ ውስብስብ ቀመሮችን የሚያብራራ፣ ፅንሰ-ሀሳቦችን የሚያስተምር የጥናት አጋር።',
    featureCertTitle: 'ተቀባይነት ያላቸው ሰርተፊኬቶች',
    featureCertDesc: 'በፈተናዎች 70% እና ከዚያ በላይ ሲያመጡ በስምዎ የተዘጋጀ ይፋዊ የብቃት ሰርተፊኬት ያግኙ።',

    subjectsHeading: 'የትምህርት ዓይነቶችን ይመልከቱ',
    subjectsSub: 'የምዕራፍ ማጠቃለያዎችን፣ የጥናት ማስታወሻዎችን እና የ20 ጥያቄዎች ፈተናዎችን ለማግኘት ከታች ትምህርት ይምረጡ።',
    btnViewNotes: 'ማስታወሻዎችን አንብብ',
    btnTakeQuiz: 'የ20 ጥያቄ ፈተና ውሰድ',
    unitsCount: 'ምዕራፎች',
    notesCount: 'ማስታወሻዎች',
    quizzesCount: 'ፈተናዎች',

    notesHeading: 'የትምህርት ማስታወሻዎች እና ማጠቃለያዎች',
    notesSub: 'ግልጽ እና የተደራጁ የምዕራፍ ማጠቃለያዎች ከዋና ዋና ቀመሮች እና ፍቺዎች ጋር።',
    searchNotesPlaceholder: 'ማስታወሻዎችን በርዕስ፣ በይዘት ወይም በቁልፍ ቃል ይፈልጉ...',
    filterBySubject: 'በትምህርት አይነት ይለዩ',
    filterByGrade: 'በክፍል ደረጃ ይለዩ',
    readTime: 'ደቂቃ ንባብ',
    tableOfContents: 'የማውጫ ዝርዝር',
    executiveSummary: 'ዋና ማጠቃለያ',
    keyFormulas: 'ቁልፍ ቀመሮች እና ህጎች',
    glossaryTerms: 'ቁልፍ ቃላትና ፍቺዎች',
    markCompleted: 'እንደተጠናቀቀ ምልክት አድርግ',
    markIncomplete: 'ያልተጠናቀቀ አድርግ',
    bookmarkLesson: 'ማስታወሻውን መዝግብ',
    bookmarked: 'ተመዝግቧል',
    fontSize: 'የፊደል መጠን',
    printNotes: 'ፕሪንት / PDF አስቀምጥ',
    noNotesFound: 'ከፍለጋዎ ጋር የሚዛመድ ማስታወሻ አልተገኘም።',

    quizHeading: 'የ20 ጥያቄዎች የፈተና ባንኮች',
    quizSub: 'ለኢትዮጵያ የዩኒቨርሲቲ መግቢያና የሁለተኛ ደረጃ ብሔራዊ ፈተናዎች ዝግጅት እውቀትዎን ይፈትሹ።',
    startQuiz: 'የ20 ጥያቄዎች ፈተና ጀምር',
    question: 'ጥያቄ',
    of: 'ከ',
    timeRemaining: 'የቀረ ጊዜ',
    nextQuestion: 'ቀጣይ ጥያቄ',
    prevQuestion: 'የቀደመ ጥያቄ',
    submitExam: 'ፈተናውን ጨርስ',
    examCompleted: 'ፈተናው ተጠናቋል!',
    yourScore: 'ያገኙት ውጤት',
    passedMsg: 'እንኳን ደስ አለዎት! ፈተናውን በከፍተኛ ውጤት በማለፍዎ ይፋዊ የብቃት ሰርተፊኬት አግኝተዋል።',
    failedMsg: 'ጥሩ ጥረት ነው! ከታች ያሉትን ዝርዝር ማብራሪያዎች በማንበብ ማስታወሻዎችን ደግመው ይከልሱና እንደገና ይሞክሩ።',
    viewCertificate: 'ሰርተፊኬቱን ይመልከቱ',
    retakeQuiz: 'እንደገና ፈተን',
    reviewExplanations: 'የጥያቄዎችን ማብራሪያ ይመልከቱ',
    correctAnswer: 'ትክክለኛው መልስ',
    yourAnswer: 'የእርስዎ ምርጫ',
    explanation: 'ማብራሪያ',
    hint: 'ፍንጭ',
    questionsTotal: 'ጥያቄዎች',

    aiTutorTitle: 'AI የጥናት ረዳት',
    aiTutorDesc: 'ከ9ኛ-12ኛ ክፍል ባሉ ትምህርቶች ላይ ማንኛውንም ጥያቄ ይጠይቁ፤ ፈጣን ማብራሪያዎችን ያግኙ።',
    aiPlaceholder: 'ስለ ፊዚክስ፣ ሂሳብ፣ ኬሚስትሪ፣ ታሪክ ጥያቄዎን ይጠይቁ...',
    aiSend: 'ረዳቱን ጠይቅ',
    aiQuickPrompts: 'ፈጣን የጥናት ጥያቄዎች',

    flashcardsTitle: 'የፍላሽ ካርዶች ክለሳ',
    flashcardsDesc: 'ቀመሮችን፣ ፍቺዎችንና የፈተና ነጥቦችን በፍጥነት ለማስታወስ የሚረዳ ተግባራዊ መሳሪያ።',
    flipCard: 'ካርዱን ለመገልበጥ ይጫኑ',
    nextCard: 'ቀጣይ ካርድ',
    prevCard: 'የቀደመ ካርድ',
    shuffle: 'ካርዶችን ቀላቅል',

    dashboardTitle: 'የተማሪ የትምህርት ዳሽቦርድ',
    profileTitle: 'የተማሪ መገለጫ',
    totalPoints: 'አጠቃላይ ነጥብ',
    completedLessons: 'የተጠናቀቁ ትምህርቶች',
    examAccuracy: 'የፈተና ትክክለኛነት',
    studyStreak: 'የትምህርት ተከታታይነት',
    certificatesEarned: 'የተገኙ ሰርተፊኬቶች',
    badgesTitle: 'የትምህርት ባጆች',
    savedBookmarks: 'የተመዘገቡ ማስታወሻዎች',
    recentAttempts: 'የቅርብ ጊዜ የፈተና ውጤቶች',
    editProfile: 'መገለጫ አርትዕ',
    saveProfile: 'መገለጫ አስቀምጥ',

    // Certificates & Honors
    certTitle: 'የአካዳሚክ የክብር ሰርተፊኬት',
    printCert: 'ሰርተፊኬት አትም / አውርድ',
    certCertifies: 'ይህ ሰርተፊኬት በይፋ የሚመሰክረው ለ',
    certClaim: 'ሰርተፊኬት ይውሰዱ',
    certGenerate: 'ሰርተፊኬት ይስጡ',
    certStudentName: 'የተማሪው ሙሉ ስም',
    certSubject: 'የትምህርት አይነት',
    certGrade: 'የክፍል ደረጃ',
    certDistinction: 'የክብር ደረጃ',
    certVerifiedSeal: 'የተረጋገጠ ማህተም',
    certVerificationId: 'የማረጋገጫ መለያ ቁጥር',
    certIssueSuccess: 'ሰርተፊኬቱ በተሳካ ሁኔታ ተረጋግጦ በተማሪው መዝገብ ተቀምጧል!',
    certDownload: 'በPDF አስቀምጥ / አትም',

    // Pomodoro Study Timer
    timerTitle: 'የትምህርት ትኩረት ሰዓት ቆጣሪ',
    timerFocus: 'የትኩረት ጊዜ (25 ደቂቃ)',
    timerShortBreak: 'አጭር እረፍት (5 ደቂቃ)',
    timerLongBreak: 'ረጅም እረፍት (15 ደቂቃ)',
    timerStart: 'ሰዓት ጀምር',
    timerPause: 'አፍታ አቁም',
    timerResume: 'ቀጥል',
    timerReset: 'እንደገና ጀምር',
    timerSessionComplete: 'የትኩረት ሰዓቱ ተጠናቋል! ድንቅ ስራ ነው።',
    timerMinutesLogged: 'የትኩረት ደቂቃዎች በመገለጫዎ ላይ ተመዝግበዋል',
    timerTotalFocusTime: 'አጠቃላይ የትኩረት ሰዓት',
    timerSessionsCompleted: 'የተጠናቀቁ የትኩረት ዙሮች',
    timerFocusSubject: 'የትኩረት ትምህርት',
    timerSoundChime: 'የማጠናቀቂያ ድምፅ',
    timerAmbientSound: 'የትምህርት ድባብ ድምፅ',

    aboutHeroTitle: 'ስለ እዮኤል እንዳለ በለጠ የትምህርት መድረክ',
    aboutHeroDesc: 'ለሁሉም የኢትዮጵያ የሁለተኛ ደረጃ ተማሪዎች ጥራት ያለው የሳይንስና ማህበራዊ ትምህርት ተደራሽ ለማድረግ የተቋቋመ።',
    founderTitle: 'የእዮኤል እንዳለ በለጠ መልዕክት',
    founderDesc: 'እንኳን ወደ ዲጂታል የትምህርት መድረካችን በደህና መጡ። አላማችን ተማሪዎች ብሔራዊ ፈተናዎችን በላቀ ውጤት እንዲያልፉና ብሩህ የወደፊት ተስፋ እንዲኖራቸው ዘመናዊና ግልጽ የትምህርት ግብአቶችን ማቅረብ ነው።',
    missionTitle: 'የትምህርት ተልእኳችን',
    missionDesc: 'በእንግሊዝኛ፣ በአማርኛ እና በአፋን ኦሮሞ የተሟላ ስርዓተ-ትምህርት በማቅረብ የትምህርት ክፍተቶችን መሙላት።',
    valuesTitle: 'ዋና መርሆዎቻችን',
    valuesDesc: 'የትምህርት ጥራት፣ ግልጽነት፣ የተማሪዎች ስኬት እና ፍትሃዊ ተደራሽነት።',

    contactTitle: 'ከእዮኤል እንዳለ በለጠ ጋር ይገናኙ',
    contactSub: 'ስለ ስርዓተ-ትምህርቱ፣ ፈተናዎች ጥያቄ ወይም አስተያየት ካለዎት መልዕክት ይላኩልን።',
    formName: 'ሙሉ ስም',
    formEmail: 'የኢሜይል አድራሻ',
    formGrade: 'የክፍል ደረጃ',
    formSubject: 'የትምህርት አይነት',
    formCategory: 'የጥያቄው አይነት',
    formMessage: 'መልዕክትዎ',
    formSubmit: 'መልዕክት ላክ',
    formSuccess: 'እናመሰግናለን! መልዕክትዎ ደርሶናል። በአጭር ጊዜ ውስጥ ምላሽ እንሰጥዎታለን።',

    footerDesc: 'ከ9ኛ እስከ 12ኛ ክፍል ላሉ የሁለተኛ ደረጃ ተማሪዎች የተሟሉ የክፍል ማስታወሻዎችን፣ የ20 ጥያቄዎች ፈተናዎችን፣ ባለብዙ ቋንቋ ድጋፍን እና ሰርተፊኬቶችን ያቀርባል።',
    footerRights: 'መብቱ በህግ የተጠበቀ ነው።',
    quickLinks: 'ፈጣን ሊንኮች',
    support: 'ድጋፍ እና የአካዳሚክ መመሪያ',
  },

  om: {
    brandName: 'EYOEL ENDALE BELETE',
    brandSub: 'AKADAAMII',
    brandTagline: 'Barnoota Dijitaalaa Sadarkaa Ol\'aanaa',
    
    navHome: 'Fuula Duraa',
    navCurriculum: 'Sirna Barnootaa',
    navNotes: 'Qabxiiwwan',
    navQuizzes: 'Qorumsawwan',
    navAbout: 'Waa\'ee Keenya',
    navContact: 'Nu Qunnamaa',
    navAITutor: 'Gargaaraa AI',
    navFlashcards: 'Kaardiiwwan',
    navSearch: 'Barbaadi...',
    navSignIn: 'Seeni',
    navLogin: 'Seeni (Login)',
    navSignUp: 'Galmaa\'i (Sign Up)',
    navMyProgress: 'Guddina Koo',
    navAdmin: 'Bulchaa',
    navReportCard: 'Waraqaa Qabxii',
    finalExamsHeading: 'Qorumsa Xumuraa Barnoota Hunda',

    langEnglish: 'English',
    langAmharic: 'አማርኛ',
    langAfaanOromoo: 'Afaan Oromoo',
    langSelector: 'Afaan',

    allGrades: 'Kutaalee Hunda',
    grade9: 'Kutaa 9',
    grade10: 'Kutaa 10',
    grade11: 'Kutaa 11',
    grade12: 'Kutaa 12',
    selectGrade: 'Kutaa Filadhu',

    streamAll: 'Dameewwan Hunda',
    streamNatural: 'Saayinsii Uumamaa',
    streamSocial: 'Saayinsii Hawaasaa',
    streamGeneral: 'Waliigala',

    heroBadge: 'Barnoota Dijitaalaa Sadarkaa Ol\'aanaa • Kutaa 9–12',
    heroTitleLine1: 'Dhaloota Barattoota Borii',
    heroTitleLine2: 'Beekumsan Humneessuu.',
    heroDesc: 'Sirna barnootaa sadarkaa addunyaa Eyoel Endale Belete tiin qophaa\'e, barattoota sadarkaa lammaffaa Itoophiyaafi qophii qorumsa biyyaalessaatiif kan oolu. Barumsa interaaktiivii, gabaasa boqonnaawwaniifi qorumsa gaaffilee 20 Kutaa 9 hanga 12tiif.',
    btnExploreCurriculum: 'Sirna Barnootaa Daawwadhu',
    btnPracticeQuizzes: 'Qorumsawwan Shaakali',
    btnQuickRevision: 'Irra-Deebii Saffisaa',
    statGrades: 'Kutaalee 4',
    statGradesDesc: 'Kutaa 9, 10, 11 fi 12',
    statSubjects: 'Gosa Barnootaa 10+',
    statSubjectsDesc: 'Saayinsii Uumamaafi Hawaasaa',
    statNotes: 'Qabxiiwwan 200+',
    statNotesDesc: 'Gabaasa Boqonnaawwanii',
    statQuestions: 'Gaaffilee 500+',
    statQuestionsDesc: 'Ibsa Sadarkaa Sadarkaan',

    featuresHeading: 'Milkaa\'ina Sadarkaa Lammaffaatiif Kan Qophaa\'e',
    featuresSub: 'Barattoota sadarkaa lammaffaa hubannoo bu\'uuraa irraa kaasee hanga qorumsa biyyaalessaatti qajeelchuuf sirna guutuu.',
    featureCurriculumTitle: 'Sirna Barnootaa Qindaa\'aa',
    featureCurriculumDesc: 'Silabasii barnoota sadarkaa lammaffaa Ministeera Barnootaa Itoophiyaa wajjin guutummaatti kan walsimu.',
    featureExamsTitle: 'Kuusaa Qorumsa Gaaffilee 20',
    featureExamsDesc: 'Qorumsawwan yeroon murtaa\'an, qabxii battalaa kennaniifi ibsa herregaafi yaadaa gad-fagoo qaban.',
    featureAITitle: 'Barsiisaa AI Ogeessa',
    featureAIDesc: 'Formulaawwan walxaxaa ibsuufi yaadolee barsiisuuf sa\'aatii 24 qophii kan ta\'e hiriyaa qo\'annoo.',
    featureCertTitle: 'Waraqaa Ragaa Beekamtii',
    featureCertDesc: 'Qorumsa xumuraa irratti 70% fi isaa ol yeroo galmeessitu waraqaa ragaa milkaa\'inaa argadhu.',

    subjectsHeading: 'Gosoota Barnootaa Daawwadhu',
    subjectsSub: 'Gabaasa boqonnaawwanii, qabxiiwwan qo\'annoofi qorumsa gaaffilee 20 argachuuf gosa barnootaa filadhu.',
    btnViewNotes: 'Qabxiiwwan Dubbisi',
    btnTakeQuiz: 'Qorumsa Gaaffilee 20 Fudhadhu',
    unitsCount: 'Yuuniitota',
    notesCount: 'Qabxiiwwan',
    quizzesCount: 'Qorumsawwan',

    notesHeading: 'Qabxiiwwan Qo\'annoofi Gabaasawwan',
    notesSub: 'Gabaasa boqonnaawwanii ifa ta\'an, formulaawwan ijoo fi hiika jechootaa wajjin.',
    searchNotesPlaceholder: 'Mata-dureen, qabiyyee ykn jecha ijoon barbaadi...',
    filterBySubject: 'Gosa Barnootaan Cali',
    filterByGrade: 'Kutaan Cali',
    readTime: 'daqiiqaa dubbisa',
    tableOfContents: 'Baafata Qabiyyee',
    executiveSummary: 'Gabaasa Waliigalaa',
    keyFormulas: 'Formulaawwaniifi Seerota Ijoo',
    glossaryTerms: 'Jechoota Ijoofi Hiika Isaanii',
    markCompleted: 'Xumurameera Jedhi',
    markIncomplete: 'Hin Xumuramne',
    bookmarkLesson: 'Galmeessi',
    bookmarked: 'Galmeeffameera',
    fontSize: 'Guddina Qubee',
    printNotes: 'Maxxansi / PDF Olkaa\'i',
    noNotesFound: 'Qabxiin barbaaddan wajjin walsimu hin argamne.',

    quizHeading: 'Kuusaa Qorumsa Gaaffilee 20',
    quizSub: 'Qophii qorumsa biyyaalessaafi seensa yunivarsiitiitiif hubannoo kee qori.',
    startQuiz: 'Qorumsa Gaaffilee 20 Jalqabi',
    question: 'Gaaffii',
    of: 'keessaa',
    timeRemaining: 'Yeroo Hafe',
    nextQuestion: 'Gaaffii Itti Aanu',
    prevQuestion: 'Gaaffii Duraa',
    submitExam: 'Qorumsa Xumuri',
    examCompleted: 'Qorumsi Xumurameera!',
    yourScore: 'Qabxii Kee',
    passedMsg: 'Baga gammaddan! Qorumsa milkaa\'inaan darbuun waraqaa ragaa seera qabeessaa argattaniittu.',
    failedMsg: 'Yaalii gaariidha! Ibsa armaan gadii dubbisuun irra deebi\'aa qo\'adhaatii ammas yaalaa.',
    viewCertificate: 'Waraqaa Ragaa Ilaali',
    retakeQuiz: 'Irra Deebi\'ii Qorami',
    reviewExplanations: 'Ibsa Gaaffilee Ilaali',
    correctAnswer: 'Deebii Sirrii',
    yourAnswer: 'Filannoo Kee',
    explanation: 'Ibsa',
    hint: 'Qajeelcha',
    questionsTotal: 'Gaaffilee',

    aiTutorTitle: 'Gargaaraa Qo\'annoo AI',
    aiTutorDesc: 'Barnoota Kutaa 9–12 ilaalchisee gaaffii kamiyyuu gaafadhaa, ibsa battalaa argadhaa.',
    aiPlaceholder: 'Waa\'ee fiiziksii, herregaa, keemistrii, seenaa gaafadhu...',
    aiSend: 'Gargaaraa Gaafadhu',
    aiQuickPrompts: 'Gaaffilee Qo\'annoo Saffisaa',

    flashcardsTitle: 'Kaardiiwwan Yaadaa Interaaktiivii',
    flashcardsDesc: 'Formulaawwan, hiika jechootaafi yaadolee qorumsaa saffisaan yaadachuuf kan gargaaru.',
    flipCard: 'Kaardicha Garagalchuuf Tuqi',
    nextCard: 'Kaardii Itti Aanu',
    prevCard: 'Kaardii Duraa',
    shuffle: 'Kaardiiwwan Makeessi',

    dashboardTitle: 'Daashboordii Barataa',
    profileTitle: 'Piroofaayilii Barataa',
    totalPoints: 'Qabxii Waliigalaa',
    completedLessons: 'Barnoota Xumuraman',
    examAccuracy: 'Sirrummaa Qorumsaa',
    studyStreak: 'Hordoffii Qo\'annoo',
    certificatesEarned: 'Waraqaawwan Ragaa',
    badgesTitle: 'Beekamtiiwwan',
    savedBookmarks: 'Qabxiiwwan Galmeeffaman',
    recentAttempts: 'Qorumsawwan Dhihoo',
    editProfile: 'Piroofaayilii Gulaali',
    saveProfile: 'Piroofaayilii Olkaa\'i',

    // Certificates & Honors
    certTitle: 'Waraqaa Ragaa Kabajaa Barnootaa',
    printCert: 'Waraqaa Ragaa Maxxansi / Buufadhu',
    certCertifies: 'Waraqaan ragaa kun ifatti kan mirkaneessu',
    certClaim: 'Waraqaa Ragaa Fudhadhaa',
    certGenerate: 'Waraqaa Ragaa Kenni',
    certStudentName: 'Maqaa Guutuu Barataa',
    certSubject: 'Gosa Barnootaa',
    certGrade: 'Sadarkaa Kutaa',
    certDistinction: 'Sadarkaa Kabajaa',
    certVerifiedSeal: 'Chaappaa Mirkanaa\'e',
    certVerificationId: 'Lakk. Mirkaneessaa',
    certIssueSuccess: 'Waraqaan ragaa milkaa\'inaan mirkanaa\'ee kuusaa barataatti dabalameera!',
    certDownload: 'PDF Olkaa\'i / Maxxansi',

    // Pomodoro Study Timer
    timerTitle: 'Safartuu Yeroo Xiyyeeffannoo Barnootaa',
    timerFocus: 'Yeroo Xiyyeeffannoo (Daq 25)',
    timerShortBreak: 'Boqonnaa Gabaabaa (Daq 5)',
    timerLongBreak: 'Boqonnaa Dheeraa (Daq 15)',
    timerStart: 'Yeroo Jalqabi',
    timerPause: 'Qaqqabi',
    timerResume: 'Itti Fufi',
    timerReset: 'Haaraatti Jalqabi',
    timerSessionComplete: 'Yeroon xiyyeeffannoo xumurameera! Hojii gaarii.',
    timerMinutesLogged: 'Daqiiqaawwan xiyyeeffannoo piroofaayilii keessan irratti galmaa\'aniiru',
    timerTotalFocusTime: 'Waliigala Yeroo Xiyyeeffannoo',
    timerSessionsCompleted: 'Marsaa Xiyyeeffannoo Xumurame',
    timerFocusSubject: 'Gosa Barnootaa',
    timerSoundChime: 'Sagalee Xumuraa',
    timerAmbientSound: 'Sagalee Naannoo Barnootaa',

    aboutHeroTitle: 'Waa\'ee Sirna Barnootaa Eyoel Endale Belete',
    aboutHeroDesc: 'Barattoota sadarkaa lammaffaa Itoophiyaa hundaaf barnoota qulqullina qabu dhaqqabamaa gochuuf kan hundeeffame.',
    founderTitle: 'Ergaa Eyoel Endale Belete irraa',
    founderDesc: 'Gara sirna barnoota dijitaalaa keenyaatti baga nagaan dhuftan. Kaayyoon keenya barattoonni sadarkaa lammaffaa qorumsa biyyaalessaa irratti qabxii olaanaa akka galmeessan deeggaruudha.',
    missionTitle: 'Ergama Barnootaa Keenya',
    missionDesc: 'Afaan Ingilizii, Afaan Amaaraafi Afaan Oromootiin sirna barnootaa guutuu dhiyeessuun hanqinaalee jiran furuu.',
    valuesTitle: 'Qajeeltoowwan Ijoo',
    valuesDesc: 'Qulqullina barnootaa, iftoomina, milkaa\'ina barattootaafi dhaqqabamummaa wal-qixa.',

    contactTitle: 'Eyoel Endale Belete Qunnamaa',
    contactSub: 'Waa\'ee sirna barnootaa ykn qorumsawwanii gaaffii yoo qabaattan ergaa nuuf ergaa.',
    formName: 'Maqaa Guutuu',
    formEmail: 'Teessoo Imeelii',
    formGrade: 'Sadarkaa Kutaa',
    formSubject: 'Gosa Barnootaa',
    formCategory: 'Gosa Gaaffii',
    formMessage: 'Ergaa Keessan',
    formSubmit: 'Ergaa Ergi',
    formSuccess: 'Galatoomaa! Ergaan keessan nu ga\'eera. Yeroo dhiyootti deebii isiniif laanna.',

    footerDesc: 'Barattoota Kutaa 9 hanga 12tiif qabxiiwwan boqonnaa guutuu, kuusaa qorumsa gaaffilee 20, deeggarsa afaanota adda addaafi waraqaa ragaa kenna.',
    footerRights: 'Mirgi hundi seeraan kan eegame.',
    quickLinks: 'Liinkiiwwan Saffisaa',
    support: 'Deeggarsaafi Qajeelcha Barnootaa',
  },
};

export const SUBJECT_TRANSLATIONS: Record<string, Record<Language, string>> = {
  'Mathematics': {
    en: 'Mathematics',
    am: 'ሂሳብ',
    om: 'Herrega',
  },
  'Physics': {
    en: 'Physics',
    am: 'ፊዚክስ',
    om: 'Fiiziksii',
  },
  'Chemistry': {
    en: 'Chemistry',
    am: 'ኬሚስትሪ',
    om: 'Keemistrii',
  },
  'Biology': {
    en: 'Biology',
    am: 'ባዮሎጂ',
    om: 'Baayoloojii',
  },
  'English': {
    en: 'English Language',
    am: 'የእንግሊዝኛ ቋንቋ',
    om: 'Afaan Ingilizii',
  },
  'History': {
    en: 'History',
    am: 'ታሪክ',
    om: 'Seenaa',
  },
  'Geography': {
    en: 'Geography',
    am: 'ጂኦግራፊ',
    om: 'Ji\'oogiraafii',
  },
  'Economics': {
    en: 'Economics',
    am: 'ኢኮኖሚክስ',
    om: 'Ikonomiksii',
  },
  'Civics': {
    en: 'Civics & Ethical Education',
    am: 'ስነ-ዜጋና ስነ-ምግባር',
    om: 'Lammummaafi Naamusa',
  },
  'Information Technology': {
    en: 'Information Technology (IT)',
    am: 'ኢንፎርሜሽን ቴክኖሎጂ (IT)',
    om: 'Teeknooloojii Odeeffannoo (IT)',
  },
  'Amharic': {
    en: 'Amharic Language & Literature',
    am: 'አማርኛ ቋንቋና ስነ-ጽሁፍ',
    om: 'Afaan Amaaraafi Ogbarruu',
  },
  'Afaan Oromoo': {
    en: 'Afaan Oromoo Language & Culture',
    am: 'አፋን ኦሮሞ ቋንቋና ባህል',
    om: 'Afaan Oromoofi Ogbarruu',
  },
  'HPE': {
    en: 'Health & Physical Education (HPE)',
    am: 'የጤናና የሰውነት ማጎልመሻ ትምህርት (HPE)',
    om: 'Barnoota Fayyaafi Ispoortii (HPE)',
  },
};
