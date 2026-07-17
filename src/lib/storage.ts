import { type DBSchema, type IDBPDatabase, openDB } from "idb";
import {
  type Deck,
  type ExportEnvelope,
  exportEnvelopeSchema,
  type Quiz,
  type QuizResult,
  SCHEMA_VERSION,
} from "./types";

/**
 * Typed IndexedDB access (STANDARDS §1: all user data in IndexedDB via `idb` behind
 * this module). Documents themselves are never persisted — only generated quizzes,
 * decks and results. Client-only; every call throws a clear error under SSR.
 */
interface QuizFlowDB extends DBSchema {
  quizzes: { key: string; value: Quiz; indexes: { "by-createdAt": string } };
  decks: { key: string; value: Deck; indexes: { "by-createdAt": string } };
  results: { key: string; value: QuizResult; indexes: { "by-createdAt": string } };
}

const DB_NAME = "mk-quizflow";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<QuizFlowDB>> | null = null;

function getDb(): Promise<IDBPDatabase<QuizFlowDB>> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB is unavailable (server or unsupported browser)."));
  }
  if (!dbPromise) {
    dbPromise = openDB<QuizFlowDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        for (const name of ["quizzes", "decks", "results"] as const) {
          if (!db.objectStoreNames.contains(name)) {
            const store = db.createObjectStore(name, { keyPath: "id" });
            store.createIndex("by-createdAt", "createdAt");
          }
        }
      },
    });
  }
  return dbPromise;
}

function byCreatedDesc<T extends { createdAt: string }>(items: T[]): T[] {
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// ---- Quizzes ----
export async function saveQuiz(quiz: Quiz): Promise<void> {
  const db = await getDb();
  await db.put("quizzes", quiz);
}
export async function getQuiz(id: string): Promise<Quiz | undefined> {
  const db = await getDb();
  return db.get("quizzes", id);
}
export async function listQuizzes(): Promise<Quiz[]> {
  const db = await getDb();
  return byCreatedDesc(await db.getAll("quizzes"));
}
export async function deleteQuiz(id: string): Promise<void> {
  const db = await getDb();
  await db.delete("quizzes", id);
}

// ---- Decks ----
export async function saveDeck(deck: Deck): Promise<void> {
  const db = await getDb();
  await db.put("decks", deck);
}
export async function getDeck(id: string): Promise<Deck | undefined> {
  const db = await getDb();
  return db.get("decks", id);
}
export async function listDecks(): Promise<Deck[]> {
  const db = await getDb();
  return byCreatedDesc(await db.getAll("decks"));
}
export async function deleteDeck(id: string): Promise<void> {
  const db = await getDb();
  await db.delete("decks", id);
}

// ---- Results ----
export async function saveResult(result: QuizResult): Promise<void> {
  const db = await getDb();
  await db.put("results", result);
}
export async function listResults(): Promise<QuizResult[]> {
  const db = await getDb();
  return byCreatedDesc(await db.getAll("results"));
}
export async function listResultsForQuiz(quizId: string): Promise<QuizResult[]> {
  const results = await listResults();
  return results.filter((r) => r.quizId === quizId);
}

// ---- Bulk ----
export async function clearAll(): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(["quizzes", "decks", "results"], "readwrite");
  await Promise.all([
    tx.objectStore("quizzes").clear(),
    tx.objectStore("decks").clear(),
    tx.objectStore("results").clear(),
    tx.done,
  ]);
}

export async function exportAll(): Promise<ExportEnvelope> {
  const [quizzes, decks, results] = await Promise.all([listQuizzes(), listDecks(), listResults()]);
  return {
    app: "mk-quizflow",
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    quizzes,
    decks,
    results,
  };
}

export interface ImportSummary {
  quizzes: number;
  decks: number;
  results: number;
}

/**
 * Validate (zod) and import an export envelope. `replace` clears existing data first;
 * otherwise records merge by id (existing ids are skipped). Throws on invalid input.
 */
export async function importAll(raw: unknown, replace = false): Promise<ImportSummary> {
  const parsed = exportEnvelopeSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error("This file isn't a valid MK QuizFlow export.");
  }
  const envelope = parsed.data;
  if (replace) await clearAll();

  const db = await getDb();
  const summary: ImportSummary = { quizzes: 0, decks: 0, results: 0 };

  const merge = async <K extends "quizzes" | "decks" | "results">(
    store: K,
    items: QuizFlowDB[K]["value"][],
  ) => {
    for (const item of items) {
      const existing = await db.get(store, item.id);
      if (existing && !replace) continue;
      await db.put(store, item);
      summary[store] += 1;
    }
  };

  await merge("quizzes", envelope.quizzes);
  await merge("decks", envelope.decks);
  await merge("results", envelope.results);
  return summary;
}

export interface StorageUsage {
  usageBytes: number | null;
  quotaBytes: number | null;
}

export async function estimateUsage(): Promise<StorageUsage> {
  if (typeof navigator === "undefined" || !navigator.storage?.estimate) {
    return { usageBytes: null, quotaBytes: null };
  }
  const { usage, quota } = await navigator.storage.estimate();
  return { usageBytes: usage ?? null, quotaBytes: quota ?? null };
}
