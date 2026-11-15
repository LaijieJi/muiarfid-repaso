import { test } from "node:test";
import assert from "node:assert/strict";
import { proteger, restaurar } from "./formulas.js";

test("ida y vuelta conserva la fórmula", () => {
  const { texto, formulas } = proteger("si $x_i * y_i$ y $$\\sum_i a_i$$");
  assert.ok(!texto.includes("_"));
  assert.equal(restaurar(texto, formulas), "si $x_i * y_i$ y $$\\sum_i a_i$$");
});

test("$$ en varias líneas es una sola fórmula", () => {
  const { formulas } = proteger("$$\na_1\n+ b_2\n$$");
  assert.deepEqual(formulas, ["$$\na_1\n+ b_2\n$$"]);
});

test("$ en línea no cruza saltos de línea", () =>
  assert.deepEqual(proteger("cuesta $5\ny $3").formulas, []));

test("\\$ no abre fórmula", () => assert.deepEqual(proteger("cuesta \\$5").formulas, []));

test("no toca código", () => assert.deepEqual(proteger("`$a$`\n```\n$b$\n```").formulas, []));

test("restaurar escapa < y &", () => {
  const { texto, formulas } = proteger("$a<b&c$");
  assert.equal(restaurar(texto, formulas), "$a&lt;b&amp;c$");
});
