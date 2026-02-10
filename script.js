// ===== Customize these =====
const TO_NAME = "Grace";        // <-- change
const FROM_NAME = "Dalen"; // <-- change

const MESSAGE_LINES = [
  `Hey ${TO_NAME} ❤️`,
  "",
  "I made you a tiny little page because you’re my favorite person.",
  "You make my ordinary days feel special.",
  "",
  "So I have one important question…"
];
// ===========================

// --- Helpers ---
const $ = (sel) => document.querySelector(sel);
const byId = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

// --- Elements ---
const envelope = byId("envelope");
const hint = byId("hint");
const typeTarget = byId("typeTarget");
const letterMessage = $(".letter-message");
const question = byId("question");
const yesBtn = byId("yesBtn");
const noBtn = byId("noBtn");
const footerNote = byId("footerNote");
const toNameEl = byId("toName");
const fromNameEl = byId("fromName");
const flyPhoto = byId("flyPhoto");

// Confetti
const canvas = byId("confetti");
const ctx = canvas?.getContext?.("2d");

// --- Basic sanity check (prevents hard crashes) ---
if (toNameEl) toNameEl.textContent = TO_NAME;
if (fromNameEl) fromNameEl.textContent = FROM_NAME;

// If core parts are missing, bail early (but don’t crash the page)
const coreMissing =
  !envelope || !hint || !typeTarget || !letterMessage || !question || !yesBtn || !noBtn || !footerNote;

if (coreMissing) {
  // Optional: console warning for debugging
  console.warn("Missing required DOM elements. Check your HTML IDs/classes.");
} else {
  // --- Hearts background ---
  const heartsWrap = $(".hearts");
  const heartChars = ["💗", "💖", "💘", "💝", "💞", "💕"];

  function spawnHeart() {
    if (!heartsWrap) return;
    const h = document.createElement("div");
    h.className = "heart";
    h.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];

    const left = Math.random() * 100;      // vw
    const size = 14 + Math.random() * 18;  // px
    const dur = 6 + Math.random() * 7;     // s
    const drift = `${(Math.random() * 120 - 60).toFixed(0)}px`;

    h.style.left = `${left}vw`;
    h.style.fontSize = `${size}px`;
    h.style.animationDuration = `${dur}s`;
    h.style.setProperty("--drift", drift);

    heartsWrap.appendChild(h);
    window.setTimeout(() => h.remove(), dur * 1000);
  }

  if (!prefersReducedMotion) {
    window.setInterval(spawnHeart, 320);
    for (let i = 0; i < 8; i++) window.setTimeout(spawnHeart, i * 200);
  }

  // --- Typewriter ---
  async function typeLines(lines) {
    typeTarget.textContent = "";
    letterMessage.scrollTop = 0;

    for (let li = 0; li < lines.length; li++) {
      const line = lines[li];

      for (let i = 0; i < line.length; i++) {
        typeTarget.textContent += line[i];
        letterMessage.scrollTop = letterMessage.scrollHeight;

        // If reduced motion, type faster / instantly
        if (prefersReducedMotion) continue;
        await sleep(20 + Math.random() * 25);
      }

      if (li < lines.length - 1) {
        typeTarget.textContent += "\n";
        letterMessage.scrollTop = letterMessage.scrollHeight;
      }

      if (!prefersReducedMotion) await sleep(220);
    }
  }

  // --- Envelope open logic ---
  let opened = false;

  async function openEnvelope() {
    if (opened) return;
    opened = true;

    envelope.classList.add("open");
    hint.textContent = "💌";

    // Wait until the letter has slid out a bit (matches CSS transition)
    if (!prefersReducedMotion) await sleep(900);

    await typeLines(MESSAGE_LINES);

    if (!prefersReducedMotion) await sleep(400);
    question.hidden = false;
  }

  envelope.addEventListener("click", openEnvelope);

  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // prevents page scroll on Space
      openEnvelope();
    }
  });

  // --- Playful "No" button dodge ---
  // Note: this sets inline transform, which overrides .btn:active transform while hovered.
  // If you ever want BOTH, we can convert this to CSS variables.
  noBtn.addEventListener("mouseenter", () => {
    const maxX = 160, maxY = 40;
    const x = Math.random() * maxX - maxX / 2;
    const y = Math.random() * maxY - maxY / 2;
    noBtn.style.transform = `translate(${x}px, ${y}px)`;
  });

  noBtn.addEventListener("click", () => {
    noBtn.textContent = "Nice try 😄";
  });

  // --- Confetti ---
  let confetti = [];
  let confettiOn = false;
  let hue = 0;

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  function burstConfetti() {
    if (!canvas || !ctx || prefersReducedMotion) return;

    const count = 220;
    confetti = [];

    for (let i = 0; i < count; i++) {
      confetti.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 3,
        vx: Math.random() * 8 - 4,
        vy: Math.random() * -10 - 2,
        g: 0.22 + Math.random() * 0.10,
        r: 2 + Math.random() * 4,
        a: 1
      });
    }

    confettiOn = true;
    requestAnimationFrame(drawConfetti);

    window.setTimeout(() => { confettiOn = false; }, 2500);
  }

  function drawConfetti() {
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of confetti) {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.a *= 0.985;

      ctx.globalAlpha = Math.max(0, Math.min(1, p.a));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    if (confettiOn) requestAnimationFrame(drawConfetti);
  }

  // Animate confetti color (simple cycling)
  if (ctx && !prefersReducedMotion) {
    window.setInterval(() => {
      hue = (hue + 18) % 360;
      ctx.fillStyle = `hsl(${hue} 90% 60%)`;
    }, 60);
  }

  // --- Yes button ---
  yesBtn.addEventListener("click", () => {
    footerNote.hidden = false;
    yesBtn.disabled = true;
    noBtn.disabled = true;

    burstConfetti();

    // fly the photo across the screen
    if (flyPhoto) {
      flyPhoto.classList.remove("fly"); // reset if needed
      void flyPhoto.offsetWidth;        // force reflow
      flyPhoto.classList.add("fly");
    }
  });
}
