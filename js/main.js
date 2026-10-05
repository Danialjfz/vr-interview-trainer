// main.js — bootstrap, input, state machine (DRESS → INTERVIEW → REPORT)
import * as THREE from 'three';
import { World } from './world.js';
import { AI, QUESTIONS } from './ai.js';
import { Telemetry } from './telemetry.js';

// ---------- renderer / scene / camera ----------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1c22);

const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.05, 60);
camera.rotation.order = 'YXZ';
const rig = new THREE.Group();
rig.add(camera);
rig.position.set(0, 0, 2.2);
camera.position.set(0, 1.55, 0); // desktop eye height; ignored under XR local-floor
scene.add(rig);

const world = new World(scene);
const telemetry = new Telemetry();
const sel = { outfit: 'suit', hair: 'black', industry: 'corp' };
world.setAvatar(sel);
world.showPanel('dress');

// ---------- DOM helpers ----------
const $ = (id) => document.getElementById(id);
const sub = (t) => { const el = $('sub'); el.textContent = t || ''; el.style.display = t ? 'block' : 'none'; };
const hud = $('hud');
function badge() {
  const b = $('badge');
  b.className = 'ov' + (AI.live ? ' live' : '');
  b.innerHTML = '모드 <b>' + (AI.live ? 'LIVE' : 'MOCK') + '</b>';
}
badge();

// config modal
$('cfgbtn').onclick = () => { $('cfg').style.display = 'block'; $('key').value = localStorage.getItem('vrit_key') || ''; };
$('close').onclick = () => { $('cfg').style.display = 'none'; };
$('save').onclick = () => { const k = $('key').value.trim(); if (k) AI.setKey(k); badge(); $('cfg').style.display = 'none'; };
$('clear').onclick = () => { AI.clearKey(); badge(); $('cfg').style.display = 'none'; };
if (localStorage.getItem('vrit_key')) { AI.live = true; badge(); }

