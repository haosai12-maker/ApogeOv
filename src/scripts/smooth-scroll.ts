const DURATION = 650;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function animateScrollTo(targetY: number): void {
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(now: number): void {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / DURATION, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function initSmoothScroll(): void {
  document.addEventListener("click", (e) => {
    const link = (e.target as HTMLElement).closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href.indexOf("#") === -1) return;

    const hashIndex = href.indexOf("#");
    const pathPart = href.slice(0, hashIndex) || window.location.pathname;
    const hash = href.slice(hashIndex);
    const onHome =
      window.location.pathname === "/" ||
      window.location.pathname.endsWith("index.html");

    if (pathPart && pathPart !== "/" && pathPart !== window.location.pathname) {
      return;
    }

    if (!onHome && pathPart === "/") return;

    e.preventDefault();

    if (hash === "#") {
      animateScrollTo(0);
      history.pushState(null, "", "/");
      return;
    }

    const target = document.querySelector(hash);
    if (!target) return;

    const nav = document.querySelector("nav");
    const offset = (nav ? nav.offsetHeight : 80) + 16;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

    animateScrollTo(top);
    history.pushState(null, "", hash);
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSmoothScroll);
  } else {
    initSmoothScroll();
  }
  document.addEventListener("astro:page-load", initSmoothScroll);
}
