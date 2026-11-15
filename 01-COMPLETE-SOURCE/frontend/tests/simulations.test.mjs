import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SIMULATION_DEFS, PHISHING_INDICATORS, PASSWORD_DEFAULTS, PASSWORD_INITIAL_PROFILE,
  scorePasswordProfile, MFA_STEPS, INCIDENT_STEPS, normalizeSimulationProgress, buildSimulationGeometry
} from '../src/simulations.js';

test('four simulations have unique IDs, learning objectives, research refs and question links', () => {
  assert.equal(SIMULATION_DEFS.length, 4);
  assert.equal(new Set(SIMULATION_DEFS.map(s => s.id)).size, 4);
  for (const sim of SIMULATION_DEFS) {
    assert.ok(sim.objective.length > 20);
    assert.ok(sim.references.length >= 2);
    assert.ok(sim.questionIds.length >= 3);
  }
});

test('phishing inspection distinguishes four evidence-based signals from two neutral details', () => {
  assert.equal(PHISHING_INDICATORS.filter(x => x.correct).length, 4);
  assert.equal(PHISHING_INDICATORS.filter(x => !x.correct).length, 2);
  assert.equal(new Set(PHISHING_INDICATORS.map(x => x.id)).size, PHISHING_INDICATORS.length);
  assert.ok(PHISHING_INDICATORS.every(x => x.why.length > 20));
});

test('password training uses non-secret characteristic data and a safe configuration passes', () => {
  assert.deepEqual(Object.keys(PASSWORD_INITIAL_PROFILE).sort(), ['length','unique','manager','mfa'].sort());
  assert.equal(scorePasswordProfile(PASSWORD_INITIAL_PROFILE).ready, false);
  const result = scorePasswordProfile(PASSWORD_DEFAULTS);
  assert.equal(result.score, 100);
  assert.equal(result.ready, true);
  assert.ok(result.checks.every(x => x.passed));
});

test('MFA fatigue simulation has exactly one safe response at each step', () => {
  assert.equal(MFA_STEPS.length, 3);
  for (const step of MFA_STEPS) {
    assert.equal(step.options.filter(x => x.correct).length, 1);
    assert.ok(step.options.every(x => x.feedback.length > 20));
  }
});

test('incident response simulation prioritizes containment, reporting and preservation', () => {
  assert.equal(INCIDENT_STEPS.length, 3);
  for (const step of INCIDENT_STEPS) assert.equal(step.options.filter(x => x.correct).length, 1);
  assert.equal(INCIDENT_STEPS[0].options.find(x => x.correct).id, 'isolate');
  assert.equal(INCIDENT_STEPS[1].options.find(x => x.correct).id, 'report');
  assert.equal(INCIDENT_STEPS[2].options.find(x => x.correct).id, 'preserve');
});


test('simulation progress loader rejects unknown keys and clamps untrusted local values', () => {
  const normalized = normalizeSimulationProgress({
    phishing: { completed: true, attempts: 4, bestScore: 100, completedAt: '2026-11-12T00:00:00Z' },
    password: { completed: 'yes', attempts: -9, bestScore: 999, completedAt: '<script>' },
    injected: { completed: true, attempts: 100 }
  });
  assert.deepEqual(Object.keys(normalized).sort(), ['password', 'phishing']);
  assert.equal(normalized.phishing.completed, true);
  assert.equal(normalized.password.completed, false);
  assert.equal(normalized.password.attempts, 0);
  assert.equal(normalized.password.bestScore, 100);
  assert.equal(normalized.password.completedAt, null);
});

test('all four procedural 3D scene geometries contain finite line vertices and colors', () => {
  for (const type of ['phishing','password','mfa','incident']) {
    const geometry = buildSimulationGeometry(type);
    assert.ok(geometry.positions.length > 0);
    assert.equal(geometry.positions.length % 6, 0);
    assert.equal(geometry.colors.length, geometry.positions.length);
    assert.ok([...geometry.positions, ...geometry.colors].every(Number.isFinite));
  }
});
