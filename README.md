# 나 뭐해? (omo-what-now)

자원봉사자 이름을 입력하면 시간별로 무엇을 해야 하는지 알려주는 Next.js 웹앱.

- Google Sheets의 `volunteers` 탭을 읽기 전용으로 파싱해서 렌더
- 이름 선택 시 자동으로 최신 시트 재조회
- `새로고침` 버튼으로 언제든 수동 갱신 가능

## Stack

- Next.js 16.1.6 (App Router, Turbopack, Server Actions)
- React 19.2
- TypeScript
- Tailwind CSS v4 + [Zendo 디자인 시스템](https://github.com/vibe-work/zendo) (로컬 복제)
- Base UI (`@base-ui/react`) for the name Combobox
- Bun (dev/install). npm/pnpm도 문제없음

## 데이터 소스

- Sheet ID: `1mWr4NIXbc6wiWDyG4X3Oyhrd9cYyXCTFpLgdfoT7NOE`
- GID: `784194405` (`volunteers` 탭)
- Event date: `2026-04-25` (Asia/Seoul)

시트는 **수정 불가, 읽기 전용**으로 사용. 공개 CSV export URL을 `fetch`로 받아서 파싱한다. Google Sheets API 키는 필요 없음.

### 시트 공유 조건

시트 소유자가 반드시 한 번은 해두어야 함:

> 공유 → 일반 액세스 → **링크가 있는 모든 사용자** → **뷰어**

이 상태에서만 CSV export URL이 열린다.

## Local Development

```bash
bun install
bun run dev              # http://localhost:3000
PORT=3001 bun run dev    # 다른 포트로
```

### 주요 경로

| Path | 설명 |
|---|---|
| `/` | 이름 선택 (Combobox 자동완성) |
| `/me?name=박민준` | 해당 이름의 타임라인 + 새로고침 버튼 |
| `/api/schedule` | 파싱 결과 JSON (디버그용) |

## 캐싱 전략

- `fetchSchedule()` → `fetch(CSV_URL, { next: { revalidate: 300, tags: ['schedule'] } })`
- 5분 ISR + 태그 기반 on-demand 무효화
- 사용자 트리거:
  - 메인에서 이름 선택 시 → `updateTag('schedule')` + `router.push('/me?...')`
  - `/me`의 새로고침 버튼 → `updateTag('schedule')` + `router.refresh()`

`updateTag`는 캐시를 즉시 만료시켜서 다음 요청이 신선한 데이터를 받도록 강제한다 (stale-while-revalidate 아님).

## Deploy to Vercel

1. 이 디렉토리를 GitHub 레포로 푸시
2. https://vercel.com/new 에서 해당 레포 Import
3. Framework Preset: **Next.js** (자동 감지됨)
4. Environment Variables는 비워두어도 무방. 값 바꾸고 싶으면:
   - `NEXT_PUBLIC_SHEET_ID`
   - `NEXT_PUBLIC_SHEET_GID`
   - `NEXT_PUBLIC_EVENT_DATE`
5. Deploy

빌드 명령은 기본값 `next build` 그대로 두면 된다.

## Environment Variables

`.env.local.example` 참고. 기본값이 `src/lib/config.ts`에 박혀있어서 `.env.local`은 선택 사항.

```
NEXT_PUBLIC_SHEET_ID=1mWr4NIXbc6wiWDyG4X3Oyhrd9cYyXCTFpLgdfoT7NOE
NEXT_PUBLIC_SHEET_GID=784194405
NEXT_PUBLIC_EVENT_DATE=2026-04-25
```

## Project Layout

```
src/
├── app/
│   ├── api/schedule/route.ts   # 디버그 JSON
│   ├── me/
│   │   ├── actions.ts          # updateTag Server Action
│   │   └── page.tsx            # 결과 페이지
│   ├── globals.css             # Zendo 토큰 import
│   ├── layout.tsx              # Inter + Instrument Serif + ThemeScript
│   └── page.tsx                # 메인 (이름 선택)
├── components/
│   ├── app/                    # 이 앱 전용
│   │   ├── HomeForm.tsx        # Combobox + 제출
│   │   ├── MyScheduleView.tsx  # 타임라인 렌더
│   │   └── RefreshButton.tsx   # 최근 업데이트 + ↻
│   ├── Button.tsx ...          # Zendo 디자인 시스템 (복제)
│   └── ThemeScript.tsx, ThemeToggle.tsx
├── lib/
│   ├── csv.ts                  # RFC-4180 CSV 파서
│   ├── parser.ts               # CSV → Schedule (특수 셀 처리 포함)
│   ├── schedule.ts             # findMySchedule
│   ├── fetchSchedule.ts        # fetch + tag
│   ├── config.ts, time.ts, types.ts
└── styles/                     # Zendo tokens/theme/typography
```

## 시트 파싱 규칙

| 셀 유형 | 예시 | 처리 |
|---|---|---|
| 정규 | `박민준, 김재연` | 이름 배열 |
| 서브역할 | `의자: 백승준, 성창호 / 점심: 강민희` | 각 이름에 `subRole` 부여, `/` 로 분리 |
| 전원 | `전원 브리핑` | 모든 볼런티어가 "전원 참여" 배지로 표시 |
| 빈 셀 | `` | 스킵 |

자세한 로직은 `src/lib/parser.ts`의 `parseRoleCell` 참조.
