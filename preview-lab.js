const labProducts = {
  rg2: {
    image: "assets/products/rg2-pack-scene.webp",
    alt: "人参组培不定根固体饮料包装",
    code: "RG2–30",
    drawerCode: "PH–RG2 / 30G",
    name: "人参组培不定根固体饮料",
    spec: "净含量 30g（1g×30袋）",
    ingredients: "赤藓糖醇、抗性糊精、人参组培不定根粉、水苏糖、三氯蔗糖",
    facts: {
      name: "人参组培不定根固体饮料",
      spec: "净含量 30g（1g×30袋）",
      source: "配料包含人参组培不定根粉；完整原料信息见产品包装与原始海报。"
    }
  },
  lushen: {
    image: "assets/products/lushen-box.webp",
    alt: "人参组培不定根鹿肾丸包装",
    code: "LUSHEN–18",
    drawerCode: "PH–LUSHEN / 18G",
    name: "人参组培不定根鹿肾丸",
    spec: "蜂产品制品 · 净含量 18g（6g×3）",
    ingredients: "蜂蜜、肉苁蓉粉、黄精粉、桑椹粉、枸杞粉、沙棘粉、人参粉、人参组培不定根（干粉）、牡蛎肽粉、海参肽粉、鹿鞭粉、鹿茸血粉、鹿肾粉、鹿尾粉",
    facts: {
      name: "人参组培不定根鹿肾丸",
      spec: "蜂产品制品 · 净含量 18g（6g×3）",
      source: "六组原料影像取自鹿肾丸原详情长图，原料名称与英文标识保留原图内容。"
    }
  }
};

let labProductKey = "rg2";
const labImage = document.querySelector("[data-lab-image]");
const hotNote = document.querySelector("[data-hotspot-text]");
const dossierDrawer = document.querySelector("#dossierDrawer");
const hotspotLabels = {
  name: ["01 / IDENTIFICATION", "name"],
  spec: ["02 / SPECIFICATION", "spec"],
  source: ["03 / MATERIAL SOURCE", "source"]
};

function setLabProduct(key) {
  labProductKey = key;
  const product = labProducts[key];
  labImage.src = product.image;
  labImage.alt = product.alt;
  document.querySelector("[data-lab-code]").textContent = product.code;
  document.querySelector("[data-lab-code-drawer]").textContent = product.drawerCode;
  document.querySelector("[data-lab-name]").textContent = product.name;
  document.querySelector("[data-lab-spec]").textContent = product.spec;
  document.querySelector("[data-lab-ingredients]").textContent = product.ingredients;
  hotNote.textContent = product.name;
  document.querySelectorAll("[data-lab-product]").forEach((button) => {
    const active = button.dataset.labProduct === key;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
}

document.querySelectorAll("[data-lab-product]").forEach((button) => {
  button.addEventListener("click", () => setLabProduct(button.dataset.labProduct));
});

document.querySelectorAll("[data-hotspot]").forEach((button) => {
  button.addEventListener("click", () => {
    const [label, key] = hotspotLabels[button.dataset.hotspot];
    document.querySelector(".hotspot-note > span").textContent = label;
    hotNote.textContent = labProducts[labProductKey].facts[key];
    document.querySelectorAll("[data-hotspot]").forEach((item) => item.classList.toggle("is-active", item === button));
  });
});

document.querySelector("#toggleDossier").addEventListener("click", () => {
  dossierDrawer.classList.add("is-open");
});
document.querySelector("#closeDossier").addEventListener("click", () => {
  dossierDrawer.classList.remove("is-open");
});

const materialNames = [
  "人参组培不定根 · 肉苁蓉",
  "黄精 · 桑椹",
  "枸杞 · 沙棘",
  "牡蛎肽 · 海参肽",
  "鹿鞭 · 鹿茸血",
  "鹿肾 · 鹿尾"
];

document.querySelectorAll("[data-material]").forEach((button) => {
  button.addEventListener("click", () => {
    const index = Number(button.dataset.material);
    document.querySelectorAll("[data-material]").forEach((item) => item.classList.toggle("is-active", item === button));
    const image = document.querySelector("[data-material-image]");
    image.style.opacity = "0.25";
    window.setTimeout(() => {
      image.src = `assets/ingredients/group-${index}.webp`;
      image.alt = `${materialNames[index - 1]}原料实拍`;
      image.style.opacity = "1";
    }, 150);
    document.querySelector("[data-material-count]").textContent = `${String(index).padStart(2, "0")} / 06`;
    document.querySelector("[data-material-name]").textContent = materialNames[index - 1];
  });
});

setLabProduct(labProductKey);
