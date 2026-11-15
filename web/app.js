import { almacenLocal, cargarProgreso, guardarProgreso, hoyLocal, pendientes, responder } from "./leitner.js";
import { proteger, restaurar } from "./formulas.js";

const REPO_EDITAR = "https://github.com/LaijieJi/muiarfid-repaso/edit/main/";
const CLAVE_SELECCION = "muiarfid-repaso:seleccion";
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
  nodo.append(...hijos.filter(h => h != null));
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

function boton(texto, onclick, clase = null) {
  return el("button", { type: "button", class: clase, onclick }, texto);
}

const esEjercicio = t => t.tipo !== "tarjeta";

function seleccionadas() {
  return tarjetas.filter(t =>
    !seleccion.excluidas.includes(t.fichero) && (seleccion.modo === "problemas") === esEjercicio(t));
}

function unidadesPorSigla() {
  const grupos = new Map();
  for (const t of tarjetas) {
    if (!grupos.has(t.sigla)) grupos.set(t.sigla, new Map());
    grupos.get(t.sigla).set(t.fichero, `${t.unidad} ${t.titulo_unidad}`);
  }
  return grupos;
}

function mostrarInicio() {
  const contador = el("p", { class: "contador" });
  const actualizar = () => {
    contador.textContent = `Hoy tocan ${pendientes(seleccionadas(), progreso, hoyLocal()).length}`;
    guardarSeleccion();
  };

  const modos = el("fieldset", { class: "modos" }, el("legend", {}, "Qué repasar"),
    ...[["tarjetas", "Tarjetas"], ["problemas", "Problemas"]].map(([valor, texto]) =>
      el("label", {},
        el("input", {
          type: "radio", name: "modo", value: valor, checked: seleccion.modo === valor,
          onchange: () => { seleccion.modo = valor; actualizar(); },
        }),
        texto)));

  const asignaturas = [...unidadesPorSigla()].map(([sigla, unidades]) =>
    el("fieldset", { class: "asignatura" }, el("legend", {}, sigla),
      ...[...unidades].map(([fichero, nombre]) =>
        el("label", {},
          el("input", {
            type: "checkbox", checked: !seleccion.excluidas.includes(fichero),
            onchange: e => {
              seleccion.excluidas = seleccion.excluidas.filter(f => f !== fichero);
              if (!e.target.checked) seleccion.excluidas.push(fichero);
              actualizar();
            },
          }),
          nombre))));

  actualizar();
  pantalla(
    modos,
    ...asignaturas,
    contador,
    el("div", { class: "acciones" },
      boton("Empezar", empezar, "principal"),
      boton("Repasar todo", repasarTodo)),
  );
}

function empezar() {
  const cola = pendientes(seleccionadas(), progreso, hoyLocal());
  if (cola.length) return mostrarSesion(cola);
  pantalla(
    el("p", { class: "aviso" }, "No te toca nada hoy en esta selección."),
    el("div", { class: "acciones" }, boton("Repasar todo", repasarTodo, "principal"), boton("Volver", mostrarInicio)),
  );
}

function repasarTodo() {
  const cola = seleccionadas();
  if (cola.length) return mostrarSesion(cola);
  pantalla(
    el("p", { class: "aviso" }, "No hay nada en esta selección."),
    el("div", { class: "acciones" }, boton("Volver", mostrarInicio, "principal")),
  );
}

function enlaceEditar(fichero) {
  const ruta = fichero.split("/").map(encodeURIComponent).join("/");
  return el("a", { class: "editar", href: REPO_EDITAR + ruta, target: "_blank", rel: "noopener" }, "Proponer un cambio");
}

function mostrarSesion(cola) {
  cola = [...cola];
  const total = cola.length;

  const contestar = (t, acierto) => {
    progreso[t.id] = responder(progreso[t.id], acierto, hoyLocal());
    guardarProgreso(progreso);
    cola.shift();
    if (!acierto) cola.push(t);
    siguiente();
  };

  const siguiente = () => {
    if (!cola.length) {
      return pantalla(
        el("p", { class: "aviso" }, "Sesión terminada."),
        el("div", { class: "acciones" }, boton("Volver al inicio", mostrarInicio, "principal")),
      );
    }
    const t = cola[0];
    const respuestas = el("div", { class: "acciones" });
    const revelado = el("div", { class: "revelado" });
    const tarjeta = el("article", { class: "tarjeta" },
      el("p", { class: "referencia" }, `${t.sigla}, ${t.unidad} ${t.titulo_unidad}, ${t.apartado}`),
      el("h2", {}, esEjercicio(t) ? `${t.tipo === "problema" ? "Problema" : "Demostración"}: ` : null, renderizar(t.pregunta, true)),
      esEjercicio(t) && t.cuerpo ? renderizar(t.cuerpo) : null,
      revelado,
      respuestas,
      el("p", { class: "pie" }, `Quedan ${cola.length} de ${total}`, " ", enlaceEditar(t.fichero)),
    );

    const ofrecerRespuesta = (si, no) => {
      respuestas.replaceChildren(boton(si, () => contestar(t, true), "acierto"), boton(no, () => contestar(t, false), "fallo"));
      // El espacio se captura sin hacer nada para que no active el botón enfocado y marque un acierto.
      teclas = { " ": () => {}, 1: () => contestar(t, true), 2: () => contestar(t, false) };
      respuestas.querySelector("button").focus();
    };

    if (esEjercicio(t)) {
      let mostrados = 0;
      const verPaso = () => {
        mostrados += 1;
        revelado.append(el("section", { class: "paso" },
          el("h3", {}, `Paso ${mostrados} de ${t.pasos.length}`), renderizar(t.pasos[mostrados - 1])));
        if (mostrados === t.pasos.length) ofrecerRespuesta("Me ha salido", "No me ha salido");
      };
      const botonPaso = boton("Siguiente paso", () => {
        verPaso();
        if (mostrados === t.pasos.length) botonPaso.remove();
      }, "principal");
      respuestas.append(botonPaso);
      pantalla(tarjeta);
      teclas = { " ": () => botonPaso.isConnected && botonPaso.click() };
    } else {
      const mostrar = () => {
        revelado.append(renderizar(t.cuerpo));
        ofrecerRespuesta("La sabía", "No la sabía");
      };
      respuestas.append(boton("Mostrar", mostrar, "principal"));
      pantalla(tarjeta);
      teclas = { " ": () => { if (!revelado.hasChildNodes()) mostrar(); } };
    }
  };

  siguiente();
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
