import { describe, it, expect } from 'vitest';
import {
  BODY_SYSTEMS,
  getReductionFactor,
  getMilestoneProgress,
  getRecoveryStatus,
  getRecoverySystems,
  getNextBenefitProgress
} from './recovery';
import { healthBenefits } from './healthBenefits';

const DAY = 24 * 60;

describe('getReductionFactor', () => {
  it('va de 0 (igual que antes) a 1 (sin fumar)', () => {
    expect(getReductionFactor(20, 0)).toBe(1);
    expect(getReductionFactor(20, 10)).toBe(0.5);
    expect(getReductionFactor(20, 20)).toBe(0);
  });

  it('no sale del rango 0-1', () => {
    expect(getReductionFactor(20, 30)).toBe(0);
    expect(getReductionFactor(0, 0)).toBe(0);
  });
});

describe('getMilestoneProgress', () => {
  const milestones = [10, 100, 1000];

  it('es 0 al empezar y 1 tras el último hito', () => {
    expect(getMilestoneProgress(0, milestones)).toBe(0);
    expect(getMilestoneProgress(1000, milestones)).toBe(1);
    expect(getMilestoneProgress(5000, milestones)).toBe(1);
  });

  it('cada hito pesa lo mismo', () => {
    expect(getMilestoneProgress(10, milestones)).toBeCloseTo(1 / 3);
    expect(getMilestoneProgress(100, milestones)).toBeCloseTo(2 / 3);
  });

  it('entre hitos avanza en escala logarítmica', () => {
    // 316 está a mitad de camino entre 100 y 1000 en escala logarítmica
    expect(getMilestoneProgress(316, milestones)).toBeCloseTo(2 / 3 + 1 / 6, 2);
  });

  it('crece siempre con el tiempo', () => {
    let previous = -1;
    for (const minutes of [1, 5, 10, 50, 100, 500, 999]) {
      const progress = getMilestoneProgress(minutes, milestones);
      expect(progress).toBeGreaterThan(previous);
      previous = progress;
    }
  });
});

describe('getRecoveryStatus', () => {
  it.each([
    [0, 'starting'],
    [33, 'starting'],
    [34, 'recovering'],
    [66, 'recovering'],
    [67, 'advanced'],
    [100, 'advanced']
  ])('%i → %s', (score, status) => {
    expect(getRecoveryStatus(score).status).toBe(status);
  });
});

describe('getRecoverySystems', () => {
  it('cada hito de salud pertenece a un sistema conocido', () => {
    const ids = BODY_SYSTEMS.map(s => s.id);
    healthBenefits.forEach(b => expect(ids).toContain(b.system));
  });

  it('al empezar todos los sistemas están a 0', () => {
    getRecoverySystems(0).forEach(s => {
      expect(s.score).toBe(0);
      expect(s.status).toBe('starting');
      expect(s.achieved).toBe(0);
    });
  });

  it('tras 15 años sin fumar todos están al 100%', () => {
    getRecoverySystems(5475 * DAY).forEach(s => {
      expect(s.score).toBe(100);
      expect(s.achieved).toBe(s.total);
      expect(s.nextBenefit).toBeNull();
    });
  });

  it('reducir a la mitad da la mitad de puntuación', () => {
    const full = getRecoverySystems(30 * DAY, 1);
    const half = getRecoverySystems(30 * DAY, 0.5);
    full.forEach((s, i) => expect(half[i].score).toBe(Math.round(s.score / 2)));
  });

  it('indica el próximo hito de cada sistema', () => {
    const respiratory = getRecoverySystems(4 * DAY).find(s => s.id === 'respiratory');
    expect(respiratory.achieved).toBe(2);
    expect(respiratory.nextBenefit.days).toBe(30);
  });
});

describe('getNextBenefitProgress', () => {
  it('mide el avance entre el hito anterior y el siguiente', () => {
    expect(getNextBenefitProgress(0)).toBe(0);
    expect(getNextBenefitProgress(10)).toBe(50);
    // Entre 20 min y 2 h
    expect(getNextBenefitProgress(70)).toBe(50);
  });

  it('devuelve null cuando no quedan hitos', () => {
    expect(getNextBenefitProgress(5475 * DAY)).toBeNull();
  });
});
