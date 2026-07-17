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
    description:
      "Why testing yourself beats re-reading, and a concrete workflow for turning a QuizFlow quiz into real retention.",
    publishedAt: "2026-07-10",
    readTime: "7 min read",
    content: `
## Why re-reading feels productive but usually is not

Most people study by re-reading a chapter, highlighting the parts that seem important, and looking over slides one more time the night before. It feels like work, and it feels like it is landing. That feeling is the problem. When you re-read, the words on the page look familiar, and your brain reads familiarity as knowledge. Researchers call this the illusion of competence. You recognise the material, so you assume you can produce it. On exam day nobody hands you the chapter with the key sentences already highlighted. You have to pull the answer out of an empty page, and recognition does not train that skill.

## What active recall actually is

Active recall is the plain act of trying to answer a question before you look at the source. You force your brain to retrieve the fact, and the effort of retrieval is what strengthens the memory. Every time you successfully pull something back, you make it easier to pull back next time. Every time you fail and then check, you find out exactly what you did not know, which is information you cannot get from re-reading.

The catch is that active recall feels harder than re-reading, because it is harder. That difficulty is not a sign you are doing it wrong. It is the point. If your study session feels smooth and easy, you are probably back in passive mode.

## Turning your notes into recall practice with QuizFlow

QuizFlow is built to remove the friction that usually stops people from testing themselves: writing the questions. Here is a workflow that works for most subjects.

1. Gather the material. Paste your lecture notes straight into the text box, or upload a text-based PDF. If it is a long document, use the page-range field to target one lecture or one section instead of the whole file.
2. Generate a first set. Quick mode runs entirely in your browser and needs no key, so start there. It produces fill-in-the-blank and short-answer questions from the key sentences in your text. If you want reworded multiple choice with distractors, switch to AI mode.
3. Read every question once in the editor. This is the step people skip, and it is the most valuable one. Fix any question that is vague, correct a wrong answer, and rewrite an explanation so it teaches rather than just states the answer. Editing the questions is itself a round of active study.
4. Play the quiz honestly. Answer before you check. Resist the urge to peek. Use the keyboard: 1 to 4 to choose, Enter to confirm.
5. Retake only what you missed. After scoring, use "retake incorrect only" so your second pass is spent entirely on the gaps.

## Space the sessions out

One long cramming session is far weaker than the same total time split across several days. After you build a quiz, save it. Come back tomorrow and take it again from your history. The questions you got wrong yesterday are the ones to watch. QuizFlow keeps your results locally, so your accuracy over time is visible on the dashboard without you tracking anything by hand.

## Turn headings into questions yourself

The tool writes questions for you, but the habit of writing your own is worth building. When you read a textbook, convert each sub-heading into a question. "The causes of the 1929 crash" becomes "What were the four main causes of the 1929 crash?" Then answer out loud before reading on. Pair this manual habit with generated quizzes and you cover both recognition and free recall.

## Where active recall has limits

Active recall is excellent for facts, definitions, relationships, and procedures you can state. It is weaker on its own for skills that need physical practice or open-ended problem solving, like proofs or essays. For those, use recall to lock down the building blocks, then spend separate time doing full practice problems. QuizFlow generates questions from the text you give it, so it cannot test a diagram you never wrote down. Keep a slide deck or textbook open beside you for anything visual, and paste in transcripts for anything that started as audio.

## A simple weekly rhythm

Build a quiz when you first learn a topic. Retake it the next day, then two days later, then at the end of the week. Each pass takes only a few minutes because you are reusing the same saved quiz and focusing on your misses. By the end of the week the material has moved from "looks familiar" to "I can produce this on demand," which is the only version that survives an exam.
    `,
  },
  "spaced-repetition": {
    slug: "spaced-repetition",
    title: "Spaced Repetition for Exam Prep",
    description:
      "The forgetting curve, why timing your reviews matters, and how QuizFlow's flashcard grading schedules the next review for you.",
    publishedAt: "2026-07-11",
    readTime: "7 min read",
    content: `
## The forgetting curve

In the 1880s the psychologist Hermann Ebbinghaus ran a long, tedious experiment on himself: he memorised lists of nonsense syllables and tracked how fast he forgot them. The result is the forgetting curve. Newly learned information drops away quickly at first, then more slowly. Within a day or two you have lost a large share of what you learned, unless something interrupts the decline.

The interruption is review. Each time you successfully recall something, the curve resets and, importantly, gets flatter. The second time you review, you forget more slowly than the first. By the fourth or fifth well-timed review, the material can stay put for months. This is the whole idea behind spaced repetition: instead of reviewing everything every day, you review each item right around the moment you are about to forget it.

## Why the timing matters

Reviewing too early wastes effort. If you just learned something an hour ago, testing it again tells you almost nothing, because it is still fresh. Reviewing too late means you have already forgotten it and have to relearn from scratch, which is slow. The sweet spot is the moment of near-forgetting, when recall is effortful but still possible. Hitting that moment repeatedly is what makes spaced repetition so time-efficient. You spend your minutes only on the cards that are actually at risk.

## How QuizFlow schedules reviews

QuizFlow builds flashcard decks from your source text and runs a local spaced-repetition queue based on how you grade yourself. After you flip a card and check the answer, you rate your recall with one of four buttons:

* Again: you did not recall it, or you only got a fragment. The card comes back almost immediately and its interval resets.
* Hard: you got it, but it took real effort and several seconds. The next interval grows only a little.
* Good: you recalled it with moderate effort. This is the standard rating and produces a healthy interval increase.
* Easy: it came back instantly with no hesitation. The interval jumps further out, because you clearly do not need to see this card often.

The deck tracks each card's interval, ease, and due date on your device. When you open a deck, it shows how many cards are actually due, so a daily session is short: you review the cards that need it and skip the ones that are still solid.

## A realistic daily routine

1. Build decks as you learn, not all at once. When you finish a chapter, generate a deck from it and study it the same day.
2. Come back the next day and clear whatever is due. Early on this will be most of the deck, because the intervals are short. That is expected.
3. Keep the daily habit. As cards earn longer intervals, your daily due count shrinks even as your total deck grows. This is the payoff: a hundred cards might surface only ten reviews on a given day.
4. Do not binge. If you skip several days, the due pile grows and the schedule loses its precision. Ten minutes every day beats an hour once a week.

## Grade honestly or the system breaks

Spaced repetition only works if your grades are honest, because your grades are the input that sets the schedule. If you press Good on a card you barely limped through, the system pushes it far into the future and you will have forgotten it by the time it returns. When in doubt, grade down. There is a separate guide on self-grading that goes deeper on where to draw the lines.

## What spaced repetition is good and bad at

It is unbeatable for high-volume factual recall: vocabulary, definitions, dates, formulas, drug names, legal terms, anatomy. It is weaker for material that needs to be understood as a whole rather than memorised in pieces. A card can teach you that a term exists and what it means; it cannot teach you to reason across five concepts at once. Use decks for the raw recall layer, and use full quizzes and practice problems for the reasoning layer.

Because QuizFlow stores everything locally, your schedule lives in your browser. That keeps your material private, but it also means clearing your browser data will reset your decks. Export a backup from Settings before you clear anything, and if you study across two devices, move a backup between them rather than expecting them to sync on their own.
    `,
  },
  "text-extraction": {
    slug: "text-extraction",
    title: "How to Extract Text from Complex PDFs Locally",
    description:
      "How QuizFlow reads PDFs in your browser, why that protects your privacy, and how to handle columns, tables, and scanned pages.",
    publishedAt: "2026-07-12",
    readTime: "7 min read",
    content: `
## Reading happens in your browser

When you upload a PDF to QuizFlow, the file never leaves your machine to be read. QuizFlow uses a self-hosted build of the pdf.js library to open the document and pull out its text directly in the browser tab. There is no upload step and no server round trip for extraction. This matters for two reasons. First, privacy: your lecture notes, exam papers, and work documents stay on your device. Second, speed: for most files you get the text back in a second or two without waiting on a network.

## What actually happens under the hood

1. The browser reads the file you chose into memory as raw bytes.
2. The PDF parser opens the document and works through it one page at a time.
3. For each page, it collects the text runs and their positions, normalises the characters, and joins them into readable text.
4. QuizFlow reports a character count for every page so you can see at a glance which pages have real text and which are empty.

That per-page character count is more useful than it sounds. A page that reports twenty characters when it should have five hundred is usually an image, a scan, or a page that is mostly a diagram. Spotting that before you generate saves you from a quiz built on nothing.

## Selecting the right pages

Long PDFs are rarely something you want to quiz in one go. A three-hundred-page certification manual is not one study session. After QuizFlow reads a file, use the page-range field to pick exactly what you want: a single lecture, one chapter, or a scattered set like 1-3, 5, 8-10. QuizFlow shows how many pages and characters your selection covers, so you can keep each quiz focused on one topic. Targeting a range also keeps the generated questions coherent, because the source stays on a single subject instead of jumping across the whole book.

## Dealing with multi-column layouts

Academic papers and many textbooks use two-column layouts. Text extraction reads by position, and in a tight two-column design it can occasionally stitch a line from the left column onto a line from the right. If the extracted text looks scrambled, you have two good options. Narrow the page range so you can eyeball the output for the section you care about, or copy the text yourself from your PDF reader and paste it into the text tab, where column order is already correct. Pasting is always the most reliable path for awkward layouts, and it is a first-class input in QuizFlow, not a fallback.

## Tables, equations, and figures

Extraction pulls characters, not layout. A table usually comes through as a run of numbers and headers with the grid structure gone. Equations set as images do not come through at all, and neither do figures. This is not a QuizFlow limitation so much as a fact about how text lives inside a PDF. For material that is heavy on tables or math, the practical move is to paste a cleaned-up text version of the parts you want to be tested on, or to write a few sentences summarising the table and quiz those.

## Scanned and image-only PDFs

If your PDF is a scan of a printed page or a photo of handwriting, there is no text inside the file to extract. It is a picture. QuizFlow detects this case: when a document yields almost no characters, it stops and tells you the file looks scanned or image-only rather than silently producing an empty quiz. Optical character recognition, which converts an image of text into real text, is deliberately out of scope for QuizFlow, because doing it well in the browser is heavy and unreliable. If you only have a scan, run it through a dedicated OCR tool first, then paste the recognised text here.

## File size and safety

QuizFlow accepts PDFs up to twenty megabytes and validates the file type before doing anything. If a file is too large or is not really a PDF, you get a clear message instead of a stuck spinner. Because everything is processed in the browser, closing the tab discards the document from memory. Nothing is retained, and nothing is written to a server.

## A quick checklist for clean extraction

* Prefer text-based PDFs. If you can select text in your PDF reader, QuizFlow can read it.
* Check the per-page character counts before generating. Skip or exclude pages that read as empty.
* For two-column or heavily formatted pages, paste the text instead of relying on extraction.
* For scans and photos, run OCR elsewhere first, then paste.
* Keep each quiz to one topic by using page ranges, and you will get sharper questions.
    `,
  },
  "question-types": {
    slug: "question-types",
    title: "Cloze Deletion vs. Multiple Choice",
    description:
      "The difference between recognition and recall, and how to mix QuizFlow's four question types across a study cycle.",
    publishedAt: "2026-07-13",
    readTime: "7 min read",
    content: `
## Different formats train different skills

QuizFlow can produce four kinds of questions: multiple choice, true/false, short answer, and fill-in-the-blank, also called cloze deletion. They are not interchangeable. Each one exercises a different mental move, and knowing which is which lets you match the format to where you are in your study cycle.

The core split is recognition versus recall. Recognition is picking the right answer out of options you can see. Recall is producing the answer from nothing. Recognition is easier and gives a comforting score early on. Recall is harder and is much closer to what most exams and real situations demand.

## Multiple choice: recognition with useful friction

A multiple choice question shows one correct option and several plausible wrong ones, called distractors. Because the answer is on the screen, MCQs mostly test recognition. That makes them good for a few specific jobs:

* Early learning, when you are still getting familiar with the material and a blank page would just be discouraging.
* Telling apart concepts that are easy to confuse, since well-written distractors force you to notice the difference.
* Simulating certification exams, most of which are multiple choice, so practising in the same format reduces surprises on test day.

The quality of an MCQ lives entirely in its distractors. If the wrong options are obviously silly, you can guess your way to a good score without knowing anything. In QuizFlow, AI mode tends to write more convincing distractors because it can reword and invent plausible alternatives. When you edit a generated MCQ, the highest-value change you can make is replacing a weak distractor with a tempting one.

## True/false: fast but shallow

True/false questions are quick to answer and quick to write, which makes them handy for a rapid pass over a lot of material, or for a compliance-style check where you mainly want to confirm someone read the document. The weakness is obvious: a coin flip gives fifty percent. Use them to warm up or to cover breadth, not as your main measure of mastery. A good habit is to make the false statements subtly false, changing one word or number, so the question tests real attention rather than gut feeling.

## Short answer: recall without scaffolding

Short answer questions ask you to produce a response in your own words. There are no options to lean on, so this is genuine recall. QuizFlow checks your answer against acceptable answers using normalised matching, which forgives capitalisation and spacing but is not an essay grader. That means short answer works best for specific terms, names, numbers, and short phrases rather than long explanations. If you are studying definitions or key terminology, short answer is the honest test.

## Cloze deletion: precise recall in context

Cloze deletion hides a keyword inside a full sentence and asks you to supply it. "The powerhouse of the cell is the ______." This format is excellent because it keeps the surrounding context, which helps you learn the term where it actually lives, while still forcing you to retrieve the exact word. Cloze questions avoid a subtle downside of multiple choice: seeing wrong options can plant them in your memory, a effect sometimes called the negative suggestion effect. With cloze, you never see a wrong answer, so there is nothing misleading to absorb.

Quick mode in QuizFlow leans heavily on cloze and short answer, because reliable keyword heuristics are good at finding the important word in a sentence and blanking it out. That is why Quick mode can run entirely offline and still produce useful recall practice with no AI at all.

## A cycle that uses all four

The formats are strongest when you sequence them across your preparation rather than picking just one.

1. Start with multiple choice and true/false while the material is new. Get comfortable, build a base, and let the options carry some of the load.
2. Move to cloze deletion in the middle phase. Keep the context, drop the safety net of visible options, and start practising real retrieval.
3. Finish with short answer as the exam approaches. If you can produce the term cold, with no context and no options, you know it.

You can mix types within a single quiz in the config step, then adjust individual questions in the editor. A practical default is a mostly-MCQ quiz early in the week, converting the ones you consistently get right into cloze or short answer later, so the format gets harder exactly as you get better.
    `,
  },
  "classroom-handouts": {
    slug: "classroom-handouts",
    title: "Creating Classroom Handouts from Lecture Notes",
    description:
      "A practical workflow for teachers: turn lesson notes into an edited, printable question set in a few minutes.",
    publishedAt: "2026-07-14",
    readTime: "7 min read",
    content: `
## The problem with making practice material by hand

Teachers and tutors need a steady supply of review questions: homework sheets, warm-ups, quick checks, revision packs. Writing them from scratch is slow, and the slow part is not the thinking, it is the typing and formatting. QuizFlow takes the material you already have and gives you a first draft of a question set in a minute or two, so your time goes into refining questions rather than manufacturing them.

## A start-to-finish workflow

1. Bring in your source. Paste your lesson notes, a summary sheet, or the text of your slides into the text tab. If your material is a PDF, upload it and use the page range to isolate the lesson you are working on.
2. Choose the shape of the set. In the config step, pick how many questions you want and which types. For a homework sheet, a mix of multiple choice and short answer usually works well. For a fast in-class check, true/false and cloze are quick to mark.
3. Generate. Quick mode is free, offline, and deterministic, which means the same notes produce the same questions each time, useful if you want a repeatable sheet. AI mode produces more varied wording and stronger multiple choice distractors when you want them.
4. Edit like an editor, not an author. This is where your expertise matters. Read each question, tighten the wording, fix any answer the generator got wrong, and rewrite explanations so they teach. Reorder questions so the sheet builds from easy to hard using the up and down controls. Delete anything that does not fit.
5. Regenerate the weak ones. If a single question is off, use per-question regenerate to get a fresh replacement from the same source instead of rewriting it yourself. If the whole set misses the mark, regenerate the lot, though note that this replaces your edits, so do it before you start refining.

## Getting a clean printout

When the set is ready, open the export menu and choose the printable HTML option. It opens a clean page with the site navigation and buttons stripped out, using print-specific styling. From there, use your browser's print dialog and choose "Save as PDF" to get a tidy handout, or print directly. The result is a plain question sheet suitable for copying for a class. Explanations travel with the questions, so you can also produce an answer key version.

If you want the questions in another system, export to Markdown for pasting into a document or a wiki, or CSV for a spreadsheet or simple import elsewhere. JSON is the format to keep as a master copy, because it re-imports cleanly back into QuizFlow if you want to revise the set next term.

## Practical tips for better sheets

* Keep each sheet to one topic. Feed QuizFlow the notes for a single lesson rather than a whole unit, and the questions stay coherent and on-target.
* Write the explanation you wish the textbook had. A generated explanation is often a bare restatement of the answer. Replacing it with a sentence that explains why turns a quiz into a teaching tool.
* Use difficulty deliberately. Put a couple of easy questions first so students gain momentum, then raise the challenge. The editor's reordering makes this quick.
* Check the distractors on multiple choice. A question is only as good as its wrong answers. Swap out any option a student could dismiss on sight.

## Honest limits to plan around

QuizFlow reads the text you give it and nothing else. It will not see a diagram in your slides or a table that came through as scrambled text, so questions about visuals need to be written by you or based on a text description you paste in. There is no automatic grading of long written answers, so short answer questions are best kept to specific terms and facts. And there is no built-in class roster or gradebook: QuizFlow makes the material, and it stores your own work locally, but distributing a sheet and collecting responses happens through your normal channels, whether that is print, your learning platform, or a shared link.

## Reusing and sharing

Every quiz you build can be saved locally and reopened from your history, so a sheet you make this year is there to revise next year. You can also copy a share link that carries the quiz in the URL, which is handy for sending a quick self-check to a student without asking them to install or sign up for anything. Long quizzes make long links, so for large sets prefer sending an exported file. Because there are no accounts, a student who opens your link can take the quiz straight away in their browser, and their results stay on their own device.
    `,
  },
  certifications: {
    slug: "certifications",
    title: "Preparing for Professional Certifications",
    description:
      "A domain-by-domain system for studying thick certification guides using QuizFlow decks, timed quizzes, and weak-topic analysis.",
    publishedAt: "2026-07-15",
    readTime: "7 min read",
    content: `
## Certifications are a volume problem

Professional certification exams, whether cloud architecture, project management, networking, or finance, share a shape. They cover a large, well-defined body of knowledge, they lean on precise terminology, and they are usually timed multiple choice. Passing is less about brilliance and more about systematic coverage: making sure every domain has been studied, tested, and shored up before the exam. QuizFlow is well suited to this because it turns a heavy study guide into testable material and keeps a local record of how you are doing across topics.

## Work one domain at a time

Most certification blueprints divide the exam into weighted domains. Treat each domain as its own project rather than reading the guide cover to cover.

1. Isolate the domain. Upload the study guide PDF and use the page range to select only the chapter or section for the domain you are working on. Feeding QuizFlow a focused range keeps the generated questions on-topic and avoids blending unrelated concepts.
2. Build a deck for the raw recall. Generate a flashcard deck of the domain's key terms, services, and definitions. This is the layer you drill daily with spaced repetition so the vocabulary becomes automatic.
3. Build quizzes for the reasoning. Generate multiple choice quizzes that make you apply the concepts rather than just recognise a term. AI mode is worth using here for its stronger distractors, which better mimic the "two answers look right" feel of real certification questions.
4. Only move to the next domain once the current one is holding. Do not open five domains at once. Finish, verify, then advance.

## Practise under real conditions

Certification exams are timed, and time pressure changes how you perform. A question you would answer easily with unlimited time can trip you when the clock is running. QuizFlow has an optional timed mode you can turn on per quiz. As you get closer to the exam, switch it on and give yourself roughly the per-question pace of the real test, often around one to two minutes. Practising the pace is as important as practising the content, because it trains you to move on from a question you are unsure of instead of sinking five minutes into it.

## Let weak-topic analysis aim your revision

After you have taken several quizzes in a domain, run the weak-topic analysis on your results. It groups the questions you missed into themes and shows where your accuracy is lowest, so you can see, for example, that your networking questions are fine but your identity and access questions are shaky. Instead of re-reading the entire domain, you go back to the specific sub-section that is dragging you down. This is the fastest way to spend your last week of prep, because it puts your remaining hours exactly where they change your score.

## A weekly structure that scales

* Daily: clear your due flashcards across all domains you have started. This keeps vocabulary fresh with only a few minutes a day.
* Several times a week: take a fresh quiz in your current domain, then use retake-incorrect-only to hammer the misses.
* Weekly: run weak-topic analysis across your recent results and pick the one or two areas to target next.
* Final stretch: switch quizzes to timed mode and mix domains together, so you practise the context-switching a real exam demands.

## Manage the size of your material

Very long chapters can be too much for a single generation pass, and cramming forty thousand characters into one quiz tends to produce shallow questions that skim the surface. Split large sections into smaller ranges and generate several tighter quizzes instead of one sprawling one. Smaller inputs give sharper, more specific questions, which is what you want for exam prep.

## What QuizFlow will and will not do for you

It will convert your guide into decks and quizzes, track your accuracy over time on the dashboard, and point you at your weak areas, all stored privately on your device. It will not tell you the exact questions on your specific exam, and it cannot read content that only exists as a diagram or a scanned image. It also does not replace hands-on practice: for a cloud or engineering certification, you still need to build things in a console or lab. Use QuizFlow for the knowledge layer, and pair it with real practice for the skills that only come from doing. Remember to export a backup from Settings before clearing your browser, since your decks, quizzes, and progress live locally.
    `,
  },
  "self-grading": {
    slug: "self-grading",
    title: "Self-Grading Principles for Flashcards",
    description:
      "How to rate your recall honestly so QuizFlow's spaced-repetition schedule actually keeps material in your memory.",
    publishedAt: "2026-07-16",
    readTime: "6 min read",
    content: `
## Your grade is the input, not a reward

When you review a flashcard in QuizFlow, you flip it, check the answer, and then rate how the recall went with one of four buttons: Again, Hard, Good, or Easy. It is tempting to treat that rating as a little reward for yourself, pressing Good because you want to have done well. That is the one habit that breaks spaced repetition. Your grade is not a score. It is the instruction that tells the system when to show you the card again. Grade generously and the card disappears for weeks, long enough that you forget it. Grade honestly and it comes back at the right moment.

## What each button should mean

Consistency matters more than perfection, so decide what each rating means and apply it the same way every time.

* Again: you did not recall the answer, or you only produced a fragment of it. If you had to think "I have no idea" or you got the general area but missed the actual answer, press Again. The card resets and returns almost immediately. There is no shame in this button; it is doing its job.
* Hard: you got the correct answer, but it was a struggle. It took more than ten or fifteen seconds, or you had to reason your way to it rather than just knowing it. The next interval grows only slightly, so the card stays in frequent rotation until it becomes automatic.
* Good: you recalled the correct answer with moderate effort, within a few seconds. This should be your most common rating for cards you genuinely know but are still consolidating. It produces a healthy, standard interval increase.
* Easy: the answer came back instantly, with zero hesitation. Use this sparingly and only when it is true. Easy pushes the card far into the future, which is exactly right for something you have clearly mastered and wasteful for anything you are still shaky on.

## The honesty test

A simple rule keeps you calibrated: if you hesitated, it was not Easy, and if you had to look, it was Again. The moment of uncertainty is the signal. When you catch yourself reaching for Good on a card you barely limped through, drop it to Hard or Again. The short-term cost is seeing the card sooner. The long-term payoff is that you actually remember it, instead of discovering on exam day that a card you rated Good three weeks ago is gone.

## Why over-grading feels good and hurts

Pressing Easy and Good clears your due pile faster and makes today's session feel like a win. But spaced repetition is a trade across time. Every interval you inflate today is a relearning session you pay for later, because relearning a forgotten card costs far more effort than a timely review would have. The people who get the most out of decks are usually the ones who grade themselves a little harder than feels comfortable.

## Write cards that are gradeable

Honest grading is easier when a card has one clear answer. A flashcard that asks you to "explain the causes of inflation" is hard to grade, because you can always claim you knew most of it. When you build decks in QuizFlow, favour cards with a single specific answer: one term, one date, one definition, one step. If a generated card is too broad, edit it into something you can grade cleanly, or split it into two. Cloze-style cards, which blank out one keyword in a sentence, are naturally easy to grade because either you produced the word or you did not.

## Fit it into a routine

Grade in the flow of a normal daily session. Open a deck, clear the cards that are due, and rate each one the instant you check it, before you talk yourself into a better grade. Keep the habit daily rather than saving up. A small honest session every day gives the scheduling algorithm clean data to work with, and clean data is what turns a pile of cards into durable memory.

## A note on your data

Your grades, intervals, and due dates are stored locally in your browser, which keeps your study private and works offline. The flip side is that clearing browser data resets your progress, and there is no automatic sync between devices. Export a backup from Settings before clearing anything, and move that backup by hand if you study on more than one machine.
    `,
  },
  "weak-topic-analysis": {
    slug: "weak-topic-analysis",
    title: "Weak-Topic Analysis Explained",
    description:
      "How QuizFlow turns your missed questions into a focused study plan, and how to act on it without re-reading everything.",
    publishedAt: "2026-07-17",
    readTime: "6 min read",
    content: `
## A score tells you how, not what

Finishing a quiz and seeing seventy percent is useful, but it does not tell you what to do next. Thirty percent of something is wrong, and re-reading the whole chapter to fix it is slow and mostly wasted on material you already know. What you actually need is a shortlist: which specific topics you keep missing, so you can spend your remaining time only on those. That shortlist is what weak-topic analysis produces.

## What the analysis looks at

Weak-topic analysis works from your local results, the record of which questions you got right and wrong across your attempts. It does not re-open or re-upload your source document. It reads the outcomes already stored on your device and does three things with them.

1. It groups your missed questions into themes, so a cluster of wrong answers about, say, caching or subnetting or the French Revolution becomes a single named weak spot rather than a scatter of individual mistakes.
2. It weighs how bad each spot is. Missing one question in an area you otherwise ace is different from missing most of them. The analysis distinguishes a minor wobble from a genuine gap so you can tell the difference between "review once" and "relearn."
3. It suggests concrete next steps, pointing you toward the material and the kind of practice that will move the needle, rather than leaving you with a raw list of wrong answers.

## Why grouping beats a raw error list

A list of individual wrong answers is hard to act on, because each one feels like a separate small failure. Grouping them into topics changes the picture. Ten scattered mistakes might collapse into two real weaknesses. Now you have a plan you can hold in your head: fix these two things. This is the difference between feeling vaguely underprepared and knowing exactly where to point your next study session.

## How to act on the results

The analysis is only worth running if you change what you do next. A simple loop works well.

1. Take a few quizzes on a topic so there is enough data to find patterns. One quiz is not much to go on; several attempts give a clearer signal.
2. Run weak-topic analysis and read the one or two areas where your accuracy is lowest.
3. Go back to just those sub-sections in your source material. Re-read the relevant pages, or better, regenerate a small, focused quiz from that specific page range and drill it.
4. Retake and use retake-incorrect-only to keep hammering the exact questions you miss.
5. Run the analysis again later to confirm the weak spot has actually closed, not just moved.

## Where it fits in exam prep

Weak-topic analysis is at its most valuable in the final stretch before an exam, when time is short and you cannot afford to review everything. Early on, broad coverage makes sense. In the last week, you want precision. Running the analysis across your recent attempts tells you where your last hours will do the most good, which is almost always a small number of stubborn topics rather than the whole syllabus.

## Honest limits

The analysis is only as good as the data behind it. If you have taken very few quizzes, there is not much to group, and the results will be thin. It also reflects what your quizzes actually tested. If a topic never appeared in a question, it cannot show up as a weakness, so make sure your quizzes cover the full range of the material, not just the parts that were easy to generate. And because it works from outcomes rather than the document itself, it can tell you that you keep missing a topic, but the depth of its suggestions depends on how clearly your questions were labelled and worded. Well-written questions with clear explanations produce a sharper analysis.

## Privacy by design

Everything here happens on your device. Your results live in local storage, and the analysis reads them there. The aggregated outcomes, not your original document, are what get processed, so your study material is never re-sent anywhere. As with the rest of QuizFlow, that privacy comes with a trade-off: your history is tied to this browser. Export a backup from Settings before you clear your data, and keep in mind that a fresh browser starts with a blank slate and no weak topics to report until you have taken some quizzes again.
    `,
  },
};
