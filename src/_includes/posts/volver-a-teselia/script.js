const stage = document.querySelector(".stage");
const panel = document.querySelector(".panel");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const ms = (n) => (reduced ? 0 : n);
const wait = (n) => new Promise((r) => setTimeout(r, ms(n)));

const POOL = [
  { id: "snivy", name: "Snivy", weight: 3 },
  { id: "tepig", name: "Tepig", weight: 3 },
  { id: "oshawott", name: "Oshawott", weight: 3 },
  { id: "zorua", name: "Zorua", weight: 2 },
  { id: "litwick", name: "Litwick", weight: 3 },
  { id: "emolga", name: "Emolga", weight: 3 },
  { id: "joltik", name: "Joltik", weight: 3 },
  { id: "axew", name: "Axew", weight: 2 },
  { id: "darumaka", name: "Darumaka", weight: 3 },
  { id: "sewaddle", name: "Sewaddle", weight: 3 },
  { id: "munna", name: "Munna", weight: 3 },
  { id: "victini", name: "Victini", weight: 0.4, rate: 0.25 },
];
const sprite = (id) => `/assets/img/posts/unova/${id}.gif`;

const store = {
  load() {
    try { return JSON.parse(localStorage.getItem("unova-party")) || { party: [], box: 0 }; }
    catch { return { party: [], box: 0 }; }
  },
  save(s) {
    try { localStorage.setItem("unova-party", JSON.stringify(s)); } catch {}
  },
};
const save = store.load();

const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html) n.innerHTML = html;
  return n;
};

const party = el("section", "party", `<p class="party__title">EQUIPO</p><div class="party__slots"></div><p class="party__box"></p>`);
panel.prepend(party);

function renderParty() {
  const slots = party.querySelector(".party__slots");
  slots.replaceChildren(...Array.from({ length: 6 }, (_, i) => {
    const slot = el("div", "party__slot");
    const mon = POOL.find((p) => p.id === save.party[i]);
    if (mon) slot.append(Object.assign(new Image(), { src: sprite(mon.id), alt: mon.name, title: mon.name }));
    return slot;
  }));
  party.querySelector(".party__box").textContent = save.box ? `PC: ${save.box}` : "";
}
renderParty();

const dialog = el("div", "dialog", `<p class="dialog__text" aria-live="polite"></p><div class="dialog__choices"></div>`);
const wild = el("div", "wild", `<div class="wild__platform"></div>`);
stage.append(wild, dialog);
const textEl = dialog.querySelector(".dialog__text");
const choicesEl = dialog.querySelector(".dialog__choices");

async function type(text) {
  textEl.textContent = "";
  for (const ch of text) {
    textEl.textContent += ch;
    if (!reduced) await new Promise((r) => setTimeout(r, 26));
  }
}

// Escribe el texto como en los juegos y espera una elección (o un clic para continuar, si no hay opciones).
async function say(text, choices = []) {
  choicesEl.replaceChildren();
  await type(text);
  return new Promise((resolve) => {
    if (!choices.length) {
      const next = el("span", "dialog__next", "▼");
      dialog.append(next);
      const go = (e) => {
        if (e.type === "keydown" && !["Enter", " ", "z", "Z"].includes(e.key)) return;
        next.remove();
        dialog.removeEventListener("click", go);
        removeEventListener("keydown", go);
        resolve();
      };
      dialog.addEventListener("click", go);
      addEventListener("keydown", go);
      return;
    }
    const buttons = choices.map(([id, label]) => {
      const b = el("button");
      b.type = "button";
      b.textContent = label;
      b.addEventListener("click", () => resolve(id), { once: true });
      return b;
    });
    choicesEl.replaceChildren(...buttons);
    buttons[0].focus({ preventScroll: true });
  });
}

function pick() {
  const total = POOL.reduce((t, p) => t + p.weight, 0);
  let roll = Math.random() * total;
  return POOL.find((p) => (roll -= p.weight) < 0) || POOL[0];
}

const center = (node) => {
  const s = stage.getBoundingClientRect();
  const r = node.getBoundingClientRect();
  return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2, bottom: r.bottom - s.top };
};

async function appear(mon) {
  const img = el("img", "wild__sprite");
  img.alt = mon.name;
  img.src = sprite(mon.id);
  await img.decode().catch(() => {});
  wild.append(img);
  await img.animate(
    [
      { transform: "translateX(-50%) translateY(40px) scale(2)", opacity: 0, filter: "brightness(0)" },
      { transform: "translateX(-50%) translateY(-10px) scale(2)", opacity: 1, filter: "brightness(0)", offset: 0.6 },
      { transform: "translateX(-50%) scale(2)", opacity: 1, filter: "brightness(1)" },
    ],
    { duration: ms(700), easing: "ease-out" }
  ).finished;
  return img;
}

