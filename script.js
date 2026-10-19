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
}

// 打开页面时，天数从 0 滚到真实值
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

// 先算出真实天数
const now = new Date();
const realDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

// 从 0 开始滚
const daysEl = document.getElementById("days");
daysEl.textContent = "0";
setTimeout(() => {
  animateNumber(daysEl, realDays, 3500);   // 2.5 秒滚完
}, 300);

// 之后每秒更新（但不再滚动，直接显示真实值）
setTimeout(() => {
  updateCounter();
  setInterval(updateCounter, 1000);
}, 3800);


/* ========== 2. 默认主题（永远浪漫） ========== */
const themeBtn = document.getElementById("theme-btn");
themeBtn.textContent = "🌸";
//document.body.classList.add("theme-fun");
//themeBtn.textContent = "👑";


/* ========== 3. 掉落物 ========== */
const sakuraContainer = document.getElementById("sakura");
const PETAL_COUNT = 25;
const PETAL_INTERVAL = 1500;
const MAX_PETALS = 25;

/* 万兽之王主题的掉落物 emoji */
const FUN_ICONS = ["🐺", "🦁", "🐯", "👑", "⚔️"];

/* 如果你有 PNG 图片，用这个替换上面那行：
const FUN_ICONS = [
  "images/wolf.png",
  "images/lion.png",
  "images/crown.png"
];
*/

const USE_IMAGE = false;   // 用 emoji 就保持 false；用 PNG 就改成 true

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
      petal.style.width = (size + 12) + "px";
      petal.style.height = (size + 12) + "px";
      petal.style.backgroundImage = `url(${pick})`;
    } else {
      petal.style.width = (size + 14) + "px";
      petal.style.height = (size + 14) + "px";
      petal.style.fontSize = (size + 8) + "px";
      petal.textContent = pick;
    }
  } else {
    petal.style.width = size + "px";
    petal.style.height = size + "px";
  }

  petal.style.left = Math.random() * 100 + "vw";

  const duration = Math.random() * 8 + 8; // 8~16 秒
  petal.style.animationDuration = duration + "s";

  if (instant) {
    petal.style.animationDelay = (-Math.random() * duration) + "s";
  } else {
    petal.style.animationDelay = Math.random() * 2 + "s";
  }

  petal.style.opacity = Math.random() * 0.5 + 0.4;

  // 动画结束删掉
  petal.addEventListener("animationend", () => {
    petal.remove();
  });

  sakuraContainer.appendChild(petal);
}

function fillPetals() {
  sakuraContainer.innerHTML = "";
  for (let i = 0; i < PETAL_COUNT; i++) {
    createPetal(true);
  }
}

fillPetals();

// 用一个变量存定时器
let petalTimer = setInterval(() => createPetal(false), PETAL_INTERVAL);

// 监听页面可见性（切换标签页/切后台）
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // 切到后台：暂停生成新花瓣
    clearInterval(petalTimer);
  } else {
    // 切回前台：恢复生成新花瓣
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
}, {
  threshold: 0,
  rootMargin: "-50px 0px -50px 0px"
});

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


/* ========== 6. 主题切换 ========== */
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("theme-fun");
  const isFun = document.body.classList.contains("theme-fun");
  themeBtn.textContent = isFun ? "👑" : "🌸";
  fillPetals();
});

/* ========== 7. 里程碑进度条 ========== */
const TOTAL_DAYS = 3650;   // 10 年
const milestoneFill = document.getElementById("milestone-fill");
const milestoneMarker = document.getElementById("milestone-marker");
const milestoneLabels = document.getElementById("milestone-labels");
const milestoneBar = document.querySelector(".milestone-bar");

// 生成 11 个节点：0, 365, 730, ... 3650
const NODE_COUNT = 11;
const nodes = [];

for (let i = 0; i < NODE_COUNT; i++) {
  const day = Math.round((TOTAL_DAYS / (NODE_COUNT - 1)) * i);
  const percent = (day / TOTAL_DAYS) * 100;

  // 节点
  const node = document.createElement("div");
  node.className = "milestone-node";
  node.style.left = percent + "%";
  node.dataset.day = day;
  milestoneBar.appendChild(node);
  nodes.push(node);

  // 标签
  const label = document.createElement("div");
  label.className = "milestone-label";
  label.style.left = percent + "%";
  label.dataset.day = day;
  if (i === 0) {
    label.textContent = "相遇";
  } else {
    label.textContent = (day / 365).toFixed(0) + "年";
  }
  milestoneLabels.appendChild(label);
}

