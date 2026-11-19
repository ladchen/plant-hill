const productMeta = {
  rg2: {
    label: "RG2 / 人参组培不定根固体饮料",
    totalHeight: 20789,
    files: [
      { src: "assets/long/rg2-01.webp", width: 790, height: 5198, alt: "人参组培不定根固体饮料长图第1段" },
      { src: "assets/long/rg2-02.webp", width: 790, height: 5197, alt: "人参组培不定根固体饮料长图第2段" },
      { src: "assets/long/rg2-03.webp", width: 790, height: 5197, alt: "人参组培不定根固体饮料长图第3段" },
      { src: "assets/long/rg2-04.webp", width: 790, height: 5197, alt: "人参组培不定根固体饮料长图第4段" }
    ]
  },
  lushen: {
    label: "鹿肾丸 / 人参组培不定根鹿肾丸",
    totalHeight: 11874,
    files: [
      { src: "assets/long/lushen-01.webp", width: 790, height: 3958, alt: "人参组培不定根鹿肾丸长图第1段" },
      { src: "assets/long/lushen-02.webp", width: 790, height: 3958, alt: "人参组培不定根鹿肾丸长图第2段" },
      { src: "assets/long/lushen-03.webp", width: 790, height: 3958, alt: "人参组培不定根鹿肾丸长图第3段" }
    ]
  }
};

const toast = document.querySelector(".toast");
let toastTimer;
function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function scrollToProduct(id) {
  document.querySelector(`#${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelectorAll("[data-jump-product]").forEach((button) => {
  button.addEventListener("click", () => scrollToProduct(button.dataset.jumpProduct));
});

document.querySelector("[data-jump-reports]").addEventListener("click", () => {
  const current = document.querySelector(".product-document.is-current");
  const target = current?.querySelector(".product-reports") || document.querySelector(".product-reports");
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
});

function chapterTarget(product, y) {
  const stack = document.querySelector(`[data-long-product="${product}"]`);
  if (!stack) return null;
  const rect = stack.getBoundingClientRect();
  const ratio = Number(y) / productMeta[product].totalHeight;
  return { stack, top: window.scrollY + rect.top + rect.height * ratio - 118 };
}

document.querySelectorAll("[data-chapter-product]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = chapterTarget(button.dataset.chapterProduct, button.dataset.chapterY);
    if (!target) return;
    window.scrollTo({ top: target.top, behavior: "smooth" });
    document.querySelectorAll(`[data-chapter-product="${button.dataset.chapterProduct}"]`).forEach((item) => {
      item.classList.toggle("is-active", item.dataset.chapterY === button.dataset.chapterY);
    });
  });
});

const progressLine = document.querySelector(".read-progress span");
const documentSections = [...document.querySelectorAll(".product-document")];

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressLine.style.width = `${max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0}%`;

  documentSections.forEach((section) => {
    const stack = section.querySelector(".long-stack");
    const rect = stack.getBoundingClientRect();
    const read = Math.min(rect.height, Math.max(0, window.innerHeight * 0.28 - rect.top));
    const percent = rect.height > 0 ? Math.round((read / rect.height) * 100) : 0;
    section.querySelector(`[data-reading-percent="${section.dataset.document}"]`).textContent = `${percent}%`;
    section.querySelector(`[data-reading-bar="${section.dataset.document}"]`).style.width = `${percent}%`;
  });

  const viewportCenter = window.scrollY + window.innerHeight / 2;
  let current = documentSections[0];
  documentSections.forEach((section) => {
    if (viewportCenter >= section.offsetTop) current = section;
  });
  documentSections.forEach((section) => section.classList.toggle("is-current", section === current));
  document.querySelectorAll("[data-jump-product]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.jumpProduct === current.dataset.document);
  });
}

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

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
  const width = Math.round(baseViewerWidth() * viewerScale);
  viewerStack.style.width = `${width}px`;
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
    const product = element.dataset.openViewer || element.dataset.longProduct;
    openViewer(product);
  });
  element.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    const product = element.dataset.openViewer || element.dataset.longProduct;
    openViewer(product);
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

const chapterObserver = new IntersectionObserver(
  () => updateProgress(),
  { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.2, 0.6] }
);

documentSections.forEach((section) => {
  section.querySelectorAll(".long-stack").forEach((stack) => chapterObserver.observe(stack));
});
