export interface UseCase {
  slug: string;
  title: string;
  description: string;
  audience: string;
  content: string;
}

export const USE_CASES: Record<string, UseCase> = {
  "exam-prep": {
    slug: "exam-prep",
    title: "Exam Preparation for Students",
    description: "How to parse syllabus files, lecture notes, and textbook chapters into custom test runs for maximum recall.",
    audience: "High school, university, and post-grad students.",
    content: `
## The Strategy: Active Recall on Lecture Slides

Preparing for university exams often means reviewing hundreds of lecture slides. Reading them over and over (passive review) is one of the least effective study methods. Instead, you can parse your slides and notes directly into active recall quizzes.

### Step-by-Step Execution
1. Export Slides: Save your lecture slides as a text-searchable PDF.
2. Select Range: Upload the PDF to QuizFlow, and select the page range corresponding to the specific lecture or topic you are struggling with.
3. Generate MCQ & Fill-in-the-Blank: MCQs are great for identifying factual gaps, while fill-in-the-blanks test your active retrieval of key terminology.
4. Iterate on Mistakes: After completing a quiz, use the Retake Incorrect Only feature. Focus your energy on the concepts you failed to retrieve correctly.

### Limitations & Gotchas
* Slide Formats: If your slides consist entirely of images or scanned handwriting, browser-side text extraction won't be able to extract text. You will need to paste typed transcripts in the text field instead.
* Complex Diagrams: Text extraction ignores diagrams. Always keep your slide deck open in a side window to cross-reference images.
    `,
  },
  "teaching-handouts": {
    slug: "teaching-handouts",
    title: "Creating Classroom Handouts & Practice Material",
    description: "Generate structured quiz sets from curriculum notes to create printouts or digital study guides.",
    audience: "Teachers, tutors, and course creators.",
    content: `
## The Strategy: Rapid Handout Scaffold

Educators need practice problems that align exactly with what was taught in class. By importing curriculum materials, you can instantly bootstrap a set of quiz questions, refine them in the editor, and export them as printable HTML or markdown.

### Step-by-Step Execution
1. Paste Topic Notes: Paste your lesson plans, summary guides, or source texts directly into the text workspace.
2. Configure Count: Generate a 15-20 question quiz in Quick or AI mode.
3. Refine and Edit: Use the Question Editor to reorder questions, fix explanations, or regenerate single questions that do not meet your standard.
4. Export to Print: Click Export and choose Printable HTML. Use your browser's print-to-PDF feature to generate a clean, styled PDF handout for your class.

### Limitations & Gotchas
* Format Alignments: Re-importing questions from other formats (like proprietary LMS formats) is not supported. Use Markdown or JSON exports for backing up your work.
    `,
  },
  "certification-study": {
    slug: "certification-study",
    title: "Studying for Professional Certifications",
    description: "Systematically study thick, chapter-heavy certification guides for AWS, ITIL, CFA, or PMBOK.",
    audience: "Working professionals and certification candidates.",
    content: `
## The Strategy: Chapter-by-Chapter Integration

Professional certifications require memorizing large volumes of domain-specific terminology and frameworks. Rather than reading the study guide cover-to-cover, break it down chapter-by-chapter and test yourself daily.

### Step-by-Step Execution
1. Isolate Chapters: Target a single chapter PDF file or copy a sub-section of text.
2. Build Flashcard Decks: Generate 20-30 flashcard decks using key concepts.
3. Spaced Repetition System (SRS): Study the cards using the self-grading system (Again / Hard / Good / Easy). The SRS queue will automatically schedule weaker cards for more frequent review.
4. Weak-Topic Auditing: Take the corresponding quizzes, and run the Weak-Topic Analysis on your results to discover which sub-sections need re-reading.

### Limitations & Gotchas
* Context Size Limits: Extremely long chapters (above 40,000 characters) should be split into smaller sections to ensure the AI generation does not truncate or lose resolution.
    `,
  },
  "onboarding-training": {
    slug: "onboarding-training",
    title: "Employee Onboarding & Policy Knowledge Checks",
    description: "Ensure new team members read and comprehend company policies, manuals, or technical manuals.",
    audience: "HR managers, team leads, and onboarding coordinators.",
    content: `
## The Strategy: Frictionless Policy Verification

When onboarding new hires, you need to verify that they understand employee handbooks, security manuals, and software guides. Instead of complex learning management systems (LMS), build quick, browser-based policy checks.

### Step-by-Step Execution
1. Input Handbook Text: Upload the PDF of your company policy, code of conduct, or technical setup guide.
2. Generate True/False & MCQs: Generate a 10-question check focused on compliance rules.
3. Save Quiz Locally: Save the quiz to the local workspace library, or generate a Share-by-URL Link.
4. Share with New Hire: Send the generated link directly to the new employee. They can run through the check-in quiz directly in their browser without registering an account.

### Limitations & Gotchas
* Security & Privacy: QuizFlow runs client-side, meaning user results are stored in the user's IndexedDB. For compliance audits, the employee will need to export their results or print to PDF to share their score.
    `,
  },
  "language-vocab": {
    slug: "language-vocab",
    title: "Vocabulary & Terminology Acquisition",
    description: "Translate terminology sheets and build vocabulary decks to accelerate language learning.",
    audience: "Language students and vocabulary builders.",
    content: `
## The Strategy: Bilingual Term Cards

Acquiring vocabulary requires repeated retrieval. By pasting bilingual text lists, you can generate active recall flashcards to practice translations.

### Step-by-Step Execution
1. Paste Word Lists: Paste vocabulary lists, word pairs, or translated dialogues into the editor.
2. Generate Flashcards: Select vocabulary counts and build a flashcard deck.
3. Practice SRS: Grade your memory retrieval. Pay close attention to terms marked "Hard" or "Again."
4. Print Sheets: Export the terms to Markdown or CSV to review them on other devices or print physical pocket sheets.

### Limitations & Gotchas
* Accent Support: Make sure your source files use UTF-8 encoding so accents and special characters are extracted correctly without corruption.
    `,
  },
};
