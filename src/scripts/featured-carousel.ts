/** Carrusel destacados: 1 card en móvil, 3 en desktop (como Instagram en odontologia-silk) */
export function initFeaturedCarousels(): void {
  const track = document.querySelector<HTMLElement>("[data-featured-carousel]");
  const inner = track?.querySelector<HTMLElement>("[data-featured-inner]");
  const dotsContainer = track?.querySelector<HTMLElement>("[data-featured-dots]");
  const slides = inner?.querySelectorAll<HTMLElement>("[data-featured-slide]");

  if (!track || !inner || !dotsContainer || !slides || slides.length === 0) return;
  if (track.dataset.featuredReady === "true") return;
  track.dataset.featuredReady = "true";

  let current = 0;
  let touchStartX = 0;
  let touchDeltaX = 0;

  const getSlidesPerView = (): number => {
    if (window.matchMedia("(min-width: 1024px)").matches) return 3;
    if (window.matchMedia("(min-width: 640px)").matches) return 2;
    return 1;
  };

  const getGap = (): number => {
    const styles = getComputedStyle(inner);
    const gap = parseFloat(styles.columnGap || styles.gap || "0");
    return Number.isNaN(gap) ? 0 : gap;
  };

  const maxIndex = (): number => Math.max(0, slides.length - getSlidesPerView());

  const slideStep = (): number => slides[0].offsetWidth + getGap();

  const goTo = (index: number, animate = true): void => {
    current = Math.max(0, Math.min(index, maxIndex()));
    inner.style.transition = animate ? "transform 0.5s ease-in-out" : "none";
    inner.style.transform = `translateX(-${current * slideStep()}px)`;
    dotsContainer.querySelectorAll("button").forEach((btn, i) => {
      btn.classList.toggle("is-active", i === current);
    });
    dotsContainer.hidden = maxIndex() === 0;
  };

  const buildDots = (): void => {
    dotsContainer.innerHTML = "";
    const total = maxIndex() + 1;
    if (total <= 1) {
      dotsContainer.hidden = true;
      return;
    }
    dotsContainer.hidden = false;
    for (let i = 0; i < total; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `featured-carousel__dot${i === current ? " is-active" : ""}`;
      dot.setAttribute("aria-label", `Ver producto destacado ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  };

  const boot = (): void => {
    if (slides[0].offsetWidth <= 0) {
      requestAnimationFrame(boot);
      return;
    }
    buildDots();
    goTo(Math.min(current, maxIndex()), false);
  };

  window.addEventListener("resize", () => {
    buildDots();
    goTo(Math.min(current, maxIndex()), false);
  });

  track.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0]?.clientX ?? 0;
      touchDeltaX = 0;
    },
    { passive: true }
  );

  track.addEventListener(
    "touchmove",
    (e) => {
      touchDeltaX = (e.touches[0]?.clientX ?? 0) - touchStartX;
    },
    { passive: true }
  );

  track.addEventListener("touchend", () => {
    if (maxIndex() === 0) return;
    const threshold = 50;
    if (touchDeltaX > threshold) goTo(current - 1);
    else if (touchDeltaX < -threshold) goTo(current + 1);
    touchDeltaX = 0;
  });

  boot();
}

if (typeof document !== "undefined") {
  const run = () => initFeaturedCarousels();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
  document.addEventListener("astro:page-load", run);
}
