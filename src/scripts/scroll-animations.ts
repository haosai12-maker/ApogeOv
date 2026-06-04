function initScrollReveal(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  document
    .querySelectorAll(
      ".reveal-up, .reveal-fade, .reveal-scale, .stagger-children"
    )
    .forEach((el) => observer.observe(el));
}

function initParallax(): void {
  const parallaxEls = document.querySelectorAll<HTMLElement>(
    "[data-parallax]"
  );

  if (parallaxEls.length === 0) return;

  let ticking = false;

  function update(): void {
    const scrollY = window.pageYOffset;

    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax || "0.3");
      const parent = el.parentElement;
      if (!parent) return;

      const parentRect = parent.getBoundingClientRect();
      const parentTop = parentRect.top + scrollY;
      const parentBottom = parentTop + parentRect.height;
      const windowBottom = scrollY + window.innerHeight;
      const windowTop = scrollY;

      if (parentBottom < windowTop || parentTop > windowBottom) return;

      const relativeScroll =
        (scrollY - parentTop) / (parentRect.height + window.innerHeight);
      const offset = relativeScroll * speed * parentRect.height * 0.5;

      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    });

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  update();
}

function initImageReveal(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
          }
          img.classList.add("is-loaded");
          observer.unobserve(img);
        }
      });
    },
    { threshold: 0.1, rootMargin: "200px 0px" }
  );

  document.querySelectorAll("img[data-src]").forEach((img) => {
    observer.observe(img);
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initScrollReveal();
      initParallax();
      initImageReveal();
    });
  } else {
    initScrollReveal();
    initParallax();
    initImageReveal();
  }
  document.addEventListener("astro:page-load", () => {
    initScrollReveal();
    initParallax();
    initImageReveal();
  });
}
