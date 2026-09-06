import { Flashcard } from '../types';

export const FLASHCARDS_DATA: Flashcard[] = [
  {
    id: 'fc-1',
    subjectName: 'Physics',
    grade: 'Grade 11',
    topic: 'Vectors',
    front: 'What is the horizontal velocity component formula for a projectile with initial speed V0 and launch angle θ?',
    back: 'V0x = V0 · cos(θ). Note that V0x stays constant throughout ideal flight because horizontal acceleration ax = 0.',
  },
  {
    id: 'fc-2',
    subjectName: 'Mathematics',
    grade: 'Grade 12',
    topic: 'Calculus',
    front: 'What is the Power Rule for differentiation?',
    back: 'd/dx [ x^n ] = n · x^(n - 1). Bring the exponent to the front as a multiplier and subtract 1 from the power.',
  },
  {
    id: 'fc-3',
    subjectName: 'Chemistry',
    grade: 'Grade 10',
    topic: 'Bonding',
    front: 'What is the octet rule in chemical bonding?',
    back: 'Atoms tend to gain, lose, or share electrons to achieve a stable valence shell of 8 electrons (like noble gases).',
  },
  {
    id: 'fc-4',
    subjectName: 'Biology',
    grade: 'Grade 9',
    topic: 'Cells',
    front: 'What is Osmosis?',
    back: 'The passive diffusion of water molecules across a selectively permeable membrane from higher to lower water concentration.',
  },
  {
    id: 'fc-5',
    subjectName: 'English',
    grade: 'Grade 10',
    topic: 'Grammar',
    front: 'What structure defines the 2nd Conditional?',
    back: 'If + Past Simple, Would + Base Verb. Used for hypothetical or imaginary present/future situations.',
  },
  {
    id: 'fc-6',
    subjectName: 'Information Technology',
    grade: 'Grade 11',
    topic: 'Networking',
    front: 'Which OSI layer is responsible for logical IP addressing and packet routing?',
    back: 'Layer 3 - Network Layer. It routes data packets across subnets using IPv4 / IPv6 protocols.',
  },
];
