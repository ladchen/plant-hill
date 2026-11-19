const productMeta = {
  rg2: {
    label: "RG2 / 人参组培不定根固体饮料",
    totalHeight: 20789,
    reportCount: 4,
    theme: "#0b2018",
    files: [
      { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/long/rg2-01.webp", width: 790, height: 5198, alt: "人参组培不定根固体饮料长图第1段" },
      { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/long/rg2-02.webp", width: 790, height: 5197, alt: "人参组培不定根固体饮料长图第2段" },
      { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/long/rg2-03.webp", width: 790, height: 5197, alt: "人参组培不定根固体饮料长图第3段" },
      { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/long/rg2-04.webp", width: 790, height: 5197, alt: "人参组培不定根固体饮料长图第4段" }
    ]
  },
  lushen: {
    label: "鹿肾丸 / 人参组培不定根鹿肾丸",
    totalHeight: 11874,
    reportCount: 3,
    theme: "#1b0e11",
    files: [
      { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/long/lushen-01.webp", width: 790, height: 3958, alt: "人参组培不定根鹿肾丸长图第1段" },
      { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/long/lushen-02.webp", width: 790, height: 3958, alt: "人参组培不定根鹿肾丸长图第2段" },
      { src: "https://cdn.jsdelivr.net/gh/ladchen/plant-hill@latest/assets/long/lushen-03.webp", width: 790, height: 3958, alt: "人参组培不定根鹿肾丸长图第3段" }
    ]
  }
};

const productViews = [...document.querySelectorAll("[data-product-view]")];
const productButtons = [...document.querySelectorAll("[data-switch-product]")];
const reportJumpCount = document.querySelector("[data-report-jump-count]");
const progressLine = document.querySelector(".read-progress span");
const toast = document.querySelector(".toast");
let activeProduct = "rg2";
let toastTimer;

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function activeView() {
  return document.querySelector(`[data-product-view="${activeProduct}"]`);
}

function activateProduct(product, { updateHistory = true, scrollTop = true } = {}) {
  if (!productMeta[product]) return;
  activeProduct = product;
  document.body.dataset.activeProduct = product;

  productViews.forEach((view) => {
    const selected = view.dataset.productView === product;
    view.hidden = !selected;
    view.classList.toggle("is-active", selected);
    if (selected) {
      view.classList.remove("is-entering");
      void view.offsetWidth;
      view.classList.add("is-entering");
    }
  });

  productButtons.forEach((button) => {
    const selected = button.dataset.switchProduct === product;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-selected", String(selected));
  });

  reportJumpCount.textContent = `${productMeta[product].reportCount} 份`;
  document.querySelector('meta[name="theme-color"]').setAttribute("content", productMeta[product].theme);
  if (updateHistory) history.replaceState(null, "", `#${product}`);
  if (scrollTop) window.scrollTo({ top: 0, behavior: "auto" });
  updateReadingProgress();
}

productButtons.forEach((button) => {
  button.addEventListener("click", () => activateProduct(button.dataset.switchProduct));
});

document.querySelector("[data-jump-reports]").addEventListener("click", () => {
  activeView()?.querySelector(".product-reports")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelectorAll("[data-scroll-reader]").forEach((button) => {
  button.addEventListener("click", () => {
    const targetProduct = button.dataset.scrollReader;
    if (targetProduct !== activeProduct) activateProduct(targetProduct, { scrollTop: false });
    document.querySelector(`[data-reader-section="${targetProduct}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

if (window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll("[data-hero-stage]").forEach((stage) => {
    const frame = stage.querySelector(".hero-product-frame");
    stage.addEventListener("pointermove", (event) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      frame.style.setProperty("--tilt-y", `${x * 10}deg`);
      frame.style.setProperty("--tilt-x", `${-y * 8}deg`);
      frame.style.setProperty("--shine", `${50 + x * 60}%`);
    });
    stage.addEventListener("pointerleave", () => {
      frame.style.setProperty("--tilt-y", "0deg");
      frame.style.setProperty("--tilt-x", "0deg");
      frame.style.setProperty("--shine", "50%");
    });
  });
}

function chapterTarget(product, y) {
  const stack = document.querySelector(`[data-long-product="${product}"]`);
  if (!stack) return null;
  const rect = stack.getBoundingClientRect();
  const ratio = Number(y) / productMeta[product].totalHeight;
  return window.scrollY + rect.top + rect.height * ratio - 124;
}

document.querySelectorAll("[data-chapter-product]").forEach((button) => {
  button.addEventListener("click", () => {
    const product = button.dataset.chapterProduct;
    if (product !== activeProduct) activateProduct(product, { scrollTop: false });
    const target = chapterTarget(product, button.dataset.chapterY);
    if (target === null) return;
    window.scrollTo({ top: target, behavior: "smooth" });
    document.querySelectorAll(`[data-chapter-product="${product}"]`).forEach((item) => {
      item.classList.toggle("is-active", item.dataset.chapterY === button.dataset.chapterY);
    });
  });
});

function updateReadingProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressLine.style.width = `${max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0}%`;

  const view = activeView();
  if (!view) return;
  const stack = view.querySelector(".long-stack");
  const rect = stack.getBoundingClientRect();
  const read = Math.min(rect.height, Math.max(0, window.innerHeight * 0.3 - rect.top));
  const percent = rect.height > 0 ? Math.round((read / rect.height) * 100) : 0;
  const percentElement = view.querySelector(`[data-reading-percent="${activeProduct}"]`);
  const barElement = view.querySelector(`[data-reading-bar="${activeProduct}"]`);
  if (percentElement) percentElement.textContent = `${percent}%`;
  if (barElement) barElement.style.width = `${percent}%`;
}

window.addEventListener("scroll", updateReadingProgress, { passive: true });
window.addEventListener("resize", updateReadingProgress);

const viewer = document.querySelector("#viewer");
const viewerLabel = document.querySelector("[data-viewer-label]");
const viewerStack = document.querySelector("[data-viewer-stack]");
const viewerScroll = document.querySelector("[data-viewer-scroll]");
const viewerSource = document.querySelector("[data-viewer-source]");
let viewerProduct = "rg2";
let viewerScale = 1;
let lastFocused = null;

function baseViewerWidth() {
  return Math.min(window.innerWidth - (window.innerWidth < 640 ? 24 : 84), 790);
}

function applyViewerScale() {
  viewerStack.style.width = `${Math.round(baseViewerWidth() * viewerScale)}px`;
}

function openViewer(product) {
  viewerProduct = product;
  viewerScale = 1;
  lastFocused = document.activeElement;
  const meta = productMeta[product];
  viewerLabel.textContent = meta.label;
  viewerSource.href = meta.files[0].src;
  viewerStack.innerHTML = meta.files.map((file) => (
    `<img src="${file.src}" alt="${file.alt}" width="${file.width}" height="${file.height}" loading="eager" decoding="async">`
  )).join("");
  viewer.hidden = false;
  document.body.classList.add("is-viewer-open");
  applyViewerScale();
  viewerScroll.scrollTop = 0;
  viewer.querySelector("[data-viewer-close]").focus();
}

function closeViewer() {
  viewer.hidden = true;
  document.body.classList.remove("is-viewer-open");
  viewerStack.innerHTML = "";
  lastFocused?.focus();
}

document.querySelectorAll("[data-open-viewer], .long-stack").forEach((element) => {
  element.addEventListener("click", () => {
    openViewer(element.dataset.openViewer || element.dataset.longProduct);
  });
  element.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openViewer(element.dataset.openViewer || element.dataset.longProduct);
  });
});

document.querySelector("[data-viewer-close]").addEventListener("click", closeViewer);
document.querySelector("[data-viewer-zoom-in]").addEventListener("click", () => {
  viewerScale = Math.min(2.4, viewerScale + 0.2);
  applyViewerScale();
});
document.querySelector("[data-viewer-zoom-out]").addEventListener("click", () => {
  viewerScale = Math.max(0.6, viewerScale - 0.2);
  applyViewerScale();
});
document.querySelector("[data-viewer-reset]").addEventListener("click", () => {
  viewerScale = 1;
  applyViewerScale();
  viewerScroll.scrollTo({ top: 0, left: 0, behavior: "smooth" });
});

window.addEventListener("keydown", (event) => {
  if (viewer.hidden) return;
  if (event.key === "Escape") closeViewer();
  if (event.key === "+" || event.key === "=") {
    viewerScale = Math.min(2.4, viewerScale + 0.2);
    applyViewerScale();
  }
  if (event.key === "-") {
    viewerScale = Math.max(0.6, viewerScale - 0.2);
    applyViewerScale();
  }
});

window.addEventListener("resize", () => {
  if (!viewer.hidden) applyViewerScale();
});

let dragging = false;
let dragStart = { x: 0, y: 0, left: 0, top: 0 };
viewerScroll.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "touch") return;
  dragging = true;
  dragStart = { x: event.clientX, y: event.clientY, left: viewerScroll.scrollLeft, top: viewerScroll.scrollTop };
  viewerScroll.classList.add("is-dragging");
  viewerScroll.setPointerCapture(event.pointerId);
});
viewerScroll.addEventListener("pointermove", (event) => {
  if (!dragging) return;
  viewerScroll.scrollLeft = dragStart.left - (event.clientX - dragStart.x);
  viewerScroll.scrollTop = dragStart.top - (event.clientY - dragStart.y);
});
viewerScroll.addEventListener("pointerup", () => {
  dragging = false;
  viewerScroll.classList.remove("is-dragging");
});
viewerScroll.addEventListener("pointercancel", () => {
  dragging = false;
  viewerScroll.classList.remove("is-dragging");
});
viewerScroll.addEventListener("dblclick", () => {
  viewerScale = viewerScale > 1 ? 1 : 1.8;
  applyViewerScale();
});

const quizQuestions = [
  {
    title: "最近两周，你早晨醒来后的精力恢复更接近哪一种？",
    hint: "请选择最接近日常状态的一项。",
    options: [
      { text: "醒来后精力充足", severity: 0, rg2: 0, lushen: 0 },
      { text: "偶尔需要一点时间进入状态", severity: 1, rg2: 1, lushen: 1 },
      { text: "经常起床困难，上午容易疲惫", severity: 2, rg2: 3, lushen: 2 },
      { text: "即使睡过也常觉得没有恢复", severity: 3, rg2: 3, lushen: 3 }
    ]
  },
  {
    title: "下午长时间工作或学习时，你的专注力通常如何？",
    hint: "回想大多数工作日或学习日的状态。",
    options: [
      { text: "专注力稳定，能持续完成任务", severity: 0, rg2: 0, lushen: 0 },
      { text: "偶尔走神，需要短暂调整", severity: 1, rg2: 2, lushen: 1 },
      { text: "容易脑雾，效率明显下降", severity: 2, rg2: 3, lushen: 2 },
      { text: "很难集中，常需要停下来休息", severity: 3, rg2: 3, lushen: 2 }
    ]
  },
  {
    title: "最近两周的睡眠与恢复感更接近哪一种？",
    hint: "这里只评估日常感受，不作为睡眠疾病判断。",
    options: [
      { text: "入睡顺利，醒来后精神稳定", severity: 0, rg2: 0, lushen: 0 },
      { text: "偶尔晚睡或睡眠较浅", severity: 1, rg2: 1, lushen: 1 },
      { text: "经常难入睡、易醒或睡得不安稳", severity: 2, rg2: 1, lushen: 3 },
      { text: "长期睡眠不足，白天也明显疲惫", severity: 3, rg2: 2, lushen: 3 }
    ]
  },
  {
    title: "你的久坐、熬夜或应酬频率如何？",
    hint: "按最近一个月的常见频率选择。",
    options: [
      { text: "较少，作息与活动相对规律", severity: 0, rg2: 0, lushen: 0 },
      { text: "偶尔久坐、晚睡或有应酬", severity: 1, rg2: 1, lushen: 1 },
      { text: "每周多次，身体容易积累疲劳", severity: 2, rg2: 2, lushen: 2 },
      { text: "几乎每天，作息长期不规律", severity: 3, rg2: 2, lushen: 2 }
    ]
  },
  {
    title: "体力活动或忙碌之后，你通常多久能恢复？",
    hint: "请选择大多数情况下的恢复速度。",
    options: [
      { text: "很快恢复，不影响第二天状态", severity: 0, rg2: 0, lushen: 0 },
      { text: "休息一会儿或睡一觉即可恢复", severity: 1, rg2: 1, lushen: 1 },
      { text: "第二天仍会感觉疲惫", severity: 2, rg2: 1, lushen: 3 },
      { text: "需要几天，且常觉得体力不足", severity: 3, rg2: 1, lushen: 4 }
    ]
  },
  {
    title: "如果要进一步了解一款产品，你更偏向哪种方式？",
    hint: "这一题用于匹配产品形态与信息偏好。",
    options: [
      { text: "舌下含服，小袋便携", severity: 0, rg2: 4, lushen: 0 },
      { text: "丸盒形态，多味组方", severity: 0, rg2: 0, lushen: 4 },
      { text: "两款都愿意了解", severity: 0, rg2: 3, lushen: 3 },
      { text: "先看完产品资料再决定", severity: 0, rg2: 2, lushen: 2 }
    ]
  }
];

const quizModal = document.querySelector("#wellnessQuiz");
const quizScreens = [...quizModal.querySelectorAll("[data-quiz-screen]")];
const quizStep = quizModal.querySelector("[data-quiz-step]");
const quizProgress = quizModal.querySelector("[data-quiz-progress]");
const quizOptions = quizModal.querySelector("[data-quiz-options]");
const quizQuestionIndex = quizModal.querySelector("[data-quiz-question-index]");
const quizQuestionTitle = quizModal.querySelector("[data-quiz-question]");
const quizQuestionHint = quizModal.querySelector("[data-quiz-question-hint]");
const quizProgressText = quizModal.querySelector("[data-quiz-progress-text]");
const quizBack = quizModal.querySelector("[data-quiz-back]");
let quizIndex = 0;
let quizAnswers = [];
let quizLastFocused = null;
let quizNextTimer;

function showQuizScreen(name) {
  quizScreens.forEach((screen) => {
    screen.hidden = screen.dataset.quizScreen !== name;
  });
}

function updateQuizChrome() {
  const isQuestion = quizScreens.find((screen) => screen.dataset.quizScreen === "question" && !screen.hidden);
  const activeStep = isQuestion ? quizIndex + 1 : quizScreens.find((screen) => !screen.hidden)?.dataset.quizScreen === "result" ? 6 : 0;
  quizStep.textContent = String(activeStep).padStart(2, "0");
  quizProgress.style.width = `${(activeStep / quizQuestions.length) * 100}%`;
}

function openQuiz() {
  quizLastFocused = document.activeElement;
  quizIndex = 0;
  quizAnswers = [];
  quizModal.hidden = false;
  document.body.classList.add("is-quiz-open");
  showQuizScreen("intro");
  updateQuizChrome();
  quizModal.querySelector("[data-start-quiz]").focus();
}

function closeQuiz() {
  quizModal.hidden = true;
  document.body.classList.remove("is-quiz-open");
  window.clearTimeout(quizNextTimer);
  quizLastFocused?.focus();
}

function renderQuizQuestion() {
  const question = quizQuestions[quizIndex];
  quizQuestionIndex.textContent = `QUESTION ${String(quizIndex + 1).padStart(2, "0")}`;
  quizQuestionTitle.textContent = question.title;
  quizQuestionHint.textContent = question.hint;
  quizProgressText.textContent = `${String(quizIndex + 1).padStart(2, "0")} / ${String(quizQuestions.length).padStart(2, "0")}`;
  quizBack.disabled = quizIndex === 0;
  quizOptions.innerHTML = "";

  question.options.forEach((option, optionIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.innerHTML = `<span>${String(optionIndex + 1).padStart(2, "0")}</span><strong>${option.text}</strong>`;
    if (quizAnswers[quizIndex] === optionIndex) button.classList.add("is-selected");
    button.addEventListener("click", () => {
      quizAnswers[quizIndex] = optionIndex;
      quizOptions.querySelectorAll(".quiz-option").forEach((item) => item.classList.remove("is-selected"));
      button.classList.add("is-selected");
      window.clearTimeout(quizNextTimer);
      quizNextTimer = window.setTimeout(() => {
        if (quizIndex < quizQuestions.length - 1) {
          quizIndex += 1;
          renderQuizQuestion();
          updateQuizChrome();
        } else {
          showQuizResult();
        }
      }, 220);
    });
    quizOptions.appendChild(button);
  });

  showQuizScreen("question");
  updateQuizChrome();
  window.requestAnimationFrame(() => quizOptions.querySelector(".quiz-option")?.focus());
}

function quizTotals() {
  return quizAnswers.reduce((totals, answerIndex, questionIndex) => {
    if (answerIndex === undefined) return totals;
    const option = quizQuestions[questionIndex].options[answerIndex];
    totals.severity += option.severity;
    totals.rg2 += option.rg2;
    totals.lushen += option.lushen;
    return totals;
  }, { severity: 0, rg2: 0, lushen: 0 });
}

function maxProductScore(product) {
  return quizQuestions.reduce((total, question) => total + Math.max(...question.options.map((option) => option[product])), 0);
}

function showQuizResult() {
  const totals = quizTotals();
  const rg2Percent = Math.min(100, Math.round((totals.rg2 / maxProductScore("rg2")) * 100));
  const lushenPercent = Math.min(100, Math.round((totals.lushen / maxProductScore("lushen")) * 100));
  const level = totals.severity <= 4 ? "日常状态较为稳定" : totals.severity <= 9 ? "出现多项轻度疲劳信号" : "多项状态值得重点关注";
  const difference = Math.abs(rg2Percent - lushenPercent);
  let recommendation = "both";
  if (difference > 8) recommendation = rg2Percent > lushenPercent ? "rg2" : "lushen";

  quizModal.querySelector("[data-quiz-score]").textContent = String(totals.severity);
  quizModal.querySelector("[data-quiz-level]").textContent = level;
  quizModal.querySelector("[data-quiz-match-rg2]").style.width = `${rg2Percent}%`;
  quizModal.querySelector("[data-quiz-match-lushen]").style.width = `${lushenPercent}%`;
  quizModal.querySelector("[data-quiz-match-rg2-value]").textContent = `${rg2Percent}%`;
  quizModal.querySelector("[data-quiz-match-lushen-value]").textContent = `${lushenPercent}%`;

  const resultTitle = quizModal.querySelector("[data-quiz-result-title]");
  const resultCopy = quizModal.querySelector("[data-quiz-result-copy]");
  if (recommendation === "rg2") {
    resultTitle.textContent = "优先了解 RG2 固体饮料";
    resultCopy.textContent = "你的关注更集中在精力、专注状态与舌下含服方式。建议先阅读 RG2 的完整产品长图和对应检测报告。";
  } else if (recommendation === "lushen") {
    resultTitle.textContent = "优先了解鹿肾丸";
    resultCopy.textContent = "你的关注更集中在恢复状态、多味组方与丸盒形态。建议先阅读鹿肾丸的完整产品长图和对应检测报告。";
  } else {
    resultTitle.textContent = "两款组合更贴近你的关注点";
    resultCopy.textContent = "你的状态关注同时覆盖精力、恢复和产品形态偏好。建议先分别阅读两款完整长图，再根据剂型偏好选择。";
  }

  showQuizScreen("result");
  quizProgress.style.width = "100%";
  quizStep.textContent = "06";
}

document.querySelectorAll("[data-open-quiz]").forEach((button) => {
  button.addEventListener("click", openQuiz);
});
quizModal.querySelector("[data-close-quiz]").addEventListener("click", closeQuiz);
quizModal.querySelector("[data-start-quiz]").addEventListener("click", () => {
  quizIndex = 0;
  quizAnswers = [];
  renderQuizQuestion();
});
quizBack.addEventListener("click", () => {
  if (quizIndex === 0) return;
  quizIndex -= 1;
  renderQuizQuestion();
});
quizModal.querySelector("[data-quiz-restart]").addEventListener("click", () => {
  quizIndex = 0;
  quizAnswers = [];
  renderQuizQuestion();
});
quizModal.querySelectorAll("[data-quiz-go]").forEach((button) => {
  button.addEventListener("click", () => {
    const product = button.dataset.quizGo;
    closeQuiz();
    activateProduct(product, { scrollTop: false });
    window.setTimeout(() => {
      document.querySelector(`[data-reader-section="${product}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  });
});
quizModal.addEventListener("click", (event) => {
  if (event.target === quizModal) closeQuiz();
});
window.addEventListener("keydown", (event) => {
  if (quizModal.hidden) return;
  if (event.key === "Escape") closeQuiz();
  if (event.key >= "1" && event.key <= "4" && !quizScreens.find((screen) => screen.dataset.quizScreen === "question")?.hidden) {
    quizOptions.querySelectorAll(".quiz-option")[Number(event.key) - 1]?.click();
  }
});

window.addEventListener("message", (event) => {
  const _allowed = new Set([location.origin, "https://cdn.jsdelivr.net"]);
  if (!_allowed.has(event.origin) || event.data?.type !== "fusion-height") return;
  document.querySelectorAll("[data-fusion-embed]").forEach((frame) => {
    if (frame.contentWindow === event.source) {
      frame.style.height = `${Math.max(620, Number(event.data.height) || 620)}px`;
    }
  });
});

const initialProduct = ["rg2", "lushen"].includes(location.hash.slice(1)) ? location.hash.slice(1) : "rg2";
activateProduct(initialProduct, { updateHistory: false, scrollTop: false });
