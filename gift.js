// ===== Customize these =====
const TO_NAME = "Grace";        // <-- match your index
const FROM_NAME = "Dalen"; // <-- match your index

const GIFT_LINES = [
  "Hey Babe 💖",
  "",
  "I’m so happy you said yes.",
  "I wanted to take this moment to tell you something I’ve been excited about…",
  "",
  "I’m officially coming to visit you:",
  "February 26 – March 3!",
  "",
  "Get ready for hugs, dates, and me being obsessed with you in person 😛"
];
// ===========================

const heartsWrap = document.querySelector(".hearts");
const typeEl = document.getElementById("giftType");
const scrollBox = document.getElementById("giftScroll");
const afterEl = document.getElementById("giftAfter");

document.getElementById("toName2").textContent = TO_NAME;
document.getElementById("fromName2").textContent = FROM_NAME;

// Hearts
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

function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }

async function typeLines(lines){
  typeEl.textContent = "";
  scrollBox.scrollTop = 0;

  for (let li = 0; li < lines.length; li++){
    const line = lines[li];
    for (let i = 0; i < line.length; i++){
      typeEl.textContent += line[i];
      scrollBox.scrollTop = scrollBox.scrollHeight; // auto-scroll
      await sleep(20 + Math.random() * 25);
    }
    if (li < lines.length - 1){
      typeEl.textContent += "\n";
      scrollBox.scrollTop = scrollBox.scrollHeight;
    }
    await sleep(220);
  }
}

(async function init(){
  await sleep(250);
  await typeLines(GIFT_LINES);
  await sleep(350);
  afterEl.hidden = false;
  scrollBox.scrollTop = scrollBox.scrollHeight;
})();
