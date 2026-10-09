
import test from "node:test";
import assert from "node:assert/strict";
import { buildGreeting } from "../../src/greeting.js";

test("deve cumprimentar uma pessoa pelo nome", () => {
  assert.equal(buildGreeting("Maria"), "Olá, Maria!");
});

test("deve usar mundo quando nenhum nome for informado", () => {
  assert.equal(buildGreeting(), "Olá, mundo!");
});

test("deve usar mundo quando o nome estiver vazio", () => {
  assert.equal(buildGreeting(""), "Olá, mundo!");
});

test("deve remover espaços extras do nome", () => {
  assert.equal(buildGreeting("  Ana  "), "Olá, Ana!");
});

test("deve converter um número para texto", () => {
  assert.equal(buildGreeting(123), "Olá, 123!");
});

test("deve usar mundo quando o nome contiver apenas espaços", () => {
  assert.equal(buildGreeting("   "), "Olá, mundo!");
});

test("deve converter null para texto", () => {
  assert.equal(buildGreeting(null), "Olá, null!");
});
