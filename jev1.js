/* ========== CONFIGURATION ========== */
let BIRTHDAY_NAME = "JEVAN";
const LOGIN_PASSWORD = "jevan112233";
const MULTO_SRC = "Multo - Cup of Joe (Official Lyric Video).mp3";

/* --- HELPER: SHOW PAGE --- */
function showPage(id) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));

  const target = document.getElementById(id);
  target.classList.add("active");
  target.scrollTop = 0;

  const header = document.getElementById("mainHeader");
  if (id !== "page-login") {
    header.style.display = "flex";
  } else {
    header.style.display = "none";
  }
}

/* --- 1. LOGIN SYSTEM --- */
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const val = document.getElementById("loginPassword").value;
  if (val === LOGIN_PASSWORD) {
    showPage("page-1");
    tryPlayBGM();
  } else {
    document.getElementById("loginError").style.display = "block";
  }
});

/* --- 2. SETUP NAMA --- */
document.getElementById("name-display").textContent = BIRTHDAY_NAME;
document.getElementById("endName").textContent = BIRTHDAY_NAME;

/* --- 3. AUDIO BGM (LOGIKA IKON & PLAYER) --- */
const bgm = document.getElementById("bgm");
bgm.volume = 0.5;

function tryPlayBGM() {
  bgm
    .play()
    .then(() => {
      document.getElementById("musicToggle").textContent = "🔊";
    })
    .catch((e) => {
      console.log("Autoplay blocked");
      document.getElementById("musicToggle").textContent = "🔇";
    });
}

function forcePlayMusic() {
  if (bgm.paused) {
    bgm.play().catch((e) => console.log("Force play blocked"));
    document.getElementById("musicToggle").textContent = "🔊";
  }
}

document.getElementById("musicToggle").addEventListener("click", () => {
  if (bgm.paused) {
    bgm.play();
    document.getElementById("musicToggle").textContent = "🔊";
  } else {
    bgm.pause();
    document.getElementById("musicToggle").textContent = "🔇";
  }
});

/* --- 4. NAVIGATION FLOW --- */
document.getElementById("btn-play").addEventListener("click", () => {
  playTudum();
  showPage("page-profiles");
});

document.getElementById("profile-jevan").addEventListener("click", () => {
  playTudum();
  showPage("page-2");
});

document.querySelectorAll(".dummy-profile").forEach((el) => {
  el.addEventListener("click", () => {
    el.style.transform = "scale(0.95)";
    setTimeout(() => (el.style.transform = "scale(1)"), 150);
  });
});

document.getElementById("hero-play-button").addEventListener("click", () => {
  showPage("page-video");
  const v = document.getElementById("ep4-video");
  v.play().catch((e) => console.log(e));
});

/* --- 5. MODAL / POPUP PHOTO LOGIC (DINAMIS) --- */
let currentModalElement = null;
const modal = document.getElementById("epModal");
const modalMedia = document.getElementById("modalMedia");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");

