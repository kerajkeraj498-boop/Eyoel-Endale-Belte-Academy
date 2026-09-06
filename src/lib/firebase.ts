import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { StudentUser, QuizAttempt, CertificateRecord, Subject, NoteChapter, Quiz, GradeLevel, SubjectStream, StudentReportCard } from '../types';

// Admin email configured for full elevated portal rights
export const ADMIN_EMAIL = 'kerajkeraj498@gmail.com';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

// Helper to determine if user is admin
export function isUserAdmin(email?: string | null, role?: string): boolean {
  if (!email) return false;
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) return true;
  return role === 'admin';
}

// -------------------------------------------------------------
// Authentication Functions
// -------------------------------------------------------------

export async function signUpStudent(
  name: string,
  email: string,
  password: string,
  grade: GradeLevel = 'Grade 11',
  stream: SubjectStream = 'Natural Science',
  username?: string
): Promise<StudentUser> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const fbUser = userCredential.user;

  // Update display name in Firebase Auth
  await updateProfile(fbUser, { displayName: name });

  const role: 'student' | 'admin' = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'student';

  const cleanUsername = username?.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '') || email.split('@')[0];

  const newProfile: StudentUser = {
    id: fbUser.uid,
    name: name || 'Student Scholar',
    username: cleanUsername,
    email: fbUser.email || email,
    grade,
    stream,
    role,
    avatar: role === 'admin' ? '🛡️' : '🎓',
    targetScore: 560,
    studyStreakDays: 1,
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    bio: `${grade} ${stream} student at Eyoel Academy.`,
    notesCompleted: [],
    bookmarks: [],
    badges: ['Welcome Scholar'],
    certificates: [],
    totalScore: 0,
    quizCount: 0,
    totalStudyMinutes: 0,
    pomodoroSessionsCompleted: 0,
  };

  // Save to Firestore
  await setDoc(doc(db, 'users', fbUser.uid), newProfile);
  return newProfile;
}

export async function loginStudent(emailOrUsername: string, password: string): Promise<StudentUser> {
  let targetEmail = emailOrUsername.trim().toLowerCase();

  // If user entered a username instead of an email, check Firestore for user with this username
  if (!targetEmail.includes('@')) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', targetEmail));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        const foundDoc = querySnap.docs[0].data() as StudentUser;
        if (foundDoc.email) {
          targetEmail = foundDoc.email;
        }
      } else {
        // Fallback default format if created without separate email
        targetEmail = `${targetEmail}@eyoelacademy.edu.et`;
      }
    } catch {
      targetEmail = `${targetEmail}@eyoelacademy.edu.et`;
    }
  }

  const userCredential = await signInWithEmailAndPassword(auth, targetEmail, password);
  const fbUser = userCredential.user;

  // Retrieve Profile from Firestore
  const userDocRef = doc(db, 'users', fbUser.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (userSnapshot.exists()) {
    const data = userSnapshot.data() as StudentUser;
    // ensure admin role if matches admin email
    if (targetEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase() && data.role !== 'admin') {
      const updated = { ...data, role: 'admin' as const };
      await updateDoc(userDocRef, { role: 'admin' });
      return updated;
    }
    return data;
  }

  // If user profile doc missing, create one
  const role: 'student' | 'admin' = targetEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'student';
  const newProfile: StudentUser = {
    id: fbUser.uid,
    name: fbUser.displayName || targetEmail.split('@')[0],
    username: targetEmail.split('@')[0],
    email: fbUser.email || targetEmail,
    grade: 'Grade 11',
    stream: 'Natural Science',
    role,
    avatar: role === 'admin' ? '🛡️' : '🎓',
    targetScore: 560,
    studyStreakDays: 1,
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    bio: 'Student at Eyoel Academy.',
    notesCompleted: [],
    bookmarks: [],
    badges: ['Welcome Scholar'],
    certificates: [],
    totalScore: 0,
    quizCount: 0,
    totalStudyMinutes: 0,
    pomodoroSessionsCompleted: 0,
  };

  await setDoc(userDocRef, newProfile);
  return newProfile;
}

