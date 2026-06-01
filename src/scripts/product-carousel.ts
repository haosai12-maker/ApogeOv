/** Carrusel de fotos por producto: deslizar con transform (mismo patrón que destacados / Instagram) */
export function initProductCarousels(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-product-carousel]").forEach((rootEl) => {
    if (rootEl.dataset.carouselReady === "true") return;

    const viewport = rootEl.querySelector<HTMLElement>(".product-carousel__viewport");
    const track = rootEl.querySelector<HTMLElement>("[data-carousel-track]");
    const slides = Array.from(
      rootEl.querySelectorAll<HTMLElement>("[data-carousel-slide]")
    );
    if (!viewport || !track || slides.length <= 1) return;

    const dots = Array.from(
      rootEl.querySelectorAll<HTMLButtonElement>("[data-carousel-dot]")
    );
    const counter = rootEl.querySelector<HTMLElement>("[data-carousel-counter]");
    const prevBtn = rootEl.querySelector<HTMLButtonElement>("[data-carousel-prev]");
    const nextBtn = rootEl.querySelector<HTMLButtonElement>("[data-carousel-next]");

    let index = 0;
    let slideWidth = 0;
    let touchStartX = 0;
    let touchDeltaX = 0;

    const measure = (): boolean => {
      slideWidth = viewport.clientWidth;
      if (slideWidth <= 0) return false;
      slides.forEach((slide) => {
        slide.style.flex = `0 0 ${slideWidth}px`;
        slide.style.width = `${slideWidth}px`;
      });
      return true;
    };

    const syncUi = (i: number): void => {
      index = ((i % slides.length) + slides.length) % slides.length;
      slides.forEach((slide, si) => {
        slide.classList.toggle("is-active", si === index);
      });
      dots.forEach((dot, di) => {
        dot.classList.toggle("is-active", di === index);
      });
      if (counter) counter.textContent = `${index + 1} / ${slides.length}`;
    };

    const goTo = (nextIndex: number, animate = true): void => {
      if (!slideWidth && !measure()) return;
      syncUi(nextIndex);
      track.style.transition = animate ? "transform 0.5s ease-in-out" : "none";
      track.style.transform = `translateX(-${index * slideWidth}px)`;
    };

    const suppressCardClick = (): void => {
      rootEl.dataset.suppressClick = "true";
      window.setTimeout(() => {
        delete rootEl.dataset.suppressClick;
      }, 350);
    };

    prevBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      goTo(index - 1);
    });

    nextBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      goTo(index + 1);
    });

    dots.forEach((dot) => {
      dot.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const i = Number(dot.dataset.carouselDot);
        if (!Number.isNaN(i)) goTo(i);
      });
    });

    viewport.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0]?.clientX ?? 0;
        touchDeltaX = 0;
      },
      { passive: true }
    );

    viewport.addEventListener(
      "touchmove",
      (e) => {
        touchDeltaX = (e.touches[0]?.clientX ?? 0) - touchStartX;
      },
      { passive: true }
    );

    viewport.addEventListener("touchend", () => {
      const threshold = 50;
      if (touchDeltaX > threshold) {
        goTo(index - 1);
        suppressCardClick();
      } else if (touchDeltaX < -threshold) {
        goTo(index + 1);
        suppressCardClick();
      }
      touchDeltaX = 0;
    });

    const boot = (): void => {
      if (!measure()) {
        requestAnimationFrame(boot);
        return;
      }
      rootEl.dataset.carouselReady = "true";
      goTo(0, false);

      const resizeObserver = new ResizeObserver(() => {
        const prev = index;
        measure();
        goTo(prev, false);
      });
      resizeObserver.observe(viewport);
    };

    boot();
  });
}

declare global {
  interface Window {
    __initProductCarousels?: typeof initProductCarousels;
  }
}
