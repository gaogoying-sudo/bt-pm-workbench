import { ParsedInputIntent } from '@/lib/types/input-events';

function includesAny(text: string, keywords: string[]) {
  const t = text.toLowerCase();
  return keywords.some((k) => t.includes(k));
}

export const inputParserService = {
  parse(rawText: string): ParsedInputIntent {
    const t = rawText.trim();
    const lower = t.toLowerCase();

    if (includesAny(lower, ['pd', 'person-day', '工天', '人天', '成本', 'cost'])) {
      return {
        eventType: 'manpower-actual-input',
        confidence: 0.62,
        reason: 'Detected manpower/cost keywords',
        extracted: {}
      };
    }

    if (includesAny(lower, ['质量', 'quality', 'review', '评审', 'gate', '门禁', '验收'])) {
      return {
        eventType: 'quality-check',
        confidence: 0.7,
        reason: 'Detected quality/review keywords',
        extracted: {}
      };
    }

    if (includesAny(lower, ['risk', '风险', 'block', '阻塞', '延期', 'delay'])) {
      return {
        eventType: 'risk-event',
        confidence: 0.68,
        reason: 'Detected risk/blocker keywords',
        extracted: {}
      };
    }

    if (includesAny(lower, ['done', '完成', 'worklog', '日志', '推进', 'progress'])) {
      return {
        eventType: 'task-activity',
        confidence: 0.55,
        reason: 'Detected task activity keywords',
        extracted: {}
      };
    }

    if (includesAny(lower, ['进度', '%', 'progress update'])) {
      return {
        eventType: 'progress-update',
        confidence: 0.5,
        reason: 'Detected progress related keywords',
        extracted: {}
      };
    }

    return {
      eventType: 'decision-note',
      confidence: 0.35,
      reason: 'Fallback to decision/note',
      extracted: {}
    };
  }
};

