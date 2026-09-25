import test from "node:test";
import assert from "node:assert/strict";
import { getPlayerProgress } from "./playerProgress.js";

const prediction = (id) => ({ _id: id, title: `Palpite ${id}` });
const vote = (id, isCorrect) => ({ id, prediction: prediction(id), isCorrect });

test("usuário novo não recebe aproveitamento fictício", () => {
  const view = getPlayerProgress([], [], { _id: "user-1" });
  assert.equal(view.totalVotes, 0);
  assert.equal(view.accuracy, null);
  assert.deepEqual(view.pending, []);
  assert.deepEqual(view.results, []);
});

test("separa palpites pendentes dos resolvidos", () => {
  const view = getPlayerProgress([vote("1", null), vote("2", true)], [], {});
  assert.equal(view.pendingTotal, 1);
  assert.equal(view.resolvedTotal, 1);
});

test("contabiliza acertos, erros e taxa apenas entre resolvidos", () => {
  const view = getPlayerProgress([
    vote("1", true),
    vote("2", false),
    vote("3", true),
    vote("4", null)
  ], [], {});
  assert.equal(view.correctTotal, 2);
  assert.equal(view.incorrectTotal, 1);
  assert.equal(view.accuracy, 67);
});

test("encontra posição e reconhece usuário Top 3", () => {
  const ranking = [{ id: "user-1", rank: 2, points: 300 }];
  const view = getPlayerProgress([], ranking, { _id: "user-1" });
  assert.equal(view.currentRank.rank, 2);
  assert.equal(view.isTopThree, true);
});

test("mantém ausência de posição quando usuário não está no ranking", () => {
  const view = getPlayerProgress([], [{ id: "other", rank: 1 }], { _id: "user-1" });
  assert.equal(view.currentRank, null);
  assert.equal(view.isTopThree, false);
});

test("limita listas visíveis a quatro itens sem perder totais", () => {
  const history = Array.from({ length: 12 }, (_, index) => vote(String(index), index < 6 ? null : index % 2 === 0));
  const view = getPlayerProgress(history, [], {});
  assert.equal(view.totalVotes, 12);
  assert.equal(view.pendingTotal, 6);
  assert.equal(view.resolvedTotal, 6);
  assert.equal(view.pending.length, 4);
  assert.equal(view.results.length, 4);
});

test("ignora registros cujo palpite foi removido", () => {
  const view = getPlayerProgress([{ id: "orphan", prediction: null, isCorrect: true }], [], {});
  assert.equal(view.totalVotes, 0);
  assert.equal(view.correctTotal, 0);
});
