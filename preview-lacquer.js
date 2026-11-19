const nightProducts = {
  rg2: {
    image: "assets/products/rg2-cutout.webp",
    alt: "人参组培不定根固体饮料真实包装",
    name: "人参组培不定根固体饮料",
    spec: "净含量 30g（1g×30袋）"
  },
  lushen: {
    image: "assets/products/lushen-cutout.webp",
    alt: "人参组培不定根鹿肾丸真实包装",
    name: "人参组培不定根鹿肾丸",
    spec: "蜂产品制品 · 净含量 18g（1g×30袋）"
  }
};

const nightImage = document.querySelector("[data-night-image]");
const nightName = document.querySelector("[data-night-name]");
const nightSpec = document.querySelector("[data-night-spec]");
const lacquerBox = document.querySelector("#lacquerBox");
const nightOpen = document.querySelector("#nightOpen");
const nightParticles = document.querySelector(".night-particles");
let nightProductOpen = false;

for (let index = 0; index < 34; index += 1) {
  const particle = document.createElement("i");
  const angle = (Math.PI * 2 * index) / 34 + Math.random() * 0.18;
  const distance = 90 + Math.random() * 210;
  particle.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
  particle.style.setProperty("--dy", `${Math.sin(angle) * distance - 120}px`);
  particle.style.setProperty("--size", `${1.5 + Math.random() * 5}px`);
  particle.style.setProperty("--delay", `${Math.random() * 0.26}s`);
  nightParticles.appendChild(particle);
}

document.querySelectorAll("[data-night-product]").forEach((button) => {
  button.addEventListener("click", () => {
    const product = nightProducts[button.dataset.nightProduct];
    nightImage.src = product.image;
    nightImage.alt = product.alt;
    nightName.textContent = product.name;
    nightSpec.textContent = product.spec;
    document.querySelectorAll("[data-night-product]").forEach((item) => item.classList.toggle("is-active", item === button));
  });
});

nightOpen.addEventListener("click", () => {
  nightProductOpen = !nightProductOpen;
  lacquerBox.classList.toggle("is-open", nightProductOpen);
  nightOpen.setAttribute("aria-expanded", String(nightProductOpen));
  nightOpen.querySelector("span:last-child").textContent = nightProductOpen ? "合上礼盒" : "开启礼盒";
  if (nightProductOpen) {
    nightParticles.querySelectorAll("i").forEach((particle) => {
      particle.style.animation = "none";
      void particle.offsetWidth;
      particle.style.animation = "";
    });
  }
});

document.querySelectorAll("[data-night-item]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-night-item]").forEach((item) => item.classList.toggle("is-active", item === button));
    const image = document.querySelector("[data-night-ingredient]");
    image.style.opacity = "0.3";
    window.setTimeout(() => {
      image.src = button.dataset.image;
      image.alt = `${button.dataset.name}原料实拍`;
      image.style.opacity = "1";
    }, 180);
    document.querySelector("[data-night-index]").textContent = String(button.dataset.nightItem).padStart(2, "0");
    document.querySelector("[data-night-caption]").textContent = button.dataset.name;
  });
});
