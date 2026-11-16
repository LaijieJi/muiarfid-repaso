import { almacenLocal, cargarProgreso, guardarProgreso, hoyLocal, pendientes, responder } from "./leitner.js";
import { proteger, restaurar } from "./formulas.js";

const REPO_EDITAR = "https://github.com/LaijieJi/muiarfid-repaso/edit/main/";
const CLAVE_SELECCION = "muiarfid-repaso:seleccion";
// Orden del máster por bloques. Las siglas sin nombre muestran solo la chapa.
const NOMBRES = {
  RFA: "Reconocimiento de Formas y Aprendizaje Automático", TMH: "Técnicas Metaheurísticas",
  LC: "Lingüística Computacional", GPC: "Gráficos por Computador",
  PEE: "Predicción Estructurada Estadística", RNA: "Redes Neuronales Artificiales",
  TA: "Traducción Automática", TLH: "Tecnologías del Lenguaje Humano",
  SMA: "Sistemas Multiagente", PIN: "Planificación Automática",
  VPC: "", SR: "", HAIA: "", ARA: "", ALC: "", RES: "Reconocimiento de la Escritura",
};
const ORDEN = Object.keys(NOMBRES);
const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const app = document.getElementById("app");

let tarjetas = [];
let progreso = cargarProgreso();
// Se guardan las unidades excluidas, de modo que una unidad nueva aparece marcada.
let seleccion = cargarSeleccion();
let teclas = {};

function cargarSeleccion() {
  try {
    const s = JSON.parse(almacenLocal().getItem(CLAVE_SELECCION));
    if (s && Array.isArray(s.excluidas) && (s.modo === "tarjetas" || s.modo === "problemas")) return s;
  } catch {
    // Sin almacenamiento o con datos corruptos se empieza con todo marcado.
  }
  return { excluidas: [], modo: "tarjetas" };
}

function guardarSeleccion() {
  try {
    almacenLocal().setItem(CLAVE_SELECCION, JSON.stringify(seleccion));
  } catch {
    // Igual que el progreso: sin almacenamiento no se recuerda.
  }
}

function el(etiqueta, atributos = {}, ...hijos) {
  const nodo = document.createElement(etiqueta);
  for (const [clave, valor] of Object.entries(atributos)) {
    if (clave.startsWith("on")) nodo.addEventListener(clave.slice(2), valor);
    else if (valor === true) nodo.setAttribute(clave, "");
    else if (valor !== false && valor != null) nodo.setAttribute(clave, valor);
  }
  nodo.append(...hijos.filter(h => h != null && h !== false));
  return nodo;
}

function renderizar(md, enLinea = false) {
  const nodo = el(enLinea ? "span" : "div", { class: enLinea ? null : "md" });
  const { texto, formulas } = proteger(md);
  const html = enLinea ? marked.parseInline(texto) : marked.parse(texto);
  nodo.innerHTML = DOMPurify.sanitize(restaurar(html, formulas));
  renderMathInElement(nodo, {
    delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }],
    throwOnError: false,
  });
  return nodo;
}

function pantalla(...hijos) {
  teclas = {};
  app.replaceChildren(...hijos);
  window.scrollTo(0, 0);
}

function boton(texto, onclick, clase = "") {
  return el("button", { type: "button", class: `boton ${clase}`.trim(), onclick }, ...[].concat(texto));
}

const chapa = sigla => el("span", { class: "chapa" }, sigla);
const esEjercicio = t => t.tipo !== "tarjeta";
const delModo = t => (seleccion.modo === "problemas") === esEjercicio(t);
const nombreModo = n => seleccion.modo === "problemas" ? (n === 1 ? "problema" : "problemas") : (n === 1 ? "tarjeta" : "tarjetas");

function seleccionadas() {
  return tarjetas.filter(t => !seleccion.excluidas.includes(t.fichero) && delModo(t));
}

// sigla -> fichero -> {nombre, tarjetas}, con las siglas en el orden del máster.
function red() {
  const grupos = new Map();
  for (const t of tarjetas) {
    if (!grupos.has(t.sigla)) grupos.set(t.sigla, new Map());
    const unidades = grupos.get(t.sigla);
    if (!unidades.has(t.fichero)) unidades.set(t.fichero, { nombre: `${t.unidad} ${t.titulo_unidad}`, tarjetas: [] });
    unidades.get(t.fichero).tarjetas.push(t);
  }
  return [...grupos].sort(([a], [b]) => ORDEN.indexOf(a) - ORDEN.indexOf(b));
}

function mostrarInicio() {
  const estaciones = [];
  const estado = el("p", { class: "estado", "aria-live": "polite" });
  const empezarBoton = boton("", empezar, "principal");
  const todoBoton = boton("Repasar todo", repasarTodo);

  // Las cifras cambian en su sitio, sin volver a pintar la red.
  const actualizar = () => {
    const hoy = hoyLocal();
    for (const { fichero, unidad, nodo, input, cifraHoy, cifraTotal } of estaciones) {
      const propias = unidad.tarjetas.filter(delModo);
      const marcada = !seleccion.excluidas.includes(fichero);
      input.checked = marcada;
      input.disabled = propias.length === 0;
      nodo.classList.toggle("vacia", propias.length === 0);
      nodo.style.setProperty("--peso", propias.length);
      cifraHoy.textContent = pendientes(propias, progreso, hoy).length;
      cifraTotal.textContent = propias.length;
    }
    const elegidas = seleccionadas();
    const cuantas = pendientes(elegidas, progreso, hoy).length;
    empezarBoton.replaceChildren(`Repasar ${cuantas} ${nombreModo(cuantas)}`);
    empezarBoton.hidden = cuantas === 0;
    todoBoton.classList.toggle("principal", cuantas === 0);
    todoBoton.disabled = elegidas.length === 0;
    estado.textContent = elegidas.length === 0 ? "Elige al menos una unidad"
      : cuantas === 0 ? "No te toca nada hoy en esta selección." : "";
    estado.hidden = !estado.textContent;
    guardarSeleccion();
  };

  const modos = el("fieldset", { class: "segmentado" },
    el("legend", { class: "oculto" }, "Qué repasar"),
    ...[["tarjetas", "Tarjetas"], ["problemas", "Problemas"]].map(([valor, texto]) =>
      el("label", {},
        el("input", {
          type: "radio", name: "modo", value: valor, checked: seleccion.modo === valor,
          onchange: () => { seleccion.modo = valor; actualizar(); },
        }),
        texto)));

  const lineas = red().map(([sigla, unidades]) =>
    el("section", { class: "linea", "data-sigla": sigla, "aria-label": NOMBRES[sigla] || sigla },
      el("h2", { class: "linea-cab" }, chapa(sigla), NOMBRES[sigla] || null),
      el("ul", { class: "tramo" }, ...[...unidades].map(([fichero, unidad]) => {
        const input = el("input", {
          type: "checkbox",
          onchange: e => {
            seleccion.excluidas = seleccion.excluidas.filter(f => f !== fichero);
            if (!e.target.checked) seleccion.excluidas.push(fichero);
            actualizar();
          },
        });
        const cifraHoy = el("span", { class: "cifra hoy" });
        const cifraTotal = el("span", { class: "cifra total" });
        const nodo = el("label", { class: "estacion" },
          input, el("span", { class: "estacion-nombre" }, unidad.nombre), cifraHoy, cifraTotal);
        estaciones.push({ fichero, unidad, nodo, input, cifraHoy, cifraTotal });
        return el("li", {}, nodo);
      }))));

  pantalla(
    el("header", { class: "cabecera" }, el("h1", { class: "marca" }, "Repaso MUIARFID"), modos),
    el("div", { class: "columnas", "aria-hidden": "true" }, el("span"), el("span", {}, "hoy"), el("span", {}, "total")),
    el("main", { class: "red" }, ...lineas),
    el("div", { class: "accion" }, estado, el("div", { class: "botones" }, empezarBoton, todoBoton)),
  );
  actualizar();
}

function empezar() {
  const cola = pendientes(seleccionadas(), progreso, hoyLocal());
  if (cola.length) mostrarSesion(cola);
}

function repasarTodo() {
  const cola = seleccionadas();
  if (cola.length) mostrarSesion(cola);
}

function enlaceEditar(fichero) {
  const ruta = fichero.split("/").map(encodeURIComponent).join("/");
  return el("a", { class: "editar", href: REPO_EDITAR + ruta, target: "_blank", rel: "noopener" }, "Proponer un cambio");
}

// Una estación por tarjeta de la sesión. Cada una conserva la marca de su primer intento.
function franja(orden, marcas, actual = null) {
  // Por debajo de unos 16 px por estación no cabe el anillo.
  const densa = orden.length * 16 > app.clientWidth - 32;
  return el("ol", { class: densa ? "franja densa" : "franja", "aria-hidden": "true" }, ...orden.map(t =>
    el("li", { "data-sigla": t.sigla, class: marcas.get(t.id) || (t.id === actual ? "actual" : null) })));
}

