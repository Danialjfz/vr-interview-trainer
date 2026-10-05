# Demo Video Shot List — VR Interview Trainer (면접관), 3:00

**Recording setup:** macOS screen recording with **Cmd+Shift+5** (record entire screen or the Chrome window, 1080p). Chrome at `http://localhost:8123` (served via `python3 -m http.server 8123`), **mock mode** (default — no API key needed). Hide the bookmarks bar (Cmd+Shift+B), go full screen, and prepare the narration below. Record one take per block; blocks are joined by simple cuts.

**Fallback tips (read before recording):**
- Mock mode needs **no API key** — if the API-key modal appears, close it and stay in MOCK (`#badge` shows MOCK).
- If the Korean `speechSynthesis` voice is missing on the machine, the video still works **silently**: the subtitle line (`#sub`) carries all interviewer dialogue on screen.
- Mock mode never requests the microphone, so mic-permission popups cannot interrupt the take.
- If a take goes wrong, refresh the page — mock mode restarts deterministically.

---

## Block 1 — Title / intro (0:00–0:15)

**Shot:** App landing view (dressing room, before any input). Optionally a title card with project name and Task 3-2 line.

**On-screen actions (exact):** none. Page is already loaded; `#badge` reads MOCK.

**Narration (KO):**
> "안녕하십니까. 경상국립대학교 글로컬 프로젝트, 과제 3-2 'Meta Quest 2 기반 피지컬 AI 에이전트'의 결과물, VR 면접 트레이너 '면접관'입니다. 이 시스템은 면접 답변의 내용, 몸짓과 시선, 그리고 복장까지 세 가지를 동시에 평가하는 엄격한 한국식 면접 시뮬레이터입니다."

**Narration (EN):**
> "Hello. This is 'Myeonjeopgwan', a VR interview trainer built for Task 3-2, 'Meta Quest 2 VR-Based Physical AI Agent', of the Gyeongsang National University Glocal Project. It is a strict Korean-style interview simulator that evaluates three axes at once: answer content, body language and gaze, and attire."

---

## Block 2 — Dressing room (0:15–0:45)

**Shot:** Dressing room scene: primitive player avatar at the fake mirror + canvas-texture selection panel.

**On-screen actions (exact):**
1. Move the pointer over the panel (raycast hover visible).
2. Click outfit **'정장'** (suit).
3. Click hair **'검정'** (black).
4. Click industry **'대기업'** (large corporation).
5. Drag the mouse to show the avatar and the fake mirror updating after each click.
6. Pause on the panel; click the **confirm / 면접 시작** button to enter the interview.

**Narration (KO):**
> "먼저 드레싱 룸입니다. 지원자는 헤어, 복장, 그리고 지원 업종을 고릅니다. 정장에 검정 머리, 대기업 지원을 선택해 보겠습니다. 거울 속 아바타가 즉시 바뀌는 것을 볼 수 있습니다. 이 선택은 나중에 복장 점수로 환산됩니다. 정장과 검정 머리, 대기업 조합은 만점인 100점입니다."

**Narration (EN):**
> "First, the dressing room. The candidate picks hair, outfit, and target industry. Let's choose a suit, black hair, and large corporation. Watch the avatar in the mirror update immediately. These choices later become the attire score: suit, black hair, large corporation scores a perfect 100."

---

## Block 3 — Interview, Q1 full cycle (0:45–1:50)

**Shot:** Interview room: primitive-mesh interviewer, subtitle line, question panel, and the **HUD visible at all times** (eye-contact %, fidget index, bow count).

**On-screen actions (exact):**
1. Interviewer greets (jaw bob + subtitle). **Bow:** drag the mouse to pitch the view down past −35° — watch the HUD bow counter increment.
2. Q1 **'자기소개를 해 보세요'** appears on the panel and subtitle.
3. **Hold the push-to-talk button** and speak any answer aloud (mock mode substitutes a canned Korean transcript); release to submit.
4. The per-answer score appears (Q1 = 82).
5. The **adaptive follow-up** question appears; repeat the push-to-talk answer once.
6. Throughout: keep the interviewer roughly centered so the HUD **eye-contact %** climbs; shake the view briefly once to show the **fidget index** reacting.
7. **Jump-cut note (edit):** Q2 (지원동기) and Q3 (장단점) use the *identical* cycle — insert a 1-second title card "Q2·Q3 진행 (동일한 흐름, 편집 생략) / Q2–Q3 proceed identically (cut for time)" and cut directly to the report board.

