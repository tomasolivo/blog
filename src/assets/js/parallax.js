(() => {
  const toggle = document.querySelector(".theme-toggle");
  toggle?.addEventListener("click", () => {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  });

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const layers = [...document.querySelectorAll("[data-depth]")].map((el) => ({
    el,
    depth: parseFloat(el.dataset.depth) || 0,
  }));
  if (!layers.length) return;

  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let frame = null;

  const render = () => {
    current.x += (target.x - current.x) * 0.08;
    current.y += (target.y - current.y) * 0.08;
    for (const { el, depth } of layers) {
      el.style.transform = `translate3d(${(-current.x * depth).toFixed(2)}px, ${(-current.y * depth).toFixed(2)}px, 0)`;
    }
    const settled = Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001;
    frame = settled ? null : requestAnimationFrame(render);
  };

  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    target.x = (e.clientX / innerWidth) * 2 - 1;
    target.y = (e.clientY / innerHeight) * 2 - 1;
    frame ??= requestAnimationFrame(render);
  }, { passive: true });
})();