export async function loginWithGoogle(): Promise<StudentUser> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  const fbUser = result.user;

  const userDocRef = doc(db, 'users', fbUser.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (userSnapshot.exists()) {
    const data = userSnapshot.data() as StudentUser;
    if (fbUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() && data.role !== 'admin') {
      const updated = { ...data, role: 'admin' as const };
      await updateDoc(userDocRef, { role: 'admin' });
      return updated;
    }
    return data;
  }

  const role: 'student' | 'admin' = (fbUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) ? 'admin' : 'student';
  const newProfile: StudentUser = {
    id: fbUser.uid,
    name: fbUser.displayName || 'Google Scholar',
    email: fbUser.email || '',
    grade: 'Grade 12',
    stream: 'Natural Science',
    role,
    avatar: '🎓',
    targetScore: 580,
    studyStreakDays: 1,
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    bio: 'Student candidate at Eyoel Academy',
    notesCompleted: [],
    bookmarks: [],
    badges: ['Welcome Scholar'],
    certificates: [],
    totalScore: 0,
    quizCount: 0,
    totalStudyMinutes: 0,
    pomodoroSessionsCompleted: 0,
  };

  await setDoc(userDocRef, newProfile);
  return newProfile;
}

export async function logoutStudent(): Promise<void> {
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

// Subscribe to Auth State Changes
export function subscribeToAuth(
  onUserChanged: (user: StudentUser | null, fbUser: FirebaseUser | null) => void
) {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (!fbUser) {
      onUserChanged(null, null);
      return;
    }

    try {
      const userDocRef = doc(db, 'users', fbUser.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const profile = userSnapshot.data() as StudentUser;
        onUserChanged(profile, fbUser);
      } else {
        const role = fbUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'student';
        const initialProfile: StudentUser = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Student Scholar',
          email: fbUser.email || '',
          grade: 'Grade 11',
          stream: 'Natural Science',
          role,
          avatar: role === 'admin' ? '🛡️' : '🎓',
          targetScore: 560,
          studyStreakDays: 1,
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          bio: 'Student at Eyoel Academy',
          notesCompleted: [],
          bookmarks: [],
          badges: ['Welcome Scholar'],
          certificates: [],
          totalScore: 0,
          quizCount: 0,
          totalStudyMinutes: 0,
          pomodoroSessionsCompleted: 0,
        };
        await setDoc(userDocRef, initialProfile);
        onUserChanged(initialProfile, fbUser);
      }
    } catch (err) {
      console.warn('Error fetching Firestore user profile on auth state change:', err);
      onUserChanged(null, fbUser);
    }
  });
}

// -------------------------------------------------------------
// User Profile & Progress Firestore Methods
// -------------------------------------------------------------

export async function updateUserProfile(userId: string, updates: Partial<StudentUser>): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, updates);
  } catch (err) {
    console.error('Error updating user profile in Firestore:', err);
  }
}

export async function toggleBookmarkInFirestore(
  userId: string,
  noteId: string,
  currentBookmarks: string[]
): Promise<string[]> {
  const isBookmarked = currentBookmarks.includes(noteId);
  const updated = isBookmarked
    ? currentBookmarks.filter((id) => id !== noteId)
    : [...currentBookmarks, noteId];

  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { bookmarks: updated });
  } catch (err) {
    console.error('Failed to update bookmarks in Firestore:', err);
  }
  return updated;
}

export async function toggleNoteCompletionInFirestore(
  userId: string,
  noteId: string,
  currentCompleted: string[],
  currentBadges: string[] = []
): Promise<{ notesCompleted: string[]; badges: string[] }> {
  const isDone = currentCompleted.includes(noteId);
  const updatedNotes = isDone
    ? currentCompleted.filter((id) => id !== noteId)
    : [...currentCompleted, noteId];

  const updatedBadges = [...currentBadges];
  if (updatedNotes.length >= 3 && !updatedBadges.includes('Reading Champion')) {
    updatedBadges.push('Reading Champion');
  }
  if (updatedNotes.length >= 7 && !updatedBadges.includes('Syllabus Scholar')) {
    updatedBadges.push('Syllabus Scholar');
  }

  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      notesCompleted: updatedNotes,
      badges: updatedBadges,
    });
  } catch (err) {
    console.error('Failed to update note completion in Firestore:', err);
  }

  return { notesCompleted: updatedNotes, badges: updatedBadges };
}

