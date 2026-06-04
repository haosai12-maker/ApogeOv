function sanitizeInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/</g, "")
    .replace(/>/g, "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\r/g, "")
    .replace(/\n/g, "")
    .trim();
}

function sanitizeSubject(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/\r/g, "")
    .replace(/\n/g, "")
    .replace(/Cc:/gi, "")
    .replace(/Bcc:/gi, "")
    .replace(/Content-Type:/gi, "")
    .replace(/MIME-Version:/gi, "")
    .trim()
    .substring(0, 100);
}

function buildMailtoUrl(to: string, data: FormData): string {
  const name = sanitizeInput(String(data.get("name") ?? ""));
  const email = sanitizeInput(String(data.get("email") ?? ""));
  const phone = sanitizeInput(String(data.get("phone") ?? ""));
  const message = sanitizeInput(String(data.get("message") ?? ""));

  const subject = encodeURIComponent(`Contacto web ApogeOv — ${name || "Sin nombre"}`);
  const body = encodeURIComponent(
    [
      "Nuevo mensaje desde el formulario de contacto",
      "",
      name && `Nombre: ${name}`,
      email && `Email: ${email}`,
      phone && `Teléfono: ${phone}`,
      "",
      "Mensaje:",
      message,
    ]
      .filter(Boolean)
      .join("\n")
  );

  return `mailto:${to}?subject=${subject}&body=${body}`;
}

const FORMSPREE_ID = "mjgzqwek";

const COOLDOWN_MS = 10_000;
let lastSubmitTime = 0;

async function sendViaFormSubmit(data: FormData): Promise<boolean> {
  const name = sanitizeInput(String(data.get("name") ?? ""));
  const email = sanitizeInput(String(data.get("email") ?? ""));
  const phone = sanitizeInput(String(data.get("phone") ?? ""));
  const message = sanitizeInput(String(data.get("message") ?? ""));

  const safeName = sanitizeSubject(name || "Sin nombre");

  const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      phone,
      message,
      _subject: `Contacto web ApogeOv — ${safeName}`,
    }),
  });

  return response.ok;
}

function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
  if (!form) return;

  const submitBtn = form.querySelector<HTMLButtonElement>("[data-contact-submit]");
  const successMsg = form.querySelector<HTMLElement>("[data-form-success]");
  const errorMsg = form.querySelector<HTMLElement>("[data-form-error]");
  const defaultLabel = submitBtn?.textContent ?? "Enviar email";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const now = Date.now();
    if (now - lastSubmitTime < COOLDOWN_MS) {
      const remaining = Math.ceil((COOLDOWN_MS - (now - lastSubmitTime)) / 1000);
      if (submitBtn) {
        submitBtn.textContent = `Espera ${remaining}s`;
        submitBtn.disabled = true;
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = defaultLabel;
        }, remaining * 1000);
      }
      return;
    }

    successMsg?.classList.add("hidden");
    errorMsg?.classList.add("hidden");

    const rawData = new FormData(form);
    const name = String(rawData.get("name") ?? "").trim();
    const email = String(rawData.get("email") ?? "").trim();
    const phone = String(rawData.get("phone") ?? "").trim();
    const message = String(rawData.get("message") ?? "").trim();

    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedMessage = sanitizeInput(message);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      if (submitBtn) {
        submitBtn.textContent = "Email inválido";
        submitBtn.disabled = false;
      }
      return;
    }

    if (
      sanitizedName !== name ||
      sanitizedEmail !== email ||
      sanitizedPhone !== phone ||
      sanitizedMessage !== message
    ) {
      if (submitBtn) {
        submitBtn.textContent = "Caracteres no permitidos";
        submitBtn.disabled = false;
      }
      return;
    }

    const data = new FormData(form);
    data.set("name", sanitizedName);
    data.set("email", sanitizedEmail);
    data.set("phone", sanitizedPhone);
    data.set("message", sanitizedMessage);

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando…";
    }

    try {
      const sent = await sendViaFormSubmit(data);
      if (sent) {
        lastSubmitTime = Date.now();
        form.reset();
        if (submitBtn) submitBtn.textContent = defaultLabel;
        successMsg?.classList.remove("hidden");
        setTimeout(() => successMsg?.classList.add("hidden"), 5000);
        return;
      }
    } catch {
      /* fallback below */
    }

    errorMsg?.classList.remove("hidden");
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = defaultLabel;
    }
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initContactForm);
  } else {
    initContactForm();
  }
  document.addEventListener("astro:page-load", initContactForm);
}
