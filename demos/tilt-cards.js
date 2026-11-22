const cards = document.querySelectorAll(".demo-card");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const coarsePointer = window.matchMedia("(pointer: coarse)");

if (!reduceMotion.matches && !coarsePointer.matches) {
  cards.forEach((card) => {
    const maxTilt = 10;

    card.addEventListener("pointermove", (event) => {
      card.classList.remove("is-resetting");

      const rect = card.getBoundingClientRect();
      const normX = (event.clientX - rect.left) / rect.width - 0.5;
      const normY = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateX = (-normY * maxTilt * 2).toFixed(2);
      const rotateY = (normX * maxTilt * 2).toFixed(2);

      card.style.transform =
        `translateY(-3px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.setProperty("--glare-x", `${((normX + 0.5) * 100).toFixed(1)}%`);
      card.style.setProperty("--glare-y", `${((normY + 0.5) * 100).toFixed(1)}%`);
    });

    card.addEventListener("pointerleave", () => {
      card.classList.add("is-resetting");
      card.style.transform = "translateY(0) rotateX(0deg) rotateY(0deg)";
      card.style.setProperty("--glare-x", "50%");
      card.style.setProperty("--glare-y", "50%");

      window.setTimeout(() => card.classList.remove("is-resetting"), 500);
    });
  });
}