// 计算当前天数
function getCurrentDays() {
  const now = new Date();
  const diff = now - startDate;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// 更新进度条
function updateMilestone() {
  const days = getCurrentDays();
  const percent = Math.min((days / TOTAL_DAYS) * 100, 100);

  requestAnimationFrame(() => {
    milestoneFill.style.width = percent + "%";
    milestoneMarker.style.left = percent + "%";
  });

  const labelEls = milestoneLabels.querySelectorAll(".milestone-label");
  const startTime = performance.now();
  const DURATION = 2500;

  function step(now) {
    const progress = Math.min((now - startTime) / DURATION, 1);
    const currentDay = days * progress;

    nodes.forEach((node, i) => {
      const nodeDay = parseInt(node.dataset.day);

      if (nodeDay <= currentDay) {
        if (!node.classList.contains("passed")) {
          node.classList.add("passed");
          if (labelEls[i]) labelEls[i].classList.add("passed");
        }
      }
    });

    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// 页面加载时启动
window.addEventListener("load", () => {
  // 先让进度条从 0 开始
  milestoneFill.style.width = "0%";
  milestoneMarker.style.left = "0%";
  // 稍等一下再推进
  setTimeout(updateMilestone, 300);
});

/* ========== 倒计时逻辑 ========== */
const START_YEAR = 2023;       // 在一起的那一年
const HER_BIRTH_YEAR = 2005;   // Ms Cindy 出生年
const HIS_BIRTH_YEAR = 2001;   // Mr Tang 出生年

const HER_BIRTHDAY = { month: 5, day: 3 };   
const HIS_BIRTHDAY = { month: 0, day: 26 };  
const ANNIVERSARY = { month: 0, day: 5 };    

function getDaysUntil(targetMonth, targetDay) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  let target = new Date(now.getFullYear(), targetMonth, targetDay);

  if (target < now) {
    target = new Date(now.getFullYear() + 1, targetMonth, targetDay);
  }

  const diffTime = target - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function updateCountdowns() {
  const now = new Date();
  const currentYear = now.getFullYear();

  const cdAnniversary = document.getElementById("cd-anniversary");
  const cdHer = document.getElementById("cd-her");
  const cdHim = document.getElementById("cd-him");
  
  const titleAnniversary = document.getElementById("title-anniversary");
  const titleHer = document.getElementById("title-her");
  const titleHim = document.getElementById("title-him");

  // 1. 算天数
  if (cdAnniversary) cdAnniversary.textContent = getDaysUntil(ANNIVERSARY.month, ANNIVERSARY.day);
  if (cdHer) cdHer.textContent = getDaysUntil(HER_BIRTHDAY.month, HER_BIRTHDAY.day);
  if (cdHim) cdHim.textContent = getDaysUntil(HIS_BIRTHDAY.month, HIS_BIRTHDAY.day);

  // 2. 算“接下来的”周年数和岁数
  
  // --- 周年纪念 ---
  // 如果今年的纪念日还没过，就是今年的；如果过了，就是明年的
  let nextAnnYear = currentYear;
  let annDateThisYear = new Date(currentYear, ANNIVERSARY.month, ANNIVERSARY.day);
  if (now > annDateThisYear) {
    nextAnnYear = currentYear + 1;
  }
  const anniversaryCount = nextAnnYear - START_YEAR;
  if (titleAnniversary) {
    titleAnniversary.textContent = anniversaryCount === 1 ? "距离 1 周年纪念" : `距离 ${anniversaryCount} 周年纪念`;
  }

  // --- Ms Cindy 生日 ---
  let nextHerYear = currentYear;
  let herDateThisYear = new Date(currentYear, HER_BIRTHDAY.month, HER_BIRTHDAY.day);
  if (now > herDateThisYear) {
    nextHerYear = currentYear + 1;
  }
  const herAge = nextHerYear - HER_BIRTH_YEAR;
  if (titleHer) {
    titleHer.textContent = `距离Cindy ${herAge}岁生日`;
  }

  // --- Mr Tang 生日 ---
  let nextHimYear = currentYear;
  let himDateThisYear = new Date(currentYear, HIS_BIRTHDAY.month, HIS_BIRTHDAY.day);
  if (now > himDateThisYear) {
    nextHimYear = currentYear + 1;
  }
  const hisAge = nextHimYear - HIS_BIRTH_YEAR;
  if (titleHim) {
    titleHim.textContent = `距离Tang ${hisAge}岁生日`;
  }
}

updateCountdowns();
setInterval(updateCountdowns, 1000 * 60 * 60);  // 每小时刷新一次

/* ========== 8. 照片墙自动生成 ========== */
const wallPhotos = [
  "images/photo1.jpg",
  "images/photo2.jpg",
  "images/photo3.jpg",
  "images/photo4.jpg",
  "images/photo5.jpg",
  "images/photo6.jpg"
];

const photoWall = document.getElementById("photo-wall");
if (photoWall) {
  wallPhotos.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "我们的照片";
    
    // 复用你原来的 lightbox 放大功能
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightbox.classList.add("show");
    });

    photoWall.appendChild(img);
  });
}
