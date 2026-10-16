/* ========== 1. 天数 + 年月日时分秒 ========== */
const startDate = new Date("2023-01-05T00:00:00");

function updateNum(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el.textContent !== String(value)) {
    el.textContent = value;
    el.classList.remove("flip");
    void el.offsetWidth;
    el.classList.add("flip");
  }
}

function updateCounter() {
  const now = new Date();

  // ---- 总天数 ----
  const diffMs = now - startDate;
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const daysEl = document.getElementById("days");
  if (daysEl) daysEl.textContent = totalDays.toLocaleString();

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

  updateNum("y", years);
  updateNum("mo", months);
  updateNum("d", days);
  updateNum("h", hours);
  updateNum("mi", minutes);
  updateNum("s", seconds);
}

updateCounter();
setInterval(updateCounter, 1000);


/* ========== 2. 樱花花瓣 ========== */
const sakuraContainer = document.getElementById("sakura");
const PETAL_COUNT = 25;
const PETAL_INTERVAL = 800;
const MAX_PETALS = 60;   // 同时存在的花瓣上限

function createPetal(instant) {
  // 达到上限就不生成新的
  if (sakuraContainer.children.length >= MAX_PETALS) {
    return;
  }

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

  // 动画结束自动删除
  petal.addEventListener("animationend", () => {
    petal.remove();
  });

  sakuraContainer.appendChild(petal);
}

for (let i = 0; i < PETAL_COUNT; i++) {
  createPetal(true);
}

setInterval(() => createPetal(false), PETAL_INTERVAL);


/* ========== 3. 滚动淡入 + 淡出 ========== */
const events = document.querySelectorAll(".event");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el = entry.target;

    if (entry.isIntersecting) {
      el.classList.add("show");
      el.classList.remove("fade-out");
    } else {
      const rect = entry.boundingClientRect;
      if (rect.top < 0) {
        el.classList.add("fade-out");
        el.classList.remove("show");
      }
    }
  });
}, {
  threshold: 0,
  rootMargin: "-50px 0px -50px 0px"
});

events.forEach(event => observer.observe(event));


/* ========== 4. 图片点击放大 ========== */
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
