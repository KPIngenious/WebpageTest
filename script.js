/* ========== 1. 天数 + 年月日时分秒 ========== */
// 改这里：把日期改成你们在一起的日期
const startDate = new Date("2023-01-05T00:00:00");

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

  document.getElementById("detail").textContent =
    `${years} 年 ${months} 月 ${days} 天 ${hours} 小时 ${minutes} 分 ${seconds} 秒`;
}

updateCounter();
setInterval(updateCounter, 1000);

/* ========== 2. 樱花花瓣 ========== */
const sakuraContainer = document.getElementById("sakura");
const PETAL_COUNT = 25;  // 想花瓣多一点就改大

function createPetal() {
  const petal = document.createElement("div");
  petal.className = "petal";

  const size = Math.random() * 12 + 8;
  petal.style.width = size + "px";
  petal.style.height = size + "px";

  petal.style.left = Math.random() * 100 + "vw";

  const duration = Math.random() * 8 + 8;
  petal.style.animationDuration = duration + "s";
  petal.style.animationDelay = Math.random() * 10 + "s";
  petal.style.opacity = Math.random() * 0.5 + 0.4;

  sakuraContainer.appendChild(petal);
}

for (let i = 0; i < PETAL_COUNT; i++) {
  createPetal();
}

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