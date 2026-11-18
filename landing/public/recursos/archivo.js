"use strict";

const header = document.getElementById("cabecera");
const menuButton = document.getElementById("boton-menu");
const compactMenu = window.matchMedia("(max-width: 60rem)");

function setMenuOpen(open) {
  menuButton.setAttribute("aria-expanded", String(open));
}

menuButton.addEventListener("click", () => {
  setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
});

header.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (link && compactMenu.matches) {
    setMenuOpen(false);
    document.getElementById(link.hash.slice(1)).focus({ preventScroll: true });
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuButton.focus();
  }
});

document.addEventListener("pointerdown", (event) => {
  if (!header.contains(event.target)) setMenuOpen(false);
});
header.addEventListener("focusout", (event) => {
  if (!header.contains(event.relatedTarget)) setMenuOpen(false);
});
compactMenu.addEventListener("change", () => setMenuOpen(false));
header.classList.add("nav-ready");
menuButton.hidden = false;

const records = Array.from(document.querySelectorAll(".record"));
const recordsUrl = "https://ldlzzhfaxyncedtwvfpb.supabase.co/rest/v1/arocena_fichas?select=ficha,anio,codigo&order=ficha.asc";
// Clave publicable de navegador. El rol anon solo puede leer estas fichas.
const publishableKey = "sb_publishable_yKc5BL1NZucWA2RXtQDaqw_ynQ007nm";
let solution;

async function cargarFichas() {
  const response = await fetch(recordsUrl, {
    headers: { apikey: publishableKey },
    signal: AbortSignal.timeout(4500)
  });
  if (!response.ok) throw new Error("No se pudo leer el catálogo de fichas.");
  const fichas = await response.json();
  const letras = ["A", "B", "C"];
  if (!Array.isArray(fichas) || fichas.length !== records.length ||
      !fichas.every((f, i) => f?.ficha === letras[i] &&
        Number.isInteger(f.anio) && f.anio >= 1 && f.anio <= 9999 &&
        Number.isInteger(f.codigo) && f.codigo >= 0 && f.codigo <= 9) ||
      new Set(fichas.map(f => f.anio)).size !== fichas.length) {
    throw new Error("Fichas incompletas.");
  }
  fichas.forEach((ficha, i) => {
    records[i].querySelector(".record-date dd").textContent = ficha.anio;
    records[i].querySelector(".record-code dd").textContent = ficha.codigo;
  });
}

const puzzle = document.getElementById("reto");
const codeInput = document.getElementById("codigo");
const feedback = document.getElementById("resultado");
const hint = document.getElementById("ayuda");
const retry = puzzle.querySelector(".retry");

function updateRetry() {
  retry.hidden = !codeInput.value && !feedback.textContent && !hint.open;
}

function clearFeedback() {
  feedback.textContent = "";
  delete feedback.dataset.state;
  codeInput.removeAttribute("aria-invalid");
}

function checkCode(value) {
  if (value === "") return "Escribe un código de tres dígitos.";
  if (!/^[0-9]+$/.test(value)) return "Usa solo dígitos del 0 al 9 para escribir el código.";
  if (value.length === 1) return "Faltan dos dígitos para completar el código.";
  if (value.length === 2) return "Falta un dígito para completar el código.";
  if (value.length > 3) return "El código debe tener exactamente tres dígitos.";
  if (value !== solution) return "Revisa las fechas y empieza por la más antigua.";
  return "";
}

puzzle.addEventListener("submit", (event) => {
  event.preventDefault();
  const error = checkCode(codeInput.value.trim());
  feedback.dataset.state = error ? "error" : "success";
  codeInput.setAttribute("aria-invalid", String(Boolean(error)));
  feedback.textContent = error || "¡Archivo abierto! Ordenar las pistas en el tiempo te ayudó a reconstruir la historia.";
  updateRetry();
});

codeInput.addEventListener("input", () => {
  clearFeedback();
  updateRetry();
});
hint.addEventListener("toggle", updateRetry);
puzzle.addEventListener("reset", () => {
  clearFeedback();
  hint.open = false;
  retry.hidden = true;
  codeInput.focus();
});
async function prepararReto() {
  if (location.protocol === "https:" || location.protocol === "http:") {
    try {
      await cargarFichas();
    } catch {
      document.querySelector(".demo-note").append(" Usando la copia local de las fichas.");
    }
  }
  const ordenadas = records.map(record => ({
    anio: Number(record.querySelector(".record-date dd").textContent),
    codigo: record.querySelector(".record-code dd").textContent.trim()
  })).sort((a, b) => a.anio - b.anio);
  solution = ordenadas.map(ficha => ficha.codigo).join("");
  hint.querySelector("p").textContent = "Empieza por la ficha de " + ordenadas[0].anio + ".";
  puzzle.hidden = false;
}
prepararReto();
