export const SHEET_ID =
  process.env.NEXT_PUBLIC_SHEET_ID ?? "1mWr4NIXbc6wiWDyG4X3Oyhrd9cYyXCTFpLgdfoT7NOE";
export const SHEET_GID = process.env.NEXT_PUBLIC_SHEET_GID ?? "784194405";
export const EVENT_DATE = process.env.NEXT_PUBLIC_EVENT_DATE ?? "2026-04-25";
export const EVENT_TIMEZONE = "Asia/Seoul";

export const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;
