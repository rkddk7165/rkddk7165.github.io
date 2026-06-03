const pages = [...document.querySelectorAll("[data-page]")];
const root = document.querySelector(".snap-root");
const jumpers = [...document.querySelectorAll("[data-jump]")];
const dots = [...document.querySelectorAll(".page-indicator button")];
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let current = 0;
let locked = false;

const clamp = (value) => Math.max(0, Math.min(value, pages.length - 1));

const setActive = (index) => {
  current = clamp(index);
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === current);
  });
};

const goTo = (index) => {
  const next = clamp(index);
  if (next === current && locked) return;

  locked = true;
  setActive(next);
  if (window.innerWidth <= 980) {
    pages[next].scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "start"
    });
  } else {
    root.style.transitionDuration = prefersReduced ? "0ms" : "760ms";
    root.style.transform = `translateY(-${next * 100}vh)`;
  }

  window.setTimeout(() => {
    locked = false;
  }, prefersReduced ? 120 : 760);
};

jumpers.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    goTo(Number(item.dataset.jump));
  });
});

window.addEventListener("wheel", (event) => {
  if (window.innerWidth <= 980) return;
  event.preventDefault();
  if (locked) return;

  if (Math.abs(event.deltaY) < 4) return;
  goTo(current + Math.sign(event.deltaY));
}, { passive: false });

window.addEventListener("keydown", (event) => {
  if (["ArrowDown", "PageDown", " "].includes(event.key)) {
    event.preventDefault();
    goTo(current + 1);
  }

  if (["ArrowUp", "PageUp"].includes(event.key)) {
    event.preventDefault();
    goTo(current - 1);
  }
});

let touchStartY = 0;
window.addEventListener("touchstart", (event) => {
  touchStartY = event.touches[0].clientY;
}, { passive: true });

window.addEventListener("touchend", (event) => {
  if (window.innerWidth <= 980 || locked) return;
  const diff = touchStartY - event.changedTouches[0].clientY;
  if (Math.abs(diff) > 24) {
    goTo(current + Math.sign(diff));
  }
}, { passive: true });

window.addEventListener("resize", () => {
  if (window.innerWidth <= 980) {
    root.style.transform = "";
    return;
  }

  root.style.transform = `translateY(-${current * 100}vh)`;
});

setActive(0);
