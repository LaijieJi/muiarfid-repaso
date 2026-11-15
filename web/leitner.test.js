import { test } from "node:test";
import assert from "node:assert/strict";
import {
  INTERVALOS, hoyLocal, sumarDias, responder, pendientes, cargarProgreso, guardarProgreso,
} from "./leitner.js";

test("los intervalos son los del diseño", () => assert.deepEqual(INTERVALOS, [0, 1, 3, 7, 14]));

test("hoyLocal da la fecha local en YYYY-MM-DD", () =>
  assert.equal(hoyLocal(new Date(2026, 10, 5, 23, 59)), "2026-11-05"));

test("acierto en tarjeta nueva va a la caja 1 y vence mañana", () =>
  assert.deepEqual(responder(undefined, true, "2026-11-15"), { caja: 1, vence: "2026-11-16" }));

test("fallo en tarjeta nueva se queda en la caja 0 y vence hoy", () =>
  assert.deepEqual(responder(undefined, false, "2026-11-15"), { caja: 0, vence: "2026-11-15" }));

test("fallo devuelve a la caja 0 y vence hoy", () =>
  assert.deepEqual(responder({ caja: 3, vence: "2026-11-15" }, false, "2026-11-15"), { caja: 0, vence: "2026-11-15" }));

test("la caja no pasa de 4", () =>
  assert.deepEqual(responder({ caja: 4, vence: "2026-11-15" }, true, "2026-11-15"), { caja: 4, vence: "2026-11-29" }));

test("sumarDias cruza el cambio de hora y el fin de mes", () => {
  assert.equal(sumarDias("2026-10-24", 1), "2026-10-25");
  assert.equal(sumarDias("2026-10-25", 1), "2026-10-26");
  assert.equal(sumarDias("2027-03-27", 2), "2027-03-29");
  assert.equal(sumarDias("2026-12-25", 14), "2027-01-08");
});

test("pendientes: vencidas por fecha, luego nuevas, sin futuras", () => {
  const t = ["a", "b", "c", "d"].map(id => ({ id }));
  const p = { a: { caja: 2, vence: "2026-11-14" }, b: { caja: 1, vence: "2026-11-20" }, c: { caja: 1, vence: "2026-11-10" } };
  assert.deepEqual(pendientes(t, p, "2026-11-15").map(x => x.id), ["c", "a", "d"]);
});

test("pendientes: a igual fecha conserva el orden de entrada", () => {
  const t = ["x", "y"].map(id => ({ id }));
  const p = { x: { caja: 1, vence: "2026-11-15" }, y: { caja: 1, vence: "2026-11-15" } };
  assert.deepEqual(pendientes(t, p, "2026-11-15").map(x => x.id), ["x", "y"]);
});

test("cargarProgreso lee lo guardado", () => {
  const datos = {};
  const almacen = { getItem: k => datos[k] ?? null, setItem: (k, v) => { datos[k] = v; } };
  guardarProgreso({ a: { caja: 1, vence: "2026-11-16" } }, almacen);
  assert.deepEqual(cargarProgreso(almacen), { a: { caja: 1, vence: "2026-11-16" } });
  assert.ok("muiarfid-repaso:progreso" in datos);
});

test("cargarProgreso con JSON corrupto da {}", () =>
  assert.deepEqual(cargarProgreso({ getItem: () => "{roto" }), {}));

test("cargarProgreso sin nada guardado da {}", () =>
  assert.deepEqual(cargarProgreso({ getItem: () => null }), {}));

test("cargarProgreso sin almacén da {}", () => assert.deepEqual(cargarProgreso(null), {}));

test("pendientes trata una entrada sin fecha como nueva", () =>
  assert.deepEqual(pendientes([{ id: "a" }], { a: 5 }, "2026-11-15").map(x => x.id), ["a"]));

test("cargarProgreso con almacén bloqueado da {}", () =>
  assert.deepEqual(cargarProgreso({ getItem() { throw new Error("bloqueado"); } }), {}));

test("guardarProgreso no lanza si el almacén falla", () =>
  assert.doesNotThrow(() => guardarProgreso({}, { setItem() { throw new Error("bloqueado"); } })));
