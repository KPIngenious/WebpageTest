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

  const diffMs = now - startDate;
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const daysEl = document.getElementById("days");
  if (daysEl) daysEl.textContent = totalDays.toLocaleString();

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

  // ---- 全屏时钟模式的数据同步 ----
  const clockDaysEl = document.getElementById("clock-days");
  if (clockDaysEl) clockDaysEl.textContent = totalDays.toLocaleString();
  
  const clockDetailEl = document.getElementById("clock-detail");
  if (clockDetailEl) clockDetailEl.textContent = `${years}年${months}月${days}天`;

  const clockTimeEl = document.getElementById("clock-time");
  if (clockTimeEl) {
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    clockTimeEl.textContent = `${hh}:${mm}:${ss}`;
  }
}

// 初始滚动动画
function animateNumber(el, target, duration = 3.5) {
  const startTime = performance.now();
  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(target * progress);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const nowInit = new Date();
const realDays = Math.floor((nowInit - startDate) / (1000 * 60 * 60 * 24));
const daysEl = document.getElementById("days");
daysEl.textContent = "0";
setTimeout(() => { animateNumber(daysEl, realDays, 3500); }, 300);

setTimeout(() => {
  updateCounter();
  setInterval(updateCounter, 1000);
}, 3800);


/* ========== 2. 默认主题与切换 ========== */
const themeBtn = document.getElementById("theme-btn");
themeBtn.textContent = "🌸";

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("theme-fun");
  const isFun = document.body.classList.contains("theme-fun");
  themeBtn.textContent = isFun ? "👑" : "🌸";
  fillPetals();
});


/* ========== 3. 掉落物 ========== */
const sakuraContainer = document.getElementById("sakura");
const PETAL_COUNT = 25;
const PETAL_INTERVAL = 1500;
const MAX_PETALS = 25;
const FUN_ICONS = ["🐺", "🦁", "🐯", "👑", "⚔️"];
const USE_IMAGE = false;

function createPetal(instant) {
  if (sakuraContainer.children.length >= MAX_PETALS) return;
  const isFun = document.body.classList.contains("theme-fun");
  const petal = document.createElement("div");
  petal.className = "petal";
  const size = Math.random() * 12 + 8;

  if (isFun) {
    petal.classList.add("img-petal");
    const pick = FUN_ICONS[Math.floor(Math.random() * FUN_ICONS.length)];
    if (USE_IMAGE) {
      petal.style.width = (size + 12) + "px"; petal.style.height = (size + 12) + "px";
      petal.style.backgroundImage = `url(${pick})`;
    } else {
      petal.style.width = (size + 14) + "px"; petal.style.height = (size + 14) + "px";
      petal.style.fontSize = (size + 8) + "px"; petal.textContent = pick;
    }
  } else {
    petal.style.width = size + "px"; petal.style.height = size + "px";
  }

  petal.style.left = Math.random() * 100 + "vw";
  const duration = Math.random() * 8 + 8;
  petal.style.animationDuration = duration + "s";

  if (instant) {
    petal.style.animationDelay = (-Math.random() * duration) + "s";
  } else {
    petal.style.animationDelay = Math.random() * 2 + "s";
  }
  petal.style.opacity = Math.random() * 0.5 + 0.4;

  petal.addEventListener("animationend", () => { petal.remove(); });
  sakuraContainer.appendChild(petal);
}

function fillPetals() {
  sakuraContainer.innerHTML = "";
  for (let i = 0; i < PETAL_COUNT; i++) createPetal(true);
}

fillPetals();
let petalTimer = setInterval(() => createPetal(false), PETAL_INTERVAL);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    clearInterval(petalTimer);
  } else {
    petalTimer = setInterval(() => createPetal(false), PETAL_INTERVAL);
  }
});


/* ========== 4. 滚动淡入 + 淡出 ========== */
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
}, { threshold: 0, rootMargin: "-50px 0px -50px 0px" });

events.forEach(event => observer.observe(event));


/* ========== 5. 图片点击放大 ========== */
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


/* ========== 6. 里程碑进度条（双端同步） ========== */
const TOTAL_DAYS = 3650;
const NODE_COUNT = 11;

const mainNodes = [];
const clockNodes = [];

