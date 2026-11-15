// Repaso espaciado con cajas de Leitner. Las fechas son cadenas "YYYY-MM-DD" en hora local.

export const INTERVALOS = [0, 1, 3, 7, 14];
const CLAVE = "muiarfid-repaso:progreso";

const dosCifras = n => String(n).padStart(2, "0");

export function hoyLocal(fecha = new Date()) {
  return `${fecha.getFullYear()}-${dosCifras(fecha.getMonth() + 1)}-${dosCifras(fecha.getDate())}`;
}

// En UTC para que el cambio de hora no salte ni repita días.
export function sumarDias(dia, n) {
  const [a, m, d] = dia.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, d + n)).toISOString().slice(0, 10);
}

export function responder(estado, acierto, hoy) {
  const caja = acierto ? Math.min((estado?.caja ?? 0) + 1, INTERVALOS.length - 1) : 0;
  return { caja, vence: sumarDias(hoy, INTERVALOS[caja]) };
}

const tieneFecha = e => typeof e?.vence === "string";

// Una entrada de progreso sin fecha válida cuenta como tarjeta nueva, para que nunca desaparezca.
export function pendientes(tarjetas, progreso, hoy) {
  const vencidas = tarjetas
    .filter(t => tieneFecha(progreso[t.id]) && progreso[t.id].vence <= hoy)
    .sort((a, b) => progreso[a.id].vence.localeCompare(progreso[b.id].vence));
  const nuevas = tarjetas.filter(t => !tieneFecha(progreso[t.id]));
  return [...vencidas, ...nuevas];
}

// Safari con las cookies bloqueadas lanza una excepción solo por leer window.localStorage.
export function almacenLocal() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

export function cargarProgreso(almacen = almacenLocal()) {
  try {
    const valor = JSON.parse(almacen.getItem(CLAVE));
    return valor && typeof valor === "object" ? valor : {};
  } catch {
    return {};
  }
}

export function guardarProgreso(progreso, almacen = almacenLocal()) {
  try {
    almacen.setItem(CLAVE, JSON.stringify(progreso));
  } catch {
    // Sin almacenamiento la web sigue funcionando, solo que no recuerda el progreso.
  }
}