async function vanish(img) {
  await img.animate([{ opacity: 1 }, { opacity: 0, transform: "translateX(-50%) translateY(30px) scale(2)" }], { duration: ms(400), fill: "forwards" }).finished;
  img.remove();
}

// Parábola armada con keyframes: WAAPI interpola lineal entre ellos, así que con suficientes puntos la curva queda suave.
function arc(from, to, height, steps = 16) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const x = (to.x - from.x) * t;
    const y = (to.y - from.y) * t - height * 4 * t * (1 - t);
    return { transform: `translate(${x}px, ${y}px) rotate(${t * 720}deg)` };
  });
}

async function throwBall(mon, img) {
  const s = stage.getBoundingClientRect();
  const d = dialog.getBoundingClientRect();
  const from = { x: d.left - s.left + 30, y: d.top - s.top - 10 };
  const target = center(img);
  const ball = el("div", "ball");
  ball.style.left = `${from.x - 11}px`;
  ball.style.top = `${from.y - 11}px`;
  stage.append(ball);

  await ball.animate(arc(from, target, 160), { duration: ms(650), easing: "linear", fill: "forwards" }).finished;
  await img.animate(
    [
      { filter: "brightness(1)", transform: "translateX(-50%) scale(2)" },
      { filter: "brightness(3) sepia(1) hue-rotate(-40deg) saturate(5)", transform: "translateX(-50%) scale(2)", offset: 0.4 },
      { filter: "brightness(3)", transform: "translateX(-50%) scale(0)", opacity: 0 },
    ],
    { duration: ms(450), fill: "forwards" }
  ).finished;

  const ground = center(wild.querySelector(".wild__platform")).y - 11;
  const drop = ground - (target.y - 11);
  const landed = `translate(${target.x - from.x}px, ${target.y - from.y + drop}px)`;
  await ball.animate(
    [
      { transform: `translate(${target.x - from.x}px, ${target.y - from.y}px)` },
      { transform: landed, offset: 0.6, easing: "ease-out" },
      { transform: `translate(${target.x - from.x}px, ${target.y - from.y + drop - 14}px)`, offset: 0.8 },
      { transform: landed },
    ],
    { duration: ms(500), easing: "ease-in", fill: "forwards" }
  ).finished;

  const caught = Math.random() < (mon.rate ?? 0.65);
  const wobbles = caught ? 3 : Math.floor(Math.random() * 3);
  for (let i = 0; i < wobbles; i++) {
    await wait(350);
    await ball.animate(
      [{ transform: landed }, { transform: `${landed} rotate(-24deg)` }, { transform: `${landed} rotate(18deg)` }, { transform: landed }],
      { duration: ms(500), easing: "ease-in-out" }
    ).finished;
  }
  await wait(400);

  if (caught) {
    ball.style.filter = "brightness(0.75)";
    sparks(target.x, ground);
    await wait(700);
    ball.remove();
    img.remove();
  } else {
    ball.remove();
    await img.animate(
      [{ transform: "translateX(-50%) scale(0)", opacity: 0, filter: "brightness(3)" }, { transform: "translateX(-50%) scale(2)", opacity: 1, filter: "brightness(1)" }],
      { duration: ms(350), fill: "forwards" }
    ).finished;
  }
  return caught;
}

function sparks(x, y) {
  for (const [dx, dy] of [[-26, -22], [0, -34], [26, -22]]) {
    const s = el("span", "spark", "✦");
    s.style.left = `${x - 6}px`;
    s.style.top = `${y}px`;
    stage.append(s);
    s.animate([{ transform: "translate(0, 0)", opacity: 1 }, { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 }], { duration: ms(700), easing: "ease-out" })
      .finished.then(() => s.remove());
  }
}

async function encounter() {
  const mon = pick();
  const img = await appear(mon);
  let choice = await say(`¡Un ${mon.name} salvaje apareció!`, [["ball", "Poké Ball"], ["run", "Huir"]]);
  while (choice === "ball") {
    choicesEl.replaceChildren();
    await type("¡Vamos, Poké Ball!");
    if (await throwBall(mon, img)) {
      await say(`¡Ya está! ¡${mon.name} atrapado!`);
      if (save.party.length < 6) save.party.push(mon.id);
      else {
        save.box += 1;
        await say(`Tu equipo está completo. ${mon.name} fue enviado al PC.`);
      }
      store.save(save);
      renderParty();
      return;
    }
    choice = await say("¡Oh, no! ¡El Pokémon se ha escapado!", [["ball", "Otra vez"], ["run", "Huir"]]);
  }
  await say("¡Escapaste sin problemas!");
  await vanish(img);
}

(async () => {
  await wait(800);
  await say("Algo se mueve en la hierba alta…", [["go", "Acercarse"]]);
  while (true) {
    await encounter();
    await say("La hierba alta sigue moviéndose…", [["go", "Seguir caminando"]]);
  }
})();
