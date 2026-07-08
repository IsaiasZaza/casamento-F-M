const cover = document.getElementById("cover");
const invite = document.getElementById("invite");
const openBtn = document.getElementById("openBtn");
const bow = document.querySelector(".bow");

const PIX_KEY = "06707990179";
const WHATSAPP_NUMBER = "556195918023";

// trava o scroll da página enquanto a capa está fechada (relevante no desktop)
document.documentElement.classList.add("locked");

let opened = false;

function openInvite() {
  if (opened) return;
  opened = true;

  bow.classList.add("is-untie");
  invite.classList.add("is-visible");
  invite.setAttribute("aria-hidden", "false");
  document.documentElement.classList.remove("locked");

  setTimeout(() => {
    cover.classList.add("is-open");
  }, 450);
}

openBtn.addEventListener("click", openInvite);
cover.addEventListener("click", openInvite);

/* =================== Modais =================== */

const modals = {
  rsvp: document.getElementById("rsvpModal"),
  pix: document.getElementById("pixModal"),
};

function openModal(id) {
  modals[id].classList.add("is-open");
  modals[id].setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  modals[id].classList.remove("is-open");
  modals[id].setAttribute("aria-hidden", "true");

  if (!Object.values(modals).some((modal) => modal.classList.contains("is-open"))) {
    document.body.style.overflow = "";
  }
}

document.querySelectorAll("[data-close-modal]").forEach((el) => {
  el.addEventListener("click", () => closeModal(el.dataset.closeModal));
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  Object.entries(modals).forEach(([id, modal]) => {
    if (modal.classList.contains("is-open")) closeModal(id);
  });
});

/* =================== RSVP — Confirmação de Presença =================== */

const rsvpBtn = document.getElementById("rsvpBtn");
const rsvpForm = document.getElementById("rsvpForm");
const rsvpName = document.getElementById("rsvpName");
const rsvpGuests = document.getElementById("rsvpGuests");
const rsvpMessage = document.getElementById("rsvpMessage");
const rsvpPreview = document.getElementById("rsvpPreview");
const rsvpMinus = document.getElementById("rsvpMinus");
const rsvpPlus = document.getElementById("rsvpPlus");

let guestCount = 1;

function guestLabel(count) {
  return count === 1 ? "1 pessoa" : `${count} pessoas`;
}

function buildRsvpMessage(name, guests, message) {
  const trimmedName = name.trim();
  const trimmedMessage = message.trim();
  const lines = [
    `Olá, Felipe e Mirian!`,
    "",
    `Meu nome é *${trimmedName}* e confirmo minha presença no casamento de vocês, no dia *17/10/2026 às 15h*.`,
    "",
    `Total de convidados: *${guestLabel(guests)}*.`,
  ];

  if (trimmedMessage) {
    lines.push("", trimmedMessage);
  }

  lines.push("", "Com carinho,", trimmedName);

  return lines.join("\n");
}

function updateRsvpPreview() {
  const name = rsvpName.value.trim();
  const previewName = name || "Seu nome";

  rsvpPreview.textContent = buildRsvpMessage(previewName, guestCount, rsvpMessage.value)
    .replace(/\*/g, "");
}

function setGuestCount(value) {
  guestCount = Math.min(10, Math.max(1, value));
  rsvpGuests.textContent = String(guestCount);
  updateRsvpPreview();
}

rsvpBtn.addEventListener("click", () => {
  openModal("rsvp");
  updateRsvpPreview();
  setTimeout(() => rsvpName.focus(), 300);
});

rsvpMinus.addEventListener("click", () => setGuestCount(guestCount - 1));
rsvpPlus.addEventListener("click", () => setGuestCount(guestCount + 1));
rsvpName.addEventListener("input", updateRsvpPreview);
rsvpMessage.addEventListener("input", updateRsvpPreview);

rsvpForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = rsvpName.value.trim();
  if (!name) {
    rsvpName.classList.add("is-invalid");
    rsvpName.focus();
    return;
  }

  rsvpName.classList.remove("is-invalid");

  const text = encodeURIComponent(buildRsvpMessage(name, guestCount, rsvpMessage.value));
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener");
  closeModal("rsvp");
});

updateRsvpPreview();

/* =================== PIX — Lista de Presentes =================== */

const pixBtn = document.getElementById("pixBtn");
const copyPixBtn = document.getElementById("copyPixBtn");

pixBtn.addEventListener("click", () => openModal("pix"));

copyPixBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(PIX_KEY);
    copyPixBtn.textContent = "Chave copiada!";
    copyPixBtn.classList.add("is-copied");
  } catch {
    copyPixBtn.textContent = PIX_KEY;
  }
});

copyPixBtn.addEventListener("blur", () => {
  copyPixBtn.classList.remove("is-copied");
  copyPixBtn.textContent = "Copiar chave Pix";
});

/* =================== Interações do footer =================== */
const footerTop = document.getElementById("footerTop");
const footerRsvp = document.getElementById("footerRsvp");

if (footerTop) {
  footerTop.addEventListener("click", () => {
    const inviteEl = document.querySelector(".invite");
    const pageScrolls = window.matchMedia("(min-width: 768px)").matches;

    if (pageScrolls) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (inviteEl) {
      inviteEl.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

if (footerRsvp) {
  footerRsvp.addEventListener("click", () => {
    openModal("rsvp");
    updateRsvpPreview();
    setTimeout(() => rsvpName.focus(), 300);
  });
}

const footerPix = document.getElementById("footerPix");
if (footerPix) {
  footerPix.addEventListener("click", () => openModal("pix"));
}