**Narration (KO):**
> "면접이 시작됩니다. 면접관의 인사에 고개 숙여 답례하면 HUD의 인사 횟수가 올라갑니다. 첫 질문은 자기소개입니다. 말하기 버튼을 누른 채 답변합니다. 답변이 끝나면 즉시 점수가 매겨지고, 답변 내용에 따라 꼬리질문이 생성됩니다. 화면 상단 HUD에서 시선 접촉 비율, 몸떨림 지수, 인사 횟수가 실시간으로 갱신되는 것을 확인하세요. 두 번째, 세 번째 질문도 같은 흐름으로 진행되며, 영상에서는 생략합니다."

**Narration (EN):**
> "The interview begins. Answer the interviewer's greeting with a bow and the HUD bow counter rises. Question one is self-introduction. Hold push-to-talk and answer. The answer is scored immediately, and an adaptive follow-up is generated from it. Watch the HUD: eye-contact percentage, fidget index, and bow count update in real time. Questions two and three follow the identical cycle and are cut for time."

---

## Block 4 — Report board walkthrough (1:50–2:30)

**Shot:** Report state: the in-world report board fills the view.

**On-screen actions (exact):**
1. Read the three category scores aloud in order: **내용 80** (mean of 82/85/74/78/81/80), **태도·시선** (body score from the take), **복장 100** (suit/black/large-corp).
2. Point at the weighted total and grade.
3. Scroll/pan to the per-answer feedback lines.

**Narration (KO):**
> "면접이 끝나면 결과 보드가 표시됩니다. 내용 점수는 여섯 답변의 평균인 80점, 복장은 100점, 여기에 시선과 자세 점수가 합산됩니다. 총점은 내용 50퍼센트, 태도·시선 30퍼센트, 복장 20퍼센트의 가중 평균이며, 90점 이상 S, 80점 이상 A, 70점 이상 B, 그 외 C 등급이 부여됩니다."

**Narration (EN):**
> "When the interview ends, the report board appears. Content is the mean of the six answers — 80. Attire is 100. Body language comes from the HUD telemetry. The total is a weighted mean: 50 percent content, 30 percent attitude and gaze, 20 percent attire. Grades: S at 90 and above, A at 80, B at 70, otherwise C."

---

## Block 5 — Architecture + closing (2:30–3:00)

**Shot:** Cut to the architecture slide (deck slide 5, full screen). Pointer follows the narration.

**On-screen actions (exact):**
1. Point at `index.html` overlay → `js/main.js` state machine.
2. Point at the three leaves: `js/world.js`, `js/ai.js`, `js/telemetry.js`.
3. Point at the mock ↔ live adapter and name the four OpenAI models.
4. End card: project name + "감사합니다 / Thank you".

**Narration (KO):**
> "구조는 단순합니다. 빌드 없이 동작하는 싱글 페이지 앱이며, main.js의 상태머신이 월드, AI 어댑터, 텔레메트리를 지휘합니다. 기본 모의 모드는 네트워크 없이 동작하고, 라이브 모드는 whisper, gpt-4o-mini, gpt-4o, tts-1을 사용하되 어떤 오류도 모의 모드로 자동 대첩니다. 현재 맥OS 데스크톱에서 검증을 마쳤고, 퀘스트 2 실기기 검증이 다음 단계입니다. 감사합니다."

**Narration (EN):**
> "The architecture is simple: a single-page app with no build step. The state machine in main.js drives the world, the AI adapter, and the telemetry module. Mock mode runs with zero network; live mode uses whisper, gpt-4o-mini, gpt-4o, and tts-1, and any error falls back to mock automatically. Verification is complete on the macOS desktop; on-device Quest 2 testing is our next milestone. Thank you."