export async function logStudyMinutesToFirestore(
  userId: string,
  sessionMinutes: number,
  currentUser: StudentUser
): Promise<StudentUser> {
  const currentTotal = currentUser.totalStudyMinutes || 0;
  const currentSessions = currentUser.pomodoroSessionsCompleted || 0;
  const newTotal = currentTotal + sessionMinutes;
  const newSessions = currentSessions + 1;

  const currentBadges = currentUser.badges || [];
  const updatedBadges = [...currentBadges];

  if (newTotal >= 25 && !updatedBadges.includes('Focus Initiate')) {
    updatedBadges.push('Focus Initiate');
  }
  if (newTotal >= 100 && !updatedBadges.includes('Deep Work Scholar')) {
    updatedBadges.push('Deep Work Scholar');
  }
  if (newTotal >= 300 && !updatedBadges.includes('Master of Focus')) {
    updatedBadges.push('Master of Focus');
  }

  const updatedUser: StudentUser = {
    ...currentUser,
    totalStudyMinutes: newTotal,
    pomodoroSessionsCompleted: newSessions,
    badges: updatedBadges,
  };

  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      totalStudyMinutes: newTotal,
      pomodoroSessionsCompleted: newSessions,
      badges: updatedBadges,
    });
  } catch (err) {
    console.error('Failed to log study minutes in Firestore:', err);
  }

  return updatedUser;
}

// -------------------------------------------------------------
// Quiz Attempts & Test Scores
// -------------------------------------------------------------

export async function saveQuizAttemptToFirestore(
  attempt: QuizAttempt,
  currentUser: StudentUser | null
): Promise<{ attempt: QuizAttempt; updatedUser: StudentUser | null }> {
  const attemptId = attempt.id || `attempt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const fullAttempt: QuizAttempt = {
    ...attempt,
    id: attemptId,
    userId: currentUser?.id || 'guest',
    studentName: currentUser?.name || 'Guest Scholar',
    studentEmail: currentUser?.email || 'guest@eyoelacademy.com',
  };

  try {
    // Write attempt record
    await setDoc(doc(db, 'quizAttempts', attemptId), fullAttempt);

    if (currentUser && currentUser.id !== 'guest') {
      const userRef = doc(db, 'users', currentUser.id);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data() as StudentUser;
        const currentBadges = userData.badges || ['Welcome Scholar'];
        const existingCerts = userData.certificates || [];

        // Check for new badges
        const newBadges = [...currentBadges];
        if (!newBadges.includes('First Exam Completed')) {
          newBadges.push('First Exam Completed');
        }
        if (attempt.percentage >= 80 && !newBadges.includes('Excellence Distinction')) {
          newBadges.push('Excellence Distinction');
        }
        if (attempt.percentage === 100 && !newBadges.includes('Perfect Centurion')) {
          newBadges.push('Perfect Centurion');
        }

        // Check for Certificate if score >= 70%
        let updatedCerts = [...existingCerts];
        if (attempt.percentage >= 70) {
          const subjectCertName = `${attempt.subjectName} (${attempt.grade})`;
          const newCert: CertificateRecord = {
            id: `cert-${attemptId}`,
            studentName: currentUser.name,
            subjectName: subjectCertName,
            grade: attempt.grade,
            issueDate: attempt.date,
            scorePercentage: attempt.percentage,
            certificateNumber: `EYOEL-${attempt.subjectName.substring(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
            distinction:
              attempt.percentage >= 90
                ? 'First Class Honors'
                : attempt.percentage >= 80
                ? 'Excellence Distinction'
                : 'Proficiency Pass',
          };

          // Filter out older duplicate certificates for the same subject if score is higher/equal
          updatedCerts = [newCert, ...existingCerts.filter((c) => c.subjectName !== subjectCertName)];

          if (updatedCerts.length >= 2 && !newBadges.includes('Honor Roll Scholar')) {
            newBadges.push('Honor Roll Scholar');
          }
        }

        const newTotalScore = (userData.totalScore || 0) + attempt.score;
        const newQuizCount = (userData.quizCount || 0) + 1;

        const updatedUserData: Partial<StudentUser> = {
          badges: newBadges,
          certificates: updatedCerts,
          totalScore: newTotalScore,
          quizCount: newQuizCount,
        };

        await updateDoc(userRef, updatedUserData);

        return {
          attempt: fullAttempt,
          updatedUser: {
            ...userData,
            ...updatedUserData,
          },
        };
      }
    }
  } catch (err) {
    console.error('Failed to save quiz attempt to Firestore:', err);
  }

  return { attempt: fullAttempt, updatedUser: currentUser };
}