function mostrarSesion(inicial) {
  const cola = [...inicial];
  const orden = [...inicial];
  const marcas = new Map();
  const textos = esEjercicio(inicial[0]) ? ["Me ha salido", "No me ha salido"] : ["La sabía", "No la sabía"];

  const contestar = (t, acierto) => {
    progreso[t.id] = responder(progreso[t.id], acierto, hoyLocal());
    guardarProgreso(progreso);
    if (!marcas.has(t.id)) marcas.set(t.id, acierto ? "sabida" : "fallada");
    cola.shift();
    if (!acierto) cola.push(t);
    cola.length ? siguiente() : mostrarFin(orden, marcas, textos);
  };

  const siguiente = () => {
    const t = cola[0];
    const accion = el("div", { class: "accion" });
    const revelado = el("div");
    const pregunta = el("h1", { class: "pregunta", tabindex: "-1" },
      esEjercicio(t) ? el("span", { class: "tipo" }, t.tipo === "problema" ? "Problema: " : "Demostración: ") : null,
      renderizar(t.pregunta, true));

    const ofrecerRespuesta = () => {
      const si = boton([textos[0], el("kbd", {}, "1")], () => contestar(t, true), "principal");
      accion.replaceChildren(el("div", { class: "botones par" }, si, boton([textos[1], el("kbd", {}, "2")], () => contestar(t, false))));
      // El espacio se captura sin hacer nada para que no active el botón enfocado y marque un acierto.
      teclas = { " ": () => {}, 1: () => contestar(t, true), 2: () => contestar(t, false) };
      si.focus({ preventScroll: true });
    };

    pantalla(
      el("div", { class: "trayecto" },
        el("button", { type: "button", class: "salir", onclick: mostrarInicio }, "Salir"),
        el("p", { class: "cuenta" }, `${marcas.size + 1} `, el("span", {}, `de ${orden.length}`))),
      franja(orden, marcas, t.id),
      el("main", { class: "sesion" },
        el("article", { class: "tarjeta", "data-sigla": t.sigla },
          el("p", { class: "ref" }, chapa(t.sigla), el("span", {}, `${t.unidad} ${t.titulo_unidad}`), el("span", { class: "apartado" }, t.apartado)),
          pregunta,
          esEjercicio(t) && t.cuerpo ? el("div", { class: "enunciado" }, renderizar(t.cuerpo)) : null,
          revelado,
          el("p", { class: "pie-tarjeta" }, enlaceEditar(t.fichero)))),
      accion,
    );
    pregunta.focus({ preventScroll: true });

    if (esEjercicio(t) && t.pasos.length) {
      const pasos = el("ol", { class: "pasos" });
      revelado.append(pasos);
      const verPaso = () => {
        const n = pasos.children.length + 1;
        pasos.append(el("li", { class: "paso" }, el("h2", {}, `Paso ${n} de ${t.pasos.length}`), renderizar(t.pasos[n - 1])));
        if (n === t.pasos.length) ofrecerRespuesta();
      };
      accion.append(el("div", { class: "botones" }, boton("Siguiente paso", verPaso, "principal")));
      teclas = { " ": verPaso };
    } else if (esEjercicio(t)) {
      ofrecerRespuesta();
    } else {
      const mostrar = () => {
        revelado.append(el("div", { class: "respuesta" }, renderizar(t.cuerpo)));
        ofrecerRespuesta();
      };
      accion.append(el("div", { class: "botones" }, boton("Mostrar", mostrar, "principal")));
      teclas = { " ": mostrar };
    }
  };

  siguiente();
}

function fecha(dia, hoy) {
  if (dia <= hoy) return "Hoy";
  const [a, m, d] = dia.split("-").map(Number);
  const f = new Date(a, m - 1, d);
  return `${DIAS[f.getDay()]} ${d} ${MESES[m - 1]}`;
}

function mostrarFin(orden, marcas, textos) {
  const hoy = hoyLocal();
  const sabidas = [...marcas.values()].filter(m => m === "sabida").length;
  // fecha -> sigla -> cuántas vuelven ese día.
  const vuelven = new Map();
  for (const t of orden) {
    const dia = progreso[t.id]?.vence ?? hoy;
    if (!vuelven.has(dia)) vuelven.set(dia, new Map());
    const porSigla = vuelven.get(dia);
    porSigla.set(t.sigla, (porSigla.get(t.sigla) || 0) + 1);
  }
  const dias = [...vuelven].sort(([a], [b]) => a.localeCompare(b));

  pantalla(
    el("main", { class: "resumen" },
      el("h1", { tabindex: "-1" }, "Sesión terminada"),
      franja(orden, marcas),
      el("ol", { class: "tablero" },
        el("li", {}, el("span", {}, textos[0]), el("b", {}, sabidas)),
        el("li", {}, el("span", {}, textos[1]), el("b", {}, marcas.size - sabidas))),
      el("section", { class: "vuelven" },
        el("h2", {}, "Cuándo vuelven"),
        el("ol", {}, ...dias.map(([dia, porSigla]) => {
          const total = [...porSigla.values()].reduce((a, b) => a + b, 0);
          return el("li", { class: "dia" },
            el("h3", {}, el("span", {}, fecha(dia, hoy)), el("span", {}, `${total} ${nombreModo(total)}`)),
            el("ul", {}, ...[...porSigla].map(([sigla, n]) =>
              el("li", { "data-sigla": sigla }, chapa(sigla), el("span", {}, NOMBRES[sigla] || ""), el("b", {}, n)))));
        })))),
    el("div", { class: "accion" }, el("div", { class: "botones" }, boton("Volver al inicio", mostrarInicio, "principal"))),
  );
  app.querySelector(".resumen h1").focus({ preventScroll: true });
}

document.addEventListener("keydown", e => {
  if (e.target.matches?.("input, textarea") || e.ctrlKey || e.metaKey || e.altKey) return;
  const accion = teclas[e.key];
  if (accion) {
    e.preventDefault();
    accion();
  }
});

try {
  const respuesta = await fetch("tarjetas.json");
  if (!respuesta.ok) throw new Error(respuesta.status);
  tarjetas = await respuesta.json();
  mostrarInicio();
} catch {
  pantalla(el("p", { class: "aviso" }, "No se han podido cargar las tarjetas."));
}
