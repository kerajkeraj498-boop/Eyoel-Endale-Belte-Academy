export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Notes & Curriculum' | 'Quizzes & Scoring' | 'Account & Settings';
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'Is Eyoel Academy free for Grade 9–12 students?',
    answer: 'Yes! Eyoel Academy provides open-access academic resources including full subject summaries, unit notes, practice quizzes, and revision tools for high school students.',
  },
  {
    id: 'faq-2',
    category: 'Notes & Curriculum',
    question: 'Which grades and streams are supported on Eyoel Academy?',
    answer: 'We cover Grade 9, Grade 10, Grade 11, and Grade 12. For Grades 11 and 12, both Natural Science (Physics, Chemistry, Biology, Advanced Math) and Social Science (History, Geography, Economics) streams are fully covered.',
  },
  {
    id: 'faq-3',
    category: 'Notes & Curriculum',
    question: 'Can I bookmark or export notes to read offline?',
    answer: 'Yes! You can bookmark any unit note to your saved list, change font sizes, toggle dark reading mode, or click "Export Summary" to generate a printable study cheat sheet.',
  },
  {
    id: 'faq-4',
    category: 'Quizzes & Scoring',
    question: 'How do the Practice and Timed Exam quiz modes work?',
    answer: 'Practice Mode provides immediate answer feedback and detailed step-by-step explanations after every question. Timed Exam Mode simulates real national exams with a live countdown clock and complete score analysis at the end.',
  },
  {
    id: 'faq-5',
    category: 'Account & Settings',
    question: 'Does Eyoel Academy remember my quiz scores and bookmarks?',
    answer: 'Yes, your quiz attempts, badges, bookmarks, and dark/light mode preference are automatically saved in your browser local storage.',
  },
  {
    id: 'faq-6',
    category: 'General',
    question: 'How can I submit feedback or ask a specific subject question?',
    answer: 'Navigate to our Contact Us page and fill out the inquiry form. Our teaching team reviews student messages and updates unit notes based on your input!',
  },
];