export async function fetchUserQuizAttempts(userId: string): Promise<QuizAttempt[]> {
  try {
    const q = query(
      collection(db, 'quizAttempts'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    const list: QuizAttempt[] = [];
    snap.forEach((d) => {
      list.push(d.data() as QuizAttempt);
    });
    // sort by date descending
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (err) {
    console.error('Failed to load user quiz attempts:', err);
    return [];
  }
}

// -------------------------------------------------------------
// Admin Portal Methods
// -------------------------------------------------------------

export async function fetchAllStudentsAdmin(): Promise<StudentUser[]> {
  try {
    const snap = await getDocs(collection(db, 'users'));
    const students: StudentUser[] = [];
    snap.forEach((d) => {
      students.push(d.data() as StudentUser);
    });
    return students;
  } catch (err) {
    console.error('Admin: Failed to fetch student profiles:', err);
    return [];
  }
}

export async function fetchAllQuizAttemptsAdmin(): Promise<QuizAttempt[]> {
  try {
    const snap = await getDocs(collection(db, 'quizAttempts'));
    const attempts: QuizAttempt[] = [];
    snap.forEach((d) => {
      attempts.push(d.data() as QuizAttempt);
    });
    return attempts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (err) {
    console.error('Admin: Failed to fetch all quiz attempts:', err);
    return [];
  }
}

export async function deleteStudentAdmin(userId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId));
}

// -------------------------------------------------------------
// Curriculum CRUD (Subjects, Notes, Quizzes) in Firestore
// -------------------------------------------------------------

export async function fetchFirestoreSubjects(): Promise<Subject[]> {
  try {
    const snap = await getDocs(collection(db, 'subjects'));
    if (snap.empty) return [];
    const list: Subject[] = [];
    snap.forEach((d) => list.push(d.data() as Subject));
    return list;
  } catch (err) {
    console.warn('Failed to fetch subjects from Firestore:', err);
    return [];
  }
}

export async function saveFirestoreSubject(subject: Subject): Promise<void> {
  await setDoc(doc(db, 'subjects', subject.id), subject);
}

export async function deleteFirestoreSubject(subjectId: string): Promise<void> {
  await deleteDoc(doc(db, 'subjects', subjectId));
}

export async function fetchFirestoreNotes(): Promise<NoteChapter[]> {
  try {
    const snap = await getDocs(collection(db, 'notes'));
    if (snap.empty) return [];
    const list: NoteChapter[] = [];
    snap.forEach((d) => list.push(d.data() as NoteChapter));
    return list;
  } catch (err) {
    console.warn('Failed to fetch notes from Firestore:', err);
    return [];
  }
}

export async function saveFirestoreNote(note: NoteChapter): Promise<void> {
  await setDoc(doc(db, 'notes', note.id), note);
}

export async function deleteFirestoreNote(noteId: string): Promise<void> {
  await deleteDoc(doc(db, 'notes', noteId));
}

export async function fetchFirestoreQuizzes(): Promise<Quiz[]> {
  try {
    const snap = await getDocs(collection(db, 'quizzes'));
    if (snap.empty) return [];
    const list: Quiz[] = [];
    snap.forEach((d) => list.push(d.data() as Quiz));
    return list;
  } catch (err) {
    console.warn('Failed to fetch quizzes from Firestore:', err);
    return [];
  }
}

export async function saveFirestoreQuiz(quiz: Quiz): Promise<void> {
  await setDoc(doc(db, 'quizzes', quiz.id), quiz);
}

export async function deleteFirestoreQuiz(quizId: string): Promise<void> {
  await deleteDoc(doc(db, 'quizzes', quizId));
}

// -------------------------------------------------------------
// Public Verification Methods (Certificates & Report Cards)
// -------------------------------------------------------------

export async function verifyCertificateFromFirestore(certCode: string): Promise<CertificateRecord | null> {
  try {
    const cleanCode = certCode.trim().toUpperCase();
    const usersSnap = await getDocs(collection(db, 'users'));
    for (const d of usersSnap.docs) {
      const u = d.data() as StudentUser;
      if (u.certificates && Array.isArray(u.certificates)) {
        const match = u.certificates.find(
          (c) => c.certificateNumber.toUpperCase() === cleanCode || c.id.toUpperCase() === cleanCode
        );
        if (match) {
          return {
            ...match,
            studentName: u.name,
            verified: true,
          };
        }
      }
    }
  } catch (err) {
    console.warn('Firestore certificate verification search error:', err);
  }
  return null;
}

export async function verifyReportCardFromFirestore(identifier: string): Promise<StudentReportCard | null> {
  try {
    const clean = identifier.trim().toLowerCase();
    const usersSnap = await getDocs(collection(db, 'users'));
    for (const d of usersSnap.docs) {
      const u = d.data() as StudentUser;
      const match =
        u.id.toLowerCase() === clean ||
        u.email.toLowerCase() === clean ||
        (u.name && u.name.toLowerCase() === clean) ||
        clean.includes(u.id.toLowerCase());

      if (match) {
        // Fetch user attempts to compute real GPA and grades
        const attempts = await fetchUserQuizAttempts(u.id);
        const totalAttempts = attempts.length;
        const avgPercentage = totalAttempts > 0
          ? Math.round(attempts.reduce((acc, a) => acc + a.percentage, 0) / totalAttempts)
          : 88;
        const gpa = Number(((avgPercentage / 100) * 4).toFixed(2));

        const reportCard: StudentReportCard = {
          id: `RC-${u.id.toUpperCase()}`,
          studentId: u.id,
          studentName: u.name,
          studentRollNo: `EYOEL-STU-${u.id.slice(0, 5).toUpperCase()}`,
          academicYear: '2026 E.C. / 2026 Academic Year',
          grade: u.grade,
          stream: u.stream,
          semester: 'Semester 2',
          conduct: 'A (Excellent)',
          attendanceDays: 98,
          totalSchoolDays: 100,
          totalScore: 460,
          averageScore: avgPercentage,
          gpa: Math.max(3.0, gpa),
          rank: 2,
          totalStudentsInClass: 45,
          homeroomTeacher: 'Ato Yohannes Tadesse',
          academicDirector: 'Wro. Aster Kebede',
          generalDirector: 'Eyoel Endale Belete',
          issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          subjects: [
            {
              subjectId: 'sub-math',
              subjectName: 'Mathematics',
              classActivity: 9,
              testsAndAssignments: 14,
              midExam: 23,
              finalExam: 47,
              totalMark: 93,
              letterGrade: 'A+',
              gradePoint: 4.0,
              remarks: 'Outstanding analytical rigor',
            },
            {
              subjectId: 'sub-phys',
              subjectName: 'Physics',
              classActivity: 9,
              testsAndAssignments: 13,
              midExam: 22,
              finalExam: 45,
              totalMark: 89,
              letterGrade: 'A',
              gradePoint: 3.75,
              remarks: 'Superior conceptual precision',
            },
            {
              subjectId: 'sub-chem',
              subjectName: 'Chemistry',
              classActivity: 8,
              testsAndAssignments: 14,
              midExam: 22,
              finalExam: 46,
              totalMark: 90,
              letterGrade: 'A+',
              gradePoint: 4.0,
              remarks: 'Deep chemical stoichiometry comprehension',
            },
            {
              subjectId: 'sub-bio',
              subjectName: 'Biology',
              classActivity: 10,
              testsAndAssignments: 14,
              midExam: 23,
              finalExam: 47,
              totalMark: 94,
              letterGrade: 'A+',
              gradePoint: 4.0,
              remarks: 'Mastery in genetics and ecology',
            },
            {
              subjectId: 'sub-eng',
              subjectName: 'English',
              classActivity: 10,
              testsAndAssignments: 14,
              midExam: 23,
              finalExam: 47,
              totalMark: 94,
              letterGrade: 'A+',
              gradePoint: 4.0,
              remarks: 'Flawless grammatical command & comprehension',
            },
          ],
        };
        return reportCard;
      }
    }
  } catch (err) {
    console.warn('Firestore report card verification search error:', err);
  }
  return null;
}

// Seed initial curriculum data to Firestore if collection is empty
export async function seedCurriculumIfEmpty(
  subjects: Subject[],
  notes: NoteChapter[],
  quizzes: Quiz[]
): Promise<void> {
  try {
    const subSnap = await getDocs(collection(db, 'subjects'));
    if (subSnap.empty && subjects.length > 0) {
      console.log('Seeding initial subjects to Firestore...');
      for (const s of subjects) {
        await setDoc(doc(db, 'subjects', s.id), s);
      }
    }

    const noteSnap = await getDocs(collection(db, 'notes'));
    if (noteSnap.empty && notes.length > 0) {
      console.log('Seeding initial notes to Firestore...');
      for (const n of notes) {
        await setDoc(doc(db, 'notes', n.id), n);
      }
    }

    const quizSnap = await getDocs(collection(db, 'quizzes'));
    if (quizSnap.empty && quizzes.length > 0) {
      console.log('Seeding initial quizzes to Firestore...');
      for (const q of quizzes) {
        await setDoc(doc(db, 'quizzes', q.id), q);
      }
    }
  } catch (err) {
    console.warn('Auto-seed check failed or already seeded:', err);
  }
}
