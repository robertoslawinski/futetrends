import test from "node:test";
import assert from "node:assert/strict";
import { seasonMarkets } from "./seasonMarkets.js";

test("a rodada semanal tem perguntas curtas e títulos únicos", () => {
  assert.ok(seasonMarkets.length >= 5 && seasonMarkets.length <= 12);
  assert.equal(new Set(seasonMarkets.map((market) => market.title)).size, seasonMarkets.length);
});

test("todos os palpites têm dados completos e critérios objetivos", () => {
  const categories = new Set([
    "Brasileirão 2026",
    "Libertadores 2026",
    "Copa do Brasil 2026",
    "Copa do Brasil Feminina 2026"
  ]);
  for (const market of seasonMarkets) {
    assert.ok(categories.has(market.category), market.category);
    assert.ok(market.title.length >= 8 && market.title.length <= 180);
    assert.ok(market.description.length >= 20);
    assert.ok(market.resolutionSource.includes("CBF"));
    assert.ok(market.resolutionCriteria.startsWith("Resolver "));
    assert.ok(Number.isFinite(Date.parse(market.deadline)));
    assert.ok(market.pointsValue >= 1 && market.pointsValue <= 1000);
  }
});

test("os prazos da leva semanal cabem em uma janela de sete dias", () => {
  const deadlines = seasonMarkets.map((market) => new Date(market.deadline).getTime());
  const windowInDays = (Math.max(...deadlines) - Math.min(...deadlines)) / 86_400_000;
  assert.ok(windowInDays <= 7);
});