// ---------- drag-look (desktop) ----------
let yaw = 0, pitch = 0, dragging = false, dragDist = 0, px = 0, py = 0;
renderer.domElement.addEventListener('mousedown', (e) => { dragging = true; dragDist = 0; px = e.clientX; py = e.clientY; });
addEventListener('mousemove', (e) => {
  if (!dragging || renderer.xr.isPresenting) return;
  const dx = e.clientX - px, dy = e.clientY - py; px = e.clientX; py = e.clientY;
  dragDist += Math.abs(dx) + Math.abs(dy);
  yaw -= dx * 0.0032; pitch = Math.max(-1.2, Math.min(1.2, pitch - dy * 0.0032));
  camera.rotation.set(pitch, yaw, 0);
});
addEventListener('mouseup', () => { dragging = false; });
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// ---------- panel clicking (mouse + XR controller share one path) ----------
const raycaster = new THREE.Raycaster();
let clickResolve = null;
function waitForButton(...ids) {
  return new Promise((res) => { clickResolve = { ids, res }; });
}
function handleButton(id) {
  if (!id) return;
  if (clickResolve && clickResolve.ids.includes(id)) {
    const c = clickResolve; clickResolve = null; c.res(id); return;
  }
  if (id.startsWith('hair:')) { sel.hair = id.slice(5); world.setAvatar(sel); }
  else if (id.startsWith('outfit:')) { sel.outfit = id.slice(7); world.setAvatar(sel); }
  else if (id.startsWith('industry:')) { sel.industry = id.slice(9); }
  else if (id === 'restart') location.reload();
}
function castAndClick(origin, direction) {
  raycaster.set(origin, direction);
  const hit = raycaster.intersectObject(world.panel, false)[0];
  if (hit && hit.uv) handleButton(world.clickAt(hit.uv));
}
renderer.domElement.addEventListener('click', (e) => {
  if (dragDist > 6 || renderer.xr.isPresenting) return; // was a look-drag
  const ndc = new THREE.Vector2((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const hit = raycaster.intersectObject(world.panel, false)[0];
  if (hit && hit.uv) handleButton(world.clickAt(hit.uv));
});
addEventListener('keydown', (e) => { if (e.code === 'Space') { e.preventDefault(); handleButton('answer'); } });

// XR session + controllers
if (navigator.xr && navigator.xr.isSessionSupported) {
  navigator.xr.isSessionSupported('immersive-vr').then((ok) => {
    if (!ok) return;
    $('vr').style.display = 'block';
    $('vr').onclick = async () => {
      try {
        const s = await navigator.xr.requestSession('immersive-vr', { optionalFeatures: ['local-floor'] });
        await renderer.xr.setSession(s);
      } catch (err) { console.warn('XR session failed', err); }
    };
  });
}
for (const i of [0, 1]) {
  const c = renderer.xr.getController(i);
  c.addEventListener('selectstart', () => {
    const m = new THREE.Matrix4().identity().extractRotation(c.matrixWorld);
    castAndClick(new THREE.Vector3().setFromMatrixPosition(c.matrixWorld),
                 new THREE.Vector3(0, 0, -1).applyMatrix4(m));
  });
  rig.add(c);
}

// ---------- mic (live mode only) ----------
let mediaStream = null;
async function recordUntil(stopPromise) {
  if (!AI.live || !navigator.mediaDevices) { await stopPromise; await new Promise(r => setTimeout(r, 800)); return null; }
  try {
    mediaStream = mediaStream || await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(mediaStream);
    const chunks = [];
    rec.ondataavailable = (e) => chunks.push(e.data);
    const done = new Promise((r) => { rec.onstop = r; });
    rec.start();
    await stopPromise;
    rec.stop(); await done;
    mediaStream.getTracks().forEach(t => t.stop()); mediaStream = null;
    return new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
  } catch (err) { console.warn('mic failed, mock STT', err); return null; }
}

// ---------- interview flow ----------
async function answerOnce(promptText) {
  world.setInterview(promptText, false);
  sub(promptText);
  await AI.speak(promptText);
  sub('클릭(또는 스페이스)으로 답변을 시작하세요.');
  await waitForButton('answer');
  world.setInterview(promptText, true);
  sub('● 녹음 중… 다시 클릭하면 종료');
  const blob = await recordUntil(waitForButton('answer'));
  world.setInterview(promptText, false);
  sub('인식 중…');
  const transcript = await AI.stt(blob);
  sub('나: ' + transcript);
  const ev = await AI.evaluateAnswer(promptText, transcript);
  await new Promise(r => setTimeout(r, 1200));
  return { transcript, ev };
}

async function runInterview() {
  world.showPanel('hidden');
  const attire = await AI.attireScore(sel, null); // judged on dress-room exit
  telemetry.start();
  sub('면접관: 어서 오십시오. 인사하고 시작합시다.');
  await AI.speak('어서 오십시오. 인사하고 시작합시다.');
  const scores = [], lines = [];
  for (let i = 0; i < QUESTIONS.length; i++) {
    const a1 = await answerOnce(QUESTIONS[i]);
    scores.push(a1.ev.score); lines.push(a1.ev.feedback);
    const fu = await AI.followUp(i, a1.transcript);
    const a2 = await answerOnce(fu);
    scores.push(a2.ev.score);
    sub('면접관: 잘 들었습니다.');
    await AI.speak('잘 들었습니다.');
  }
  telemetry.stop();
  sub('면접관: 수고하셨습니다. 결과를 정리하겠습니다.');
  await AI.speak('수고하셨습니다. 결과를 정리하겠습니다.');

  const content = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const body = telemetry.bodyScore();
  const r = telemetry.results();
  const total = Math.round(0.5 * content + 0.3 * body + 0.2 * attire.score);
  const grade = total >= 90 ? 'S' : total >= 80 ? 'A' : total >= 70 ? 'B' : 'C';
  lines.push(attire.feedback);
  lines.push(`시선 접촉 ${Math.round(r.eyePct * 100)}% · 인사 ${r.bows}회`);
  world.showPanel('report', { content, body, attire: attire.score, total, grade, lines: lines.slice(0, 4) });
  sub(`종합 ${total}점 (${grade}) — 패널의 [다시 하기]로 재시도`);
  waitForButton('restart'); // handled in handleButton via location.reload()
}

// boot from dress room
(async () => {
  sub('머리·복장·지원 분야를 고르고 [면접 시작]을 누르세요.');
  await waitForButton('start');
  runInterview();
})();

// ---------- frame loop ----------
const clock = new THREE.Clock();
let booted = false;
setInterval(() => {
  hud.style.display = 'block';
  hud.textContent = telemetry.hudText();
}, 250);
renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.1);
  telemetry.sample(camera, world.interviewerHead(), dt);
  world.update(dt, AI.isSpeaking());
  renderer.render(scene, camera);
  if (!booted) { booted = true; document.body.dataset.boot = 'ok'; }
});