function openModal(el) {
  currentModalElement = el;
  const imgUrl = el.style.backgroundImage.slice(5, -2).replace(/['"]/g, "");

  const titleText = el.getAttribute("data-title") || "Our Memory";
  const descText =
    el.getAttribute("data-desc") ||
    "Klik 'Next Photo' untuk melihat foto selanjutnya.";

  modalMedia.innerHTML = `<img src="${imgUrl}" style="max-width:100%; max-height:100%; border-radius:4px; object-fit:contain;">`;
  modalTitle.textContent = titleText;
  modalDesc.textContent = descText;

  modal.classList.add("show");
}

function closeModal() {
  modal.classList.remove("show");
  currentModalElement = null;
}

document.querySelectorAll(".clickable-poster").forEach((p) => {
  p.addEventListener("click", () => openModal(p));
});
document.getElementById("modalClose").addEventListener("click", closeModal);

document.getElementById("modalNext").addEventListener("click", () => {
  if (!currentModalElement) return;
  const parent = currentModalElement.parentElement;
  const siblings = Array.from(parent.querySelectorAll(".clickable-poster"));
  const idx = siblings.indexOf(currentModalElement);
  const next = siblings[(idx + 1) % siblings.length];
  openModal(next);
});

/* --- 6. VIDEO 1 LOGIC (Next Episode) --- */
const vid1 = document.getElementById("ep4-video");
vid1.addEventListener("ended", () => {
  document.getElementById("videoOverlay").classList.add("show");
});
document.getElementById("videoReplay").addEventListener("click", () => {
  document.getElementById("videoOverlay").classList.remove("show");
  vid1.currentTime = 0;
  vid1.play();
});
document.getElementById("videoBack").addEventListener("click", () => {
  document.getElementById("videoOverlay").classList.remove("show");
  vid1.pause();
  showPage("page-2");
  forcePlayMusic();
});

document.getElementById("toNextEp").addEventListener("click", () => {
  document.getElementById("videoOverlay").classList.remove("show");
  vid1.pause();

  showPage("page-found");

  const vid2 = document.getElementById("ep5-video");
  vid2.currentTime = 0;
  vid2.play().catch((e) => console.log("Autoplay blocked on found page", e));

  forcePlayMusic();
});

/* --- 7. FOUND MOVIE PAGE LOGIC --- */
document.getElementById("btn-continue").addEventListener("click", () => {
  const vid2 = document.getElementById("ep5-video");
  vid2.pause();

  showPage("page-5");
  startFireworks();
});

document.getElementById("btn-back-home").addEventListener("click", () => {
  const vid2 = document.getElementById("ep5-video");
  vid2.pause();
  showPage("page-2");
});

/* --- 8. ENDING LOGIC --- */
document.getElementById("endingReplay").addEventListener("click", () => {
  stopFireworks();
  showPage("page-video");
});
document.getElementById("endingHome").addEventListener("click", () => {
  stopFireworks();
  showPage("page-2");
});

/* --- 9. FIREWORKS EFFECT --- */
const canvas = document.getElementById("fwCanvas");
const ctx = canvas.getContext("2d");
let fwInterval;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function startFireworks() {
  let particles = [];
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.alpha -= 0.01;
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fillRect(p.x, p.y, 3, 3);
      if (p.alpha <= 0) particles.splice(i, 1);
    });
    requestAnimationFrame(loop);
  }
  loop();
  fwInterval = setInterval(() => {
    const x = Math.random() * canvas.width;
    const y = (Math.random() * canvas.height) / 2;
    const color = `${Math.floor(Math.random() * 255)},${Math.floor(
      Math.random() * 255
    )},${Math.floor(Math.random() * 255)}`;
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        alpha: 1,
        color: color,
      });
    }
  }, 800);
}
function stopFireworks() {
  clearInterval(fwInterval);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* --- 10. SOUND EFFECT (TUDUM) --- */
function playTudum() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = 150;
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
  osc.stop(audioCtx.currentTime + 0.5);
}

/* --- 11. GENERATE STATIC STARS --- */
function createStars() {
  const nightContainer = document.querySelector(".night");
  if (!nightContainer) return;

  for (let i = 0; i < 100; i++) {
    const star = document.createElement("div");
    star.classList.add("star-static");
    const x = Math.random() * 100 + "%";
    const y = Math.random() * 100 + "%";
    const size = Math.random() * 2 + 1 + "px";
    const duration = Math.random() * 3 + 2 + "s";
    const delay = Math.random() * 5 + "s";
    star.style.left = x;
    star.style.top = y;
    star.style.width = size;
    star.style.height = size;
    star.style.setProperty("--duration", duration);
    star.style.setProperty("--delay", delay);
    nightContainer.appendChild(star);
  }
}
createStars();

/* --- 12. LOGIKA PINTAR: MUSIK & VIDEO (REVISI FINAL) --- */
// 1. VIDEO UTAMA (Ada Suara) -> Mute Musik
const mainVideo = document.getElementById("ep4-video");

mainVideo.addEventListener("play", () => {
  bgm.pause();
  document.getElementById("musicToggle").textContent = "🔇";
});

mainVideo.addEventListener("pause", forcePlayMusic);
mainVideo.addEventListener("ended", forcePlayMusic);
