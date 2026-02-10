// ===== Customize these =====
const TO_NAME = "Babe";       // <-- change
const FROM_NAME = "Your Name"; // <-- change

const MESSAGE_LINES = [
  "Hey " + TO_NAME + " ❤️",
  "",
  "I made you a tiny little page because you’re my favorite person.",
  "You make my ordinary days feel special.",
  "",
  "So I have one important question…"
];
// ===========================

const envelope = document.getElementById("envelope");
const hint = document.getElementById("hint");
const typeTarget = document.getElementById("typeTarget");
const question = document.getElementById("question");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const footerNote = document.getElementById("footerNote");
const toNameEl = document.getElementById("toName");
const fromNameEl = document.getElementById("fromName");

toNameEl.textContent = TO_NAME;
fromNameEl.textContent = FROM_NAME;

// --- Hearts background ---
const heartsWrap = document.querySelector(".hearts");
const heartChars = ["💗","💖","💘","💝","💞","💕"];
function spawnHeart(){
  const h = document.createElement("div");
  h.className = "heart";
  h.textContent = heartChars[Math.floor(Math.random()*heartChars.length)];
  const left = Math.random()*100;
  const size = 14 + Math.random()*18;
  const dur = 6 + Math.random()*7;
  const drift = (Math.random()*120 - 60).toFixed(0) + "px";
  h.style.left = left + "vw";
  h.style.fontSize = size + "px";
  h.style.animationDuration = dur + "s";
  h.style.setProperty("--drift", drift);
  heartsWrap.appendChild(h);
  setTimeout(()=>h.remove(), dur*1000);
}
setInterval(spawnHeart, 320);
for(let i=0;i<8;i++) setTimeout(spawnHeart, i*200);

// --- Typewriter ---
function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }

async function typeLines(lines){
  typeTarget.textContent = "";
  for (let li=0; li<lines.length; li++){
    const line = lines[li];
    for (let i=0; i<line.length; i++){
      typeTarget.textContent += line[i];
      await sleep(22 + Math.random()*25);
    }
    if (li < lines.length - 1) typeTarget.textContent += "\n";
    await sleep(220);
  }
}

let opened = false;

async function openEnvelope(){
  if (opened) return;
  opened = true;
  envelope.classList.add("open");
  hint.textContent = "💌";

  await sleep(650);
  await typeLines(MESSAGE_LINES);

  await sleep(400);
  question.hidden = false;
}

envelope.addEventListener("click", openEnvelope);
envelope.addEventListener("keydown", (e)=>{
  if(e.key === "Enter" || e.key === " ") openEnvelope();
});

// --- Playful "No" button dodge ---
noBtn.addEventListener("mouseenter", ()=>{
  // move within the card area a bit
  const maxX = 160, maxY = 40;
  const x = (Math.random()*maxX - maxX/2);
  const y = (Math.random()*maxY - maxY/2);
  noBtn.style.transform = `translate(${x}px, ${y}px)`;
});
noBtn.addEventListener("click", ()=>{
  noBtn.textContent = "Nice try 😄";
});

// --- Confetti ---
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let confetti = [];
let confettiOn = false;

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function burstConfetti(){
  const count = 220;
  confetti = [];
  for(let i=0;i<count;i++){
    confetti.push({
      x: window.innerWidth/2,
      y: window.innerHeight/3,
      vx: (Math.random()*8 - 4),
      vy: (Math.random()*-10 - 2),
      g: 0.22 + Math.random()*0.10,
      r: 2 + Math.random()*4,
      a: 1
    });
  }
  confettiOn = true;
  requestAnimationFrame(drawConfetti);
  setTimeout(()=>{ confettiOn=false; }, 2500);
}

function drawConfetti(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const p of confetti){
    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.a *= 0.985;

    ctx.globalAlpha = Math.max(0, Math.min(1, p.a));
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  if(confettiOn) requestAnimationFrame(drawConfetti);
}

// Make confetti color vary without setting a fixed palette: use default fillStyle cycling
let hue = 0;
setInterval(()=>{
  hue = (hue + 18) % 360;
  ctx.fillStyle = `hsl(${hue} 90% 60%)`;
}, 60);

yesBtn.addEventListener("click", ()=>{
  footerNote.hidden = false;
  yesBtn.disabled = true;
  noBtn.disabled = true;
  burstConfetti();
});

