const PANEL_MS = 400;

function initNavDrawer(): void {
  const drawer = document.querySelector<HTMLElement>("[data-nav-drawer]");
  const openBtn = document.querySelector<HTMLButtonElement>("[data-nav-open]");
  const closeBtn =
    document.querySelector<HTMLButtonElement>("[data-nav-close]");
  const backdrop = document.querySelector<HTMLElement>("[data-nav-backdrop]");
  const panel = drawer?.querySelector<HTMLElement>("[data-nav-panel]");

  if (!drawer || !openBtn || !panel) return;

  const links = drawer.querySelectorAll<HTMLAnchorElement>(".nav-drawer__link");
  let closeTimer: ReturnType<typeof setTimeout> | null = null;

  const setOpen = (open: boolean): void => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }

    if (open) {
      drawer.classList.add("is-active");
      drawer.dataset.open = "true";
    } else {
      drawer.dataset.open = "false";
      closeTimer = setTimeout(() => {
        drawer.classList.remove("is-active");
        closeTimer = null;
      }, PANEL_MS);
    }

    openBtn.setAttribute("aria-expanded", String(open));
    openBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    drawer.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("nav-drawer-open", open);
    document.documentElement.classList.toggle("nav-drawer-open", open);

    if (open) {
      requestAnimationFrame(() => closeBtn?.focus());
    } else {
      requestAnimationFrame(() => openBtn.focus());
    }
  };

  const toggle = (): void => {
    setOpen(drawer.dataset.open !== "true");
  };

  const close = (): void => setOpen(false);

  openBtn.addEventListener("click", toggle);
  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);

  links.forEach((link) => {
    link.addEventListener("click", close);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && drawer.dataset.open === "true") {
      close();
    }
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavDrawer);
  } else {
    initNavDrawer();
  }
  document.addEventListener("astro:page-load", initNavDrawer);
}
