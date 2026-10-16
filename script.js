/* ========== 1. 天数 + 年月日时分秒 ========== */
const startDate = new Date("2023-01-05T00:00:00");

function animateNumber(el, target, duration = 1200) {
  const start = 0;
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(start + (target - start) * progress);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// 在 updateCounter 里，第一次调用时用动画
let firstLoad = true;
const originalUpdate = updateCounter;
updateCounter = function() {
  originalUpdate();
  if (firstLoad) {
    firstLoad = false;
    const days = parseInt(document.getElementById("days").textContent.replace(/,/g, ""));
    animateNumber(document.getElementById("days"), days);
  }
};

function updateCounter() {
  const now = new Date();

  // ---- 总天数 ----
  const diffMs = now - startDate;
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  document.getElementById("days").textContent = totalDays.toLocaleString();

  // ---- 年月日时分秒 ----
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();
  let hours = now.getHours() - startDate.getHours();
  let minutes = now.getMinutes() - startDate.getMinutes();
  let seconds = now.getSeconds() - startDate.getSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--; }
  if (hours < 0)   { hours += 24; days--; }
  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonth;
    months--;
  }
  if (months < 0) { months += 12; years--; }

  // ---- 更新每个数字，并加跳动动画 ----
  updateNum("y", years);
  updateNum("mo", months);
  updateNum("d", days);
  updateNum("h", hours);
  updateNum("mi", minutes);
  updateNum("s", seconds);
}

function updateNum(id, value) {
  const el = document.getElementById(id);
  if (el.textContent !== String(value)) {
    el.textContent = value;
    // 重新触发动画
    el.classList.remove("flip");
    void el.offsetWidth;  // 强制重排，让动画能重新播放
    el.classList.add("flip");
  }
}

updateCounter();
setInterval(updateCounter, 1000);

/* ========== 2. 樱花花瓣 ========== */
const sakuraContainer = document.getElementById("sakura");
const PETAL_COUNT = 25;
const PETAL_INTERVAL = 800;

function createPetal(instant) {
  const petal = document.createElement("div");
  petal.className = "petal";

  const size = Math.random() * 12 + 8;
  petal.style.width = size + "px";
  petal.style.height = size + "px";

  petal.style.left = Math.random() * 100 + "vw";

  const duration = Math.random() * 8 + 8;
  petal.style.animationDuration = duration + "s";

  if (instant) {
    petal.style.animationDelay = (-Math.random() * duration) + "s";
  } else {
    petal.style.animationDelay = Math.random() * 2 + "s";
  }

  petal.style.opacity = Math.random() * 0.5 + 0.4;

  // 关键：动画结束后自动删除这个 div，避免累积
  petal.addEventListener("animationend", () => {
    petal.remove();
  });

  sakuraContainer.appendChild(petal);
}

for (let i = 0; i < PETAL_COUNT; i++) {
  createPetal(true);
}

setInterval(() => createPetal(false), PETAL_INTERVAL);

/* ========== 3. 滚动淡入 ========== */
const events = document.querySelectorAll(".event");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.15 });
events.forEach(event => observer.observe(event));

// script.js 加
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

document.querySelectorAll(".event .card img").forEach(img => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightbox.classList.add("show");
  });
});

lightbox.addEventListener("click", () => {
  lightbox.classList.remove("show");
});