// 生成两套里程碑（主页面 + 全屏模式）
for (let i = 0; i < NODE_COUNT; i++) {
  const day = Math.round((TOTAL_DAYS / (NODE_COUNT - 1)) * i);
  const percent = (day / TOTAL_DAYS) * 100;
  const labelText = i === 0 ? "相遇" : (day / 365).toFixed(0) + "年";

  // 1. 主页面里程碑
  const mainBar = document.querySelector(".milestone-bar");
  const mainLabels = document.getElementById("milestone-labels");
  
  const mNode = document.createElement("div");
  mNode.className = "milestone-node";
  mNode.style.left = percent + "%";
  mNode.dataset.day = day;
  mainBar.appendChild(mNode);
  mainNodes.push(mNode);

  const mLabel = document.createElement("div");
  mLabel.className = "milestone-label";
  mLabel.style.left = percent + "%";
  mLabel.dataset.day = day;
  mLabel.textContent = labelText;
  mainLabels.appendChild(mLabel);

  // 2. 全屏模式里程碑
  const clockBar = document.querySelector(".clock-milestone .milestone-bar");
  const clockLabels = document.getElementById("clock-milestone-labels");

  if (clockBar && clockLabels) {
    const cNode = document.createElement("div");
    cNode.className = "milestone-node";
    cNode.style.left = percent + "%";
    cNode.dataset.day = day;
    clockBar.appendChild(cNode);
    clockNodes.push(cNode);

    const cLabel = document.createElement("div");
    cLabel.className = "milestone-label";
    cLabel.style.left = percent + "%";
    cLabel.dataset.day = day;
    cLabel.textContent = labelText;
    clockLabels.appendChild(cLabel);
  }
}

function getCurrentDays() {
  const now = new Date();
  return Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
}

