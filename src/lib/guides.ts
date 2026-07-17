export interface Guide {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readTime: string;
  content: string;
}

export const GUIDES: Record<string, Guide> = {
  "how-to-study": {
    slug: "how-to-study",
    title: "How to Study Effectively with Active Recall",
    description: "Learn the cognitive science behind active recall and why testing yourself beats highlighting every single time.",
    publishedAt: "2026-07-10",
    readTime: "5 min read",
    content: `
## Why Highlighting Fails

Most students study by re-reading textbooks, highlighting paragraphs, and looking over lecture slides. Cognitive science research consistently demonstrates that this is a form of passive study. It creates an **illusion of competence**: because the information looks familiar as you read it, you believe you have committed it to memory.

When you sit down to take the actual exam, you are asked to retrieve information from scratch. Highlighting does not practice retrieval; it only practices recognition.

## Active Recall: The Retrieval Principle

Active recall is the process of testing your brain by forcing it to retrieve information without looking at the answer. When you retrieve a fact, you strengthen the neural pathways associated with that memory. It signals to your brain that the information is important and needs to be retained.

### How to Implement Active Recall
1. **Turn Headlines into Questions**: When reading a textbook chapter, turn the sub-headings into questions. For example, change "The Krebs Cycle" to "What are the primary products of the Krebs Cycle?"
2. **Flashcards**: Build flashcards with a single, clear question on the front and the answer on the back.
3. **Practice Testing**: Use tools like QuizFlow to generate quiz questions from your notes and attempt them under timed conditions.

### The Desirable Difficulty Constraint
Active recall feels harder than re-reading. This is normal. The mental effort required to retrieve a memory is exactly what reinforces the retention. If studying feels easy, you are likely doing it passively.
    `,
  },
  "spaced-repetition": {
    slug: "spaced-repetition",
    title: "Spaced Repetition System (SRS) for Exam Prep",
    description: "An in-depth look at the forgetting curve and how to schedule your reviews at the optimal moment of near-forgetting.",
    publishedAt: "2026-07-11",
    readTime: "6 min read",
    content: `
## The Forgetting Curve

First discovered by psychologist Hermann Ebbinghaus, the forgetting curve shows that we forget new information exponentially fast after learning it. Within days, we lose the majority of what was introduced, unless we review it.

Spaced repetition solves this by spacing out your reviews over increasing intervals:

* Day 1: Learn
* Day 2: First review
* Day 6: Second review
* Day 15: Third review
* Day 35: Fourth review

Each review resets the forgetting curve, making the slope shallower each time.

## Spaced Repetition in QuizFlow

QuizFlow integrates a local Spaced Repetition System (SRS) for flashcards based on self-grading:

1. **Again**: Retest within a few minutes (resets review history).
2. **Hard**: Reviews soon (slight increase in interval).
3. **Good**: Optimal interval increase.
4. **Easy**: Long interval increase (perfectly memorized).

By checking the **due counts** on your flashcards daily, you study only the cards that are at risk of being forgotten. This saves time and ensures you don't over-study cards you already know.
    `,
  },
  "text-extraction": {
    slug: "text-extraction",
    title: "How to Extract Text from Complex PDFs Locally",
    description: "Understand how browser-side PDF text extraction works, its security benefits, and how to deal with layout issues.",
    publishedAt: "2026-07-12",
    readTime: "4 min read",
    content: `
## Client-Side PDF Extraction

QuizFlow uses a self-hosted implementation of \`pdfjs-dist\` to extract text directly within the user's browser. This is done local-first. Your files are not uploaded to an external server to extract text, protecting your privacy and security.

### How it Works
When you upload a PDF file:
1. The file is read into memory as a binary array.
2. The browser-based PDF parser opens the document page-by-page.
3. Text coordinates and characters are extracted, normalized, and concatenated.

### Common Layout Issues & Workarounds
* **Multi-column Layouts**: Academic papers often use two-column layouts. The local parser reads left-to-right, which can occasionally combine sentences from different columns. For complex column structures, use the **Page Range** setting to verify text output, or manually copy and paste the text to ensure correct order.
* **Scanned Images**: Image-only files (scanned worksheets) will not yield any text. These require OCR (Optical Character Recognition), which is outside the local scope of QuizFlow. Ensure your PDF has selectable text.
    `,
  },
  "question-types": {
    slug: "question-types",
    title: "Cloze Deletion vs. Multiple Choice Quizzes",
    description: "Compare different question structures and learn when to use MCQs versus fill-in-the-blank statements for learning.",
    publishedAt: "2026-07-13",
    readTime: "5 min read",
    content: `
## Recognition vs. Recall

Different question formats test different levels of cognitive depth.

### Multiple Choice Questions (MCQ)
MCQs present one correct option and several distractors. They primarily test **recognition**. MCQs are highly effective for:
* Differentiating between similar concepts.
* Simulating official certification exam environments.
* Broad topic checks.

### Cloze Deletion (Fill in the Blank)
Cloze deletions hide a keyword inside a statement and ask you to type the answer. This tests **active recall** (free retrieval). Cloze deletions are best for:
* Memorizing key terms, dates, and names.
* Strengthening precise vocabulary.
* Avoiding the "distractor bias" (where seeing incorrect options confuses you).

### Recommendation
Use MCQs early in your study phase to get comfortable with the material, then switch to Cloze Deletion/Short Answer formats as you approach your exam date to ensure you can retrieve the answers without assistance.
    `,
  },
  "classroom-handouts": {
    slug: "classroom-handouts",
    title: "Creating Classroom Handouts from Lecture Notes",
    description: "A tutorial for teachers on generating, editing, and exporting high-quality classroom handouts.",
    publishedAt: "2026-07-14",
    readTime: "5 min read",
    content: `
## Structuring Class Materials

Tutors and teachers need a steady stream of review materials for homework and handouts. Generating these manually takes hours. QuizFlow lets you convert lesson content into handouts in minutes.

### Step-by-Step Guide
1. **Prepare Source Text**: Gather your lesson slides or notes.
2. **Scaffold the Quiz**: Set the generator to produce 10-15 MCQ and short answer questions.
3. **Verify Explanations**: Ensure every question has a clear, educational explanation. If the generated explanation is brief, rewrite it in the editor.
4. **Print Formatting**: Export the quiz using the **Printable HTML** format. The export uses custom print CSS stylesheet targets to remove nav bars and buttons, leaving a clean, ready-to-copy exam sheet.
    `,
  },
  "certifications": {
    slug: "certifications",
    title: "Preparing for Professional Certifications",
    description: "A systematic approach to studying for professional exams using QuizFlow's workspace.",
    publishedAt: "2026-07-15",
    readTime: "5 min read",
    content: `
## The Certification Challenge

Certification exams (like AWS Solutions Architect, ITIL, Project Management Professional, etc.) are highly structured and require specific terminology matching. High pass marks require systematic preparation.

### The QuizFlow Cert Prep Framework
* **Isolate Domains**: Most exams are divided into specific content domains. Study one domain at a time by uploading its specific PDF manual section.
* **Create Domain Decks**: Generate individual flashcard decks for each domain. Do not mix domains until you are comfortable with each.
* **Practice Timing**: Certification exams are timed. Toggle **Timed Mode** on your practice quizzes to get used to the pace of 1-2 minutes per question.
    `,
  },
  "self-grading": {
    slug: "self-grading",
    title: "Self-Grading Principles for Flashcards",
    description: "How to grade your flashcard retrieval honestly to optimize your spaced repetition schedule.",
    publishedAt: "2026-07-16",
    readTime: "4 min read",
    content: `
## The Honesty Principle in Spaced Repetition

Spaced repetition depends entirely on your self-grading accuracy. If you grade your retrieval too easily, the card is scheduled too far into the future, and you will forget it before it comes up again.

### How to Self-Grade Correctly
* **Again (Failed)**: You did not recall the term, or you only recalled a small, non-essential part of it. Always press Again if you were completely off.
* **Hard**: You recalled the correct answer, but it required significant mental effort, taking more than 10-15 seconds of thinking.
* **Good**: You recalled the correct answer within 3-5 seconds with moderate effort. This should be your most common rating.
* **Easy**: You recalled the answer immediately, with zero hesitation.
    `,
  },
  "weak-topic-analysis": {
    slug: "weak-topic-analysis",
    title: "Weak-Topic Analysis Explained",
    description: "Learn how QuizFlow analyzes incorrect answer patterns to construct personalized study recommendations.",
    publishedAt: "2026-07-17",
    readTime: "5 min read",
    content: `
## What is Weak-Topic Analysis?

Taking quizzes and seeing a score (e.g. 70%) is helpful, but it doesn't automatically guide your next step. You need to know *what* you missed, *why* you missed it, and *how* to fix it.

Weak-Topic Analysis reviews the details of incorrect questions:

1. **Failure Grouping**: Aggregates missed questions into conceptual buckets (e.g., matching all missed questions relating to "caching" or "subnetting").
2. **Strength Evaluation**: Evaluates whether your performance in that area indicates a minor misunderstanding (Medium) or a fundamental gap (Weak).
3. **Actionable Tasks**: Outlines targeted study tasks (e.g., "Re-read chapter 4, section 2, and review flashcard deck on VPCs").

By focusing your reviews on these specific tasks, you study more efficiently and address gaps before exam day.
    `,
  },
};
