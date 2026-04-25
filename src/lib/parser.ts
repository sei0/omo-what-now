import { parseCSV } from "./csv";
import {
  ROLE_ORDER,
  type AssignedPerson,
  type RoleCategory,
  type Schedule,
  type Slot,
} from "./types";

const TIME_RANGE_RE = /^(\d{1,2}):(\d{2})\s*[~\-–]\s*(\d{1,2}):(\d{2})$/;
const ALL_HANDS_TOKENS = ["전원"];
const ROLE_COLUMN_INDEX: Record<RoleCategory, number> = {
  checkin: 2,
  timer: 3,
  cleanup: 4,
  setup: 5,
};

function parseTimeRange(raw: string, eventDate: string): { start: string; end: string; label: string } | null {
  const match = raw.trim().match(TIME_RANGE_RE);
  if (!match) return null;
  const [, h1, m1, h2, m2] = match;
  const pad = (n: string) => n.padStart(2, "0");
  const start = `${eventDate}T${pad(h1)}:${pad(m1)}:00+09:00`;
  const end = `${eventDate}T${pad(h2)}:${pad(m2)}:00+09:00`;
  return { start, end, label: `${pad(h1)}:${pad(m1)}~${pad(h2)}:${pad(m2)}` };
}

function splitNames(raw: string): string[] {
  // Split on commas, but not inside parentheses (e.g. "홍인표(마이크/좌석 보조)").
  const out: string[] = [];
  let depth = 0;
  let buf = "";
  for (const ch of raw) {
    if (ch === "(" || ch === "（") depth++;
    else if (ch === ")" || ch === "）") depth = Math.max(0, depth - 1);
    if (depth === 0 && (ch === "," || ch === "，" || ch === "、")) {
      const t = buf.trim();
      if (t) out.push(t);
      buf = "";
      continue;
    }
    buf += ch;
  }
  const tail = buf.trim();
  if (tail) out.push(tail);
  return out;
}

function looksLikeHumanName(token: string): boolean {
  const t = token.trim();
  if (!t) return false;
  if (t.length > 6) return false;
  if (/[:：/\n]/.test(t)) return false;
  return /^[가-힣A-Za-z][가-힣A-Za-z\s.]*$/.test(t);
}

// Matches "이름(부역할)" — e.g. "정지혁(발표자 대기 리드)", "홍인표(마이크/좌석 보조)".
const PAREN_SUBROLE_RE = /^([^()（）]+)\s*[（(]\s*(.+?)\s*[)）]\s*$/;

function parseTokenWithOptionalSubRole(
  token: string,
): AssignedPerson | null {
  const trimmed = token.trim();
  if (!trimmed) return null;

  const m = trimmed.match(PAREN_SUBROLE_RE);
  if (m) {
    const name = m[1].trim();
    const subRole = m[2].trim();
    if (looksLikeHumanName(name)) {
      return subRole ? { name, subRole } : { name };
    }
    return null;
  }

  if (looksLikeHumanName(trimmed)) {
    return { name: trimmed };
  }
  return null;
}

export function parseRoleCell(raw: string): {
  people: AssignedPerson[];
  isAllHands: boolean;
} {
  const trimmed = raw.trim();
  if (!trimmed) return { people: [], isAllHands: false };

  if (ALL_HANDS_TOKENS.some((tok) => trimmed.includes(tok))) {
    return { people: [], isAllHands: true };
  }

  const hasGroupSubRole = trimmed.includes(":") || trimmed.includes("：");
  if (hasGroupSubRole) {
    const result: AssignedPerson[] = [];
    const segments = trimmed.split(/\s*\/\s*/);
    for (const seg of segments) {
      const colonMatch = seg.match(/^([^:：]+)[:：]\s*(.+)$/);
      if (colonMatch) {
        const subRole = colonMatch[1].trim();
        for (const token of splitNames(colonMatch[2])) {
          const parsed = parseTokenWithOptionalSubRole(token);
          if (parsed) {
            result.push({ name: parsed.name, subRole: parsed.subRole ?? subRole });
          }
        }
      } else {
        for (const token of splitNames(seg)) {
          const parsed = parseTokenWithOptionalSubRole(token);
          if (parsed) result.push(parsed);
        }
      }
    }
    return { people: result, isAllHands: false };
  }

  const people: AssignedPerson[] = [];
  for (const token of splitNames(trimmed)) {
    const parsed = parseTokenWithOptionalSubRole(token);
    if (parsed) people.push(parsed);
  }
  return { people, isAllHands: false };
}

export function parseSetupCell(raw: string): {
  people: AssignedPerson[];
  isAllHands: boolean;
} {
  return parseRoleCell(raw);
}

function emptyByRole(): Record<RoleCategory, AssignedPerson[]> {
  return { checkin: [], timer: [], cleanup: [], setup: [] };
}

export function parseSchedule(csv: string, eventDate: string): Schedule {
  const rows = parseCSV(csv);
  const slots: Slot[] = [];
  const volunteerSet = new Set<string>();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const timeRaw = (row[0] ?? "").trim();
    if (!timeRaw) continue;
    if (timeRaw === "운영 메모") break;

    const time = parseTimeRange(timeRaw, eventDate);
    if (!time) continue;

    const program = (row[1] ?? "").trim();
    const noteIdx = 6;
    const note = (row[noteIdx] ?? "").trim() || undefined;

    const byRole = emptyByRole();
    let isAllHands = false;

    for (const role of ROLE_ORDER) {
      const colIdx = ROLE_COLUMN_INDEX[role];
      const cell = row[colIdx] ?? "";
      const parsed = parseRoleCell(cell);
      byRole[role] = parsed.people;
      if (parsed.isAllHands) isAllHands = true;
      for (const p of parsed.people) {
        volunteerSet.add(p.name);
      }
    }

    slots.push({
      time: time.label,
      startAt: time.start,
      endAt: time.end,
      program,
      note,
      byRole,
      isAllHands,
    });
  }

  return {
    slots,
    volunteers: Array.from(volunteerSet).sort((a, b) => a.localeCompare(b, "ko")),
    fetchedAt: new Date().toISOString(),
  };
}
