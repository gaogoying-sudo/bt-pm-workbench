import { seededDecisions, seededLessons, seededReviews } from '@/data/reviews/review-seed';
import { addItem, getCollection } from '@/server/persistence/local-store';
import { DecisionLogRecord, LessonLearnedRecord, ReviewRecord } from '@/lib/types/reviews';

const REVIEWS = 'reviews';
const DECISIONS = 'decisions';
const LESSONS = 'lessons';

export const reviewRepository = {
  listReviews(): ReviewRecord[] {
    const existing = getCollection<ReviewRecord>(REVIEWS);
    if (existing.length === 0) return seededReviews;
    return existing;
  },
  upsertReview(record: ReviewRecord) {
    addItem(REVIEWS, record);
  },

  listDecisions(): DecisionLogRecord[] {
    const existing = getCollection<DecisionLogRecord>(DECISIONS);
    if (existing.length === 0) return seededDecisions;
    return existing;
  },
  upsertDecision(record: DecisionLogRecord) {
    addItem(DECISIONS, record);
  },

  listLessons(): LessonLearnedRecord[] {
    const existing = getCollection<LessonLearnedRecord>(LESSONS);
    if (existing.length === 0) return seededLessons;
    return existing;
  },
  upsertLesson(record: LessonLearnedRecord) {
    addItem(LESSONS, record);
  }
};

