const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

const products = {
  rg2: {
    image: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/products/rg2-cutout.webp",
    alt: "人参组培不定根固体饮料真实包装",
    kicker: "RG2 · 人参组培不定根固体饮料",
    note: "净含量 30g（1g×30袋）"
  },
  lushen: {
    image: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/products/lushen-cutout.webp",
    alt: "人参组培不定根鹿肾丸真实包装",
    kicker: "鹿肾丸 · 人参组培不定根鹿肾丸",
    note: "蜂产品制品 · 净含量 18g（6g×3）"
  }
};

const posterData = [
  { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/posters/rg2-01.webp", type: "rg2", label: "产品封面 · RG2 植物干细胞", height: 2100 },
  { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/posters/rg2-02.webp", type: "rg2", label: "五大核心优势", height: 1050 },
  { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/posters/rg2-03.webp", type: "rg2", label: "植物干细胞技术", height: 1350 },
  { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/posters/rg2-04.webp", type: "rg2", label: "植物干细胞技术五大特性", height: 650 },
  { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/posters/rg2-05.webp", type: "rg2", label: "植物干细胞产品价值", height: 1950 },
  { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/posters/rg2-06.webp", type: "rg2", label: "稀有人参皂苷", height: 1350 },
  { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/posters/rg2-07.webp", type: "rg2", label: "高科技专利技术", height: 1330 },
  { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/posters/rg2-08.webp", type: "rg2", label: "野山参干细胞", height: 870 },
  { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/posters/rg2-09.webp", type: "rg2", label: "科学精准配比", height: 900 },
  { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/posters/rg2-10.webp", type: "rg2", label: "高纯度 · 精准吸收", height: 1950 },
  { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/posters/rg2-11.webp", type: "rg2", label: "功效评价与认证证书", height: 4920 },
  { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/posters/rg2-12.webp", type: "rg2", label: "世界冠军代言 · 产品信息", height: 2369 },
  { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/posters/lushen-01.webp", type: "lushen", label: "产品封面 · 鹿肾丸", height: 1200 },
  { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/posters/lushen-02.webp", type: "lushen", label: "五大优势", height: 900 },
  { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/posters/lushen-03.webp", type: "lushen", label: "植物干细胞技术", height: 1500 },
  { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/posters/lushen-04.webp", type: "lushen", label: "生物学特征五大特性", height: 1400 },
  { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/posters/lushen-05.webp", type: "lushen", label: "严苛标准 · 标准量产", height: 700 },
  { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/posters/lushen-06.webp", type: "lushen", label: "精选原料图鉴", height: 2770 },
  { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/posters/lushen-07.webp", type: "lushen", label: "产品展示 · 产品信息", height: 3404 }
];

const toast = document.querySelector(".toast");
let toastTimer;

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function setTheme(theme, announce = false) {
  const safeTheme = ["jade", "ivory", "noir"].includes(theme) ? theme : "jade";
  root.dataset.theme = safeTheme;
  localStorage.setItem("plant-hill-theme", safeTheme);
  document.querySelectorAll("[data-theme-option]").forEach((button) => {
    const active = button.dataset.themeOption === safeTheme;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  const colors = { jade: "#071712", ivory: "#efe6d7", noir: "#070809" };
  const names = { jade: "墨绿鎏金", ivory: "象牙朱砂", noir: "玄黑香槟" };
  document.querySelector('meta[name="theme-color"]').setAttribute("content", colors[safeTheme]);
  if (announce) showToast(`已切换至 ${names[safeTheme]}`);
}

const queryTheme = new URLSearchParams(window.location.search).get("theme");
setTheme(queryTheme || localStorage.getItem("plant-hill-theme") || "jade");

document.querySelectorAll("[data-theme-option]").forEach((button) => {
  button.addEventListener("click", () => setTheme(button.dataset.themeOption, true));
});

document.querySelectorAll("[data-product-choice]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.productChoice;
    const product = products[key];
    document.querySelectorAll("[data-product-choice]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });

    const image = document.querySelector("[data-gift-image]");
    image.src = product.image;
    image.alt = product.alt;
    document.querySelector("[data-product-kicker]").textContent = product.kicker;
    document.querySelector("[data-product-note]").textContent = product.note;
  });
});

function buildParticles() {
  const field = document.querySelector("#particle-field");
  if (field.childElementCount) return;
  const colors = ["#f6deaa", "#d4b36e", "#fff8e5", "#b88b4a"];
  const count = reduceMotion ? 12 : 32;

  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement("span");
    const angle = (Math.PI * 2 * index) / count + Math.random() * 0.45;
    const distance = 90 + Math.random() * 210;
    particle.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--dy", `${Math.sin(angle) * distance - 90}px`);
    particle.style.setProperty("--size", `${2 + Math.random() * 7}px`);
    particle.style.setProperty("--delay", `${Math.random() * 0.24}s`);
    particle.style.setProperty("--spark-color", colors[index % colors.length]);
    field.appendChild(particle);
  }
}

const gift = document.querySelector("#luxe-gift");
const giftToggle = document.querySelector("#gift-toggle");
let giftOpen = false;
let particleTimer;

function triggerGiftEffect() {
  buildParticles();
  const field = document.querySelector("#particle-field");
  const pulse = document.querySelector(".gift-pulse");
  field.classList.remove("is-active");
  pulse.classList.remove("is-active");
  void field.offsetWidth;
  field.classList.add("is-active");
  pulse.classList.add("is-active");
  window.clearTimeout(particleTimer);
  particleTimer = window.setTimeout(() => {
    field.classList.remove("is-active");
    pulse.classList.remove("is-active");
  }, 1600);
}

function setGiftOpen(open) {
  giftOpen = open;
  gift.classList.toggle("is-open", open);
  giftToggle.setAttribute("aria-expanded", String(open));
  giftToggle.querySelector(".gift-toggle__text").textContent = open ? "合上礼盒" : "开启礼盒";
  if (open) {
    triggerGiftEffect();
  } else {
    window.clearTimeout(particleTimer);
    document.querySelector("#particle-field").classList.remove("is-active");
    document.querySelector(".gift-pulse").classList.remove("is-active");
  }
}

document.querySelectorAll("[data-open-gift]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button === giftToggle && giftOpen) {
      setGiftOpen(false);
      return;
    }
    setGiftOpen(true);
    if (button !== giftToggle) {
      document.querySelector(".hero__visual").scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
});

document.querySelectorAll("[data-scroll-to]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(button.dataset.scrollTo)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const progressBar = document.querySelector(".scroll-progress span");
function updateScrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
}
window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const tiltStage = document.querySelector("[data-tilt-stage]");
if (tiltStage) {
  const card = tiltStage.querySelector(".tilt-card");

  const resetTilt = () => {
    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
    card.style.setProperty("--shine-x", "-45%");
  };

  if (finePointer) {
    tiltStage.addEventListener("pointermove", (event) => {
      const rect = tiltStage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty("--rotate-x", `${(0.5 - y) * 13}deg`);
      card.style.setProperty("--rotate-y", `${(x - 0.5) * 16}deg`);
      card.style.setProperty("--shine-x", `${-90 + x * 180}%`);
    });

    tiltStage.addEventListener("pointerleave", resetTilt);
    tiltStage.addEventListener("blur", resetTilt);
  }

  tiltStage.addEventListener("click", () => {
    card.animate(
      [
        { transform: "rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg)) scale(1)" },
        { transform: "rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg)) scale(0.98)" },
        { transform: "rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg)) scale(1)" }
      ],
      { duration: 360, easing: "ease-out" }
    );
  });
}

const fusionLab = document.querySelector("#fusion-lab");
const fusionCore = document.querySelector(".fusion-core");
const fusionBubbles = [...document.querySelectorAll("[data-fusion-index]")];
const fusionCount = document.querySelector("[data-fusion-count]");
const fusionBar = document.querySelector("[data-fusion-bar]");
let fusedCount = 0;

function fusionSpark() {
  if (!finePointer && reduceMotion) return;
  const coreRect = fusionCore.getBoundingClientRect();
  const burst = document.createElement("span");
  burst.style.position = "fixed";
  burst.style.left = `${coreRect.left + coreRect.width / 2}px`;
  burst.style.top = `${coreRect.top + coreRect.height / 2}px`;
  burst.style.width = "1px";
  burst.style.height = "1px";
  burst.style.zIndex = "240";
  burst.style.pointerEvents = "none";
  document.body.appendChild(burst);

  for (let index = 0; index < 12; index += 1) {
    const spark = document.createElement("i");
    const angle = (Math.PI * 2 * index) / 12;
    spark.style.position = "absolute";
    spark.style.width = `${2 + Math.random() * 4}px`;
    spark.style.height = spark.style.width;
    spark.style.borderRadius = "50%";
    spark.style.background = index % 2 ? "#f5dfae" : "#c59a55";
    spark.style.boxShadow = "0 0 9px #d8b572";
    burst.appendChild(spark);
    spark.animate(
      [
        { opacity: 1, transform: "translate(0, 0) scale(1)" },
        {
          opacity: 0,
          transform: `translate(${Math.cos(angle) * (55 + Math.random() * 70)}px, ${Math.sin(angle) * (55 + Math.random() * 70)}px) scale(0.2)`
        }
      ],
      { duration: 700 + Math.random() * 300, easing: "cubic-bezier(.1,.7,.2,1)" }
    );
  }
  window.setTimeout(() => burst.remove(), 1100);
}

function updateFusionState() {
  fusionCount.textContent = String(fusedCount);
  fusionBar.style.width = `${(fusedCount / 6) * 100}%`;
}

function flyIngredient(button, index) {
  const photo = button.querySelector(".ingredient-bubble__photo");
  const sourceRect = photo.getBoundingClientRect();
  const targetRect = fusionCore.getBoundingClientRect();
  const clone = document.createElement("span");
  clone.style.position = "fixed";
  clone.style.left = `${sourceRect.left}px`;
  clone.style.top = `${sourceRect.top}px`;
  clone.style.width = `${sourceRect.width}px`;
  clone.style.height = `${sourceRect.height}px`;
  clone.style.borderRadius = "50%";
  clone.style.backgroundImage = `url("https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/ingredients/group-${index + 1}.webp")`;
  clone.style.backgroundPosition = "center";
  clone.style.backgroundSize = "220%";
  clone.style.border = "1px solid rgba(245, 223, 174, .8)";
  clone.style.boxShadow = "0 0 28px rgba(211, 179, 115, .45)";
  clone.style.pointerEvents = "none";
  clone.style.zIndex = "250";
  document.body.appendChild(clone);

  const targetX = targetRect.left + targetRect.width / 2 - sourceRect.left;
  const targetY = targetRect.top + targetRect.height / 2 - sourceRect.top;
  clone.animate(
    [
      { opacity: 0.92, transform: "translate(0, 0) scale(1)" },
      { opacity: 1, transform: `translate(${targetX * 0.42}px, ${targetY * 0.38 - 34}px) scale(.86)` },
      { opacity: 0, transform: `translate(${targetX}px, ${targetY}px) scale(.12)` }
    ],
    { duration: reduceMotion ? 1 : 720, easing: "cubic-bezier(.2,.75,.25,1)" }
  ).finished.then(() => clone.remove());

  button.classList.add("is-fused");
  window.setTimeout(() => {
    fusionCore.classList.remove("is-pulsing");
    void fusionCore.offsetWidth;
    fusionCore.classList.add("is-pulsing");
    fusionSpark();
  }, reduceMotion ? 0 : 610);
}

fusionBubbles.forEach((button, index) => {
  button.addEventListener("click", () => {
    if (button.classList.contains("is-fused")) return;
    flyIngredient(button, index);
    fusedCount += 1;
    updateFusionState();
    if (fusedCount === 6) {
      window.setTimeout(() => {
        fusionLab.classList.add("is-complete");
        showToast("六组原料已汇聚 · 精华凝聚");
      }, reduceMotion ? 20 : 780);
    }
  });
});

document.querySelector("[data-reset-fusion]")?.addEventListener("click", () => {
  fusedCount = 0;
  fusionLab.classList.remove("is-complete");
  fusionBubbles.forEach((button) => button.classList.remove("is-fused"));
  fusionCore.classList.remove("is-pulsing");
  updateFusionState();
  showToast("已重置原料气泡");
});

document.querySelectorAll("[data-slide]").forEach((button) => {
  button.addEventListener("click", () => {
    const track = document.querySelector(`#${button.dataset.slide}`);
    if (!track) return;
    const direction = Number(button.dataset.direction);
    const visibleCard = track.querySelector(":scope > *:not([hidden])");
    const distance = (visibleCard?.getBoundingClientRect().width || track.clientWidth * 0.75) + 18;
    track.scrollBy({ left: direction * distance, behavior: "smooth" });
  });
});

const posterTrack = document.querySelector("#posterTrack");
posterData.forEach((poster, index) => {
  const card = document.createElement("button");
  card.className = "poster-card";
  card.type = "button";
  card.dataset.posterType = poster.type;
  card.dataset.posterIndex = String(index);
  card.setAttribute("aria-label", `查看海报：${poster.label}`);
  card.innerHTML = `
    <img src="${poster.src}" alt="${poster.label}原图文案海报" width="790" height="${poster.height}" loading="lazy" decoding="async">
    <span class="poster-card__meta"><span>${poster.label}</span><span>${String(index + 1).padStart(2, "0")} / 19</span></span>
  `;
  card.addEventListener("click", () => openPoster(index));
  posterTrack.appendChild(card);
});

document.querySelectorAll("[data-poster-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.posterFilter;
    document.querySelectorAll("[data-poster-filter]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });
    posterTrack.querySelectorAll("[data-poster-type]").forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.posterType !== filter;
    });
    posterTrack.scrollTo({ left: 0, behavior: "smooth" });
  });
});

const posterDialog = document.querySelector("#posterDialog");
const dialogImage = document.querySelector("[data-poster-dialog-image]");
const dialogLabel = document.querySelector("[data-poster-dialog-label]");
const dialogScroll = document.querySelector("[data-poster-dialog-scroll]");
let dialogIndex = 0;
let lastFocused = null;

function visiblePosterIndexes() {
  return [...posterTrack.querySelectorAll("[data-poster-index]")]
    .filter((card) => !card.hidden)
    .map((card) => Number(card.dataset.posterIndex));
}

function renderDialogPoster(index) {
  const poster = posterData[index];
  dialogIndex = index;
  dialogImage.src = poster.src;
  dialogImage.alt = `${poster.label}原图文案海报`;
  dialogImage.width = 790;
  dialogImage.height = poster.height;
  dialogLabel.textContent = `${poster.label} · ${String(index + 1).padStart(2, "0")} / 19`;
  dialogScroll.scrollTop = 0;
}

function openPoster(index) {
  lastFocused = document.activeElement;
  renderDialogPoster(index);
  posterDialog.hidden = false;
  document.body.classList.add("is-dialog-open");
  posterDialog.querySelector("[data-close-poster]").focus();
}

function closePoster() {
  posterDialog.hidden = true;
  document.body.classList.remove("is-dialog-open");
  lastFocused?.focus();
}

function moveDialog(direction) {
  const indexes = visiblePosterIndexes();
  const current = indexes.indexOf(dialogIndex);
  const next = indexes[(current + direction + indexes.length) % indexes.length];
  renderDialogPoster(next);
}

document.querySelector("[data-close-poster]").addEventListener("click", closePoster);
document.querySelector("[data-poster-dialog-prev]").addEventListener("click", () => moveDialog(-1));
document.querySelector("[data-poster-dialog-next]").addEventListener("click", () => moveDialog(1));

posterDialog.addEventListener("click", (event) => {
  if (event.target === posterDialog) closePoster();
});

window.addEventListener("keydown", (event) => {
  if (posterDialog.hidden) return;
  if (event.key === "Escape") closePoster();
  if (event.key === "ArrowLeft") moveDialog(-1);
  if (event.key === "ArrowRight") moveDialog(1);
});

document.querySelectorAll(".button:not(.button--primary)").forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.style.position = "absolute";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    ripple.style.width = "12px";
    ripple.style.height = "12px";
    ripple.style.borderRadius = "50%";
    ripple.style.background = "currentColor";
    ripple.style.opacity = ".16";
    ripple.style.pointerEvents = "none";
    ripple.style.transform = "translate(-50%, -50%) scale(0)";
    button.appendChild(ripple);
    ripple.animate(
      [
        { transform: "translate(-50%, -50%) scale(0)", opacity: 0.18 },
        { transform: "translate(-50%, -50%) scale(13)", opacity: 0 }
      ],
      { duration: 520, easing: "ease-out" }
    ).finished.then(() => ripple.remove());
  });
});

updateFusionState();