function updateMilestone() {
  const days = getCurrentDays();
  const percent = Math.min((days / TOTAL_DAYS) * 100, 100);

  const mainFill = document.getElementById("milestone-fill");
  const mainMarker = document.getElementById("milestone-marker");
  const clockFill = document.getElementById("clock-milestone-fill");
  const clockMarker = document.getElementById("clock-milestone-marker");

  requestAnimationFrame(() => {
    if (mainFill) mainFill.style.width = percent + "%";
    if (mainMarker) mainMarker.style.left = percent + "%";
    if (clockFill) clockFill.style.width = percent + "%";
    if (clockMarker) clockMarker.style.left = percent + "%";
  });

  const mainLabelEls = document.querySelectorAll("#milestone-labels .milestone-label");
  const clockLabelEls = document.querySelectorAll("#clock-milestone-labels .milestone-label");
  
  const startTime = performance.now();
  const DURATION = 3500;

  function step(now) {
    const progress = Math.min((now - startTime) / DURATION, 1);
    const currentDay = days * progress;

    // 点亮主页面节点
    mainNodes.forEach((node, i) => {
      if (parseInt(node.dataset.day) <= currentDay) {
        if (!node.classList.contains("passed")) {
          node.classList.add("passed", "pop");
          setTimeout(() => node.classList.remove("pop"), 600);
          if (mainLabelEls[i]) mainLabelEls[i].classList.add("passed");
        }
      }
    });

    // 点亮全屏节点
    clockNodes.forEach((node, i) => {
      if (parseInt(node.dataset.day) <= currentDay) {
        if (!node.classList.contains("passed")) {
          node.classList.add("passed", "pop");
          setTimeout(() => node.classList.remove("pop"), 600);
          if (clockLabelEls[i]) clockLabelEls[i].classList.add("passed");
        }
      }
    });

    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

window.addEventListener("load", () => {
  const mainFill = document.getElementById("milestone-fill");
  const mainMarker = document.getElementById("milestone-marker");
  const clockFill = document.getElementById("clock-milestone-fill");
  const clockMarker = document.getElementById("clock-milestone-marker");

  if (mainFill) mainFill.style.width = "0%";
  if (mainMarker) mainMarker.style.left = "0%";
  if (clockFill) clockFill.style.width = "0%";
  if (clockMarker) clockMarker.style.left = "0%";

  setTimeout(updateMilestone, 300);
});


/* ========== 7. 倒计时逻辑 ========== */
const START_YEAR = 2023;
const HER_BIRTH_YEAR = 2005;
const HIS_BIRTH_YEAR = 2001;

const HER_BIRTHDAY = { month: 5, day: 3 };   
const HIS_BIRTHDAY = { month: 0, day: 26 };  
const ANNIVERSARY = { month: 0, day: 5 };    

function getDaysUntil(targetMonth, targetDay) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  let target = new Date(now.getFullYear(), targetMonth, targetDay);
  if (target < now) target = new Date(now.getFullYear() + 1, targetMonth, targetDay);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function updateCountdowns() {
  const now = new Date();
  const currentYear = now.getFullYear();

  const cdAnniversary = document.getElementById("cd-anniversary");
  const cdHer = document.getElementById("cd-her");
  const cdHim = document.getElementById("cd-him");
  
  const clockCdAnn = document.getElementById("clock-cd-ann");
  const clockCdHer = document.getElementById("clock-cd-her");
  const clockCdHim = document.getElementById("clock-cd-him");

  const titleAnniversary = document.getElementById("title-anniversary");
  const titleHer = document.getElementById("title-her");
  const titleHim = document.getElementById("title-him");

  const clockTitleAnn = document.getElementById("clock-title-ann");
  const clockTitleHer = document.getElementById("clock-title-her");
  const clockTitleHim = document.getElementById("clock-title-him");

  const daysAnn = getDaysUntil(ANNIVERSARY.month, ANNIVERSARY.day);
  const daysHer = getDaysUntil(HER_BIRTHDAY.month, HER_BIRTHDAY.day);
  const daysHim = getDaysUntil(HIS_BIRTHDAY.month, HIS_BIRTHDAY.day);

  if (cdAnniversary) cdAnniversary.textContent = daysAnn;
  if (cdHer) cdHer.textContent = daysHer;
  if (cdHim) cdHim.textContent = daysHim;
  
  if (clockCdAnn) clockCdAnn.textContent = daysAnn;
  if (clockCdHer) clockCdHer.textContent = daysHer;
  if (clockCdHim) clockCdHim.textContent = daysHim;

  // 周年
  let nextAnnYear = currentYear;
  if (now > new Date(currentYear, ANNIVERSARY.month, ANNIVERSARY.day)) nextAnnYear++;
  const anniversaryCount = nextAnnYear - START_YEAR;
  const annText = anniversaryCount === 1 ? "距离 1 周年纪念" : `距离 ${anniversaryCount} 周年纪念`;
  
  if (titleAnniversary) titleAnniversary.textContent = annText;
  if (clockTitleAnn) clockTitleAnn.textContent = `${anniversaryCount} 周年`;

  // Cindy
  let nextHerYear = currentYear;
  if (now > new Date(currentYear, HER_BIRTHDAY.month, HER_BIRTHDAY.day)) nextHerYear++;
  const herAge = nextHerYear - HER_BIRTH_YEAR;
  
  if (titleHer) titleHer.textContent = `距离Cindy ${herAge}岁生日`;
  if (clockTitleHer) clockTitleHer.textContent = `Cindy ${herAge}岁`;

  // Tang
  let nextHimYear = currentYear;
  if (now > new Date(currentYear, HIS_BIRTHDAY.month, HIS_BIRTHDAY.day)) nextHimYear++;
  const hisAge = nextHimYear - HIS_BIRTH_YEAR;
  
  if (titleHim) titleHim.textContent = `距离Tang ${hisAge}岁生日`;
  if (clockTitleHim) clockTitleHim.textContent = `Tang ${hisAge}岁`;
}

updateCountdowns();
setInterval(updateCountdowns, 1000 * 60 * 60);


/* ========== 8. 全屏模式切换逻辑 ========== */
const fullscreenBtn = document.getElementById("fullscreen-btn");
const clockTimeEl = document.getElementById("clock-time");

fullscreenBtn.addEventListener("click", () => {
  if (!document.body.classList.contains("clock-mode")) {
    // 1. 先强行切换视图（这一步绝对不会被浏览器拦截）
    document.body.classList.add("clock-mode");
    fullscreenBtn.textContent = "✖";
    
    // ★ 强制把时钟变红（如果看到了红色，说明代码绝对执行了）
    if (clockTimeEl) clockTimeEl.style.color = "#ff0000";

    // 2. 然后再尝试请求全屏（即使失败也不影响上面视图的切换）
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen().catch(() => {});
    }

    // 立即更新一次数据
    updateCounter();
    updateCountdowns();
    setTimeout(updateMilestone, 100);
    
  } else {
    // 退出全屏模式
    document.body.classList.remove("clock-mode");
    fullscreenBtn.textContent = "⛶";
    
    // 恢复原本的颜色
    if (clockTimeEl) clockTimeEl.style.color = "";

    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (document.webkitExitFullscreen && document.webkitFullscreenElement) {
      document.webkitExitFullscreen().catch(() => {});
    }
  }
});

// 监听系统自带的全屏退出
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement && document.body.classList.contains("clock-mode")) {
    document.body.classList.remove("clock-mode");
    fullscreenBtn.textContent = "⛶";
    if (clockTimeEl) clockTimeEl.style.color = "";
  }
});
document.addEventListener("webkitfullscreenchange", () => {
  if (!document.webkitFullscreenElement && document.body.classList.contains("clock-mode")) {
    document.body.classList.remove("clock-mode");
    fullscreenBtn.textContent = "⛶";
    if (clockTimeEl) clockTimeEl.style.color = "";
  }
});
