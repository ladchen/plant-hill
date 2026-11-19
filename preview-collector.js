const collectorProducts = {
  rg2: {
    image: "assets/products/rg2-cutout.png",
    alt: "人参组培不定根固体饮料包装",
    index: "01",
    code: "PH · RG2 / 30G",
    en: "GINSENG CULTIVATED INDETERMINATE ROOTS SOLID DRINK",
    name: "人参组培不定根固体饮料",
    spec: "净含量 30g（1g×30袋）",
    note: "真实包装主图 · 原始信息未改写 · 点击“启封藏品”查看完整呈现"
  },
  lushen: {
    image: "assets/products/lushen-cutout.png",
    alt: "人参组培不定根鹿肾丸包装",
    index: "02",
    code: "PH · LUSHEN / 18G",
    en: "GINSENG TISSUE CULTURE ADVENTITIOUS ROOTS DEER KIDNEY PILL",
    name: "人参组培不定根鹿肾丸",
    spec: "蜂产品制品 · 净含量 18g（6g×3）",
    note: "真实包装主图 · 六组原料实拍 · 产品信息与原始资料保持一致"
  }
};

const vitrine = document.querySelector("#vitrine");
const revealButton = document.querySelector("#revealCollector");
const productImage = document.querySelector("[data-product-image]");
const particles = document.querySelector(".ink-particles");
let collectorOpen = false;
let activeProduct = "rg2";

for (let index = 0; index < 26; index += 1) {
  const particle = document.createElement("i");
  const angle = Math.random() * Math.PI * 2;
  const distance = 50 + Math.random() * 160;
  particle.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
  particle.style.setProperty("--dy", `${Math.sin(angle) * distance - 25}px`);
  particle.style.setProperty("--delay", `${Math.random() * 0.2}s`);
  particles.appendChild(particle);
}

function setCollectorProduct(key) {
  activeProduct = key;
  const product = collectorProducts[key];
  productImage.src = product.image;
  productImage.alt = product.alt;
  document.querySelector("[data-index]").textContent = product.index;
  document.querySelector("[data-product-code]").textContent = product.code;
  document.querySelector("[data-product-en]").textContent = product.en;
  document.querySelector("[data-product-name]").textContent = product.name;
  document.querySelector("[data-product-spec]").textContent = product.spec;
  document.querySelector("[data-product-note]").textContent = product.note;
  document.querySelectorAll("[data-product]").forEach((button) => {
    const selected = button.dataset.product === key;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-selected", String(selected));
  });
}

document.querySelectorAll("[data-product]").forEach((button) => {
  button.addEventListener("click", () => setCollectorProduct(button.dataset.product));
});

function setCollectorOpen() {
  collectorOpen = !collectorOpen;
  vitrine.classList.toggle("is-open", collectorOpen);
  revealButton.querySelector("span").textContent = collectorOpen ? "收拢藏品" : "启封藏品";
  if (collectorOpen) {
    particles.querySelectorAll("i").forEach((particle) => {
      particle.style.animation = "none";
      void particle.offsetWidth;
      particle.style.animation = "";
    });
  }
}

revealButton.addEventListener("click", setCollectorOpen);

document.querySelector(".vitrine-cover").addEventListener("click", () => {
  if (!collectorOpen) setCollectorOpen();
});

if (window.matchMedia("(pointer: fine)").matches) {
  const arch = document.querySelector(".vitrine-arch");
  vitrine.addEventListener("pointermove", (event) => {
    const rect = vitrine.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    arch.style.setProperty("--ry", `${x * 7}deg`);
    arch.style.setProperty("--rx", `${-y * 5}deg`);
  });
  vitrine.addEventListener("pointerleave", () => {
    arch.style.setProperty("--ry", "0deg");
    arch.style.setProperty("--rx", "0deg");
  });
}

document.querySelectorAll(".drawer").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".drawer").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    document.querySelector("[data-drawer-caption]").textContent = button.dataset.name;
  });
});

setCollectorProduct(activeProduct);
