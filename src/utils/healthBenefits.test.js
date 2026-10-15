import { describe, it, expect } from 'vitest';
import {
  healthBenefits,
  getAchievedBenefits,
  getNextBenefit,
  getTimeToNextBenefit
} from './healthBenefits';

const titles = (benefits) => benefits.map(b => b.title);

describe('beneficios de salud por minutos', () => {
  it('al empezar no hay beneficios y el primero llega a los 20 minutos', () => {
    expect(getAchievedBenefits(0)).toEqual([]);
    expect(getNextBenefit(0).minutes).toBe(20);
    expect(getTimeToNextBenefit(0)).toEqual({ value: 20, unit: 'minutos' });
  });

  it('con 10 h 52 min solo están los hitos de 20 min y 2 h', () => {
    const minutes = 10 * 60 + 52;
    expect(titles(getAchievedBenefits(minutes))).toEqual(['Presión arterial normal', 'Mejora circulación']);
    expect(getNextBenefit(minutes).minutes).toBe(720);
    expect(getTimeToNextBenefit(minutes)).toEqual({ value: 2, unit: 'horas' });
  });

  it('el hito de 1 día no se alcanza antes de 24 horas', () => {
    const dayOne = healthBenefits.find(b => b.days === 1);
    expect(getAchievedBenefits(1439)).not.toContain(dayOne);
    expect(getAchievedBenefits(1440)).toContain(dayOne);
  });

  it('usa singular cuando queda una unidad', () => {
    expect(getTimeToNextBenefit(19)).toEqual({ value: 1, unit: 'minuto' });
    expect(getTimeToNextBenefit(2 * 24 * 60)).toEqual({ value: 1, unit: 'día' });
  });

  it('tras 15 años no queda ningún beneficio pendiente', () => {
    const minutes = 5475 * 24 * 60;
    expect(getAchievedBenefits(minutes)).toHaveLength(healthBenefits.length);
    expect(getNextBenefit(minutes)).toBeNull();
    expect(getTimeToNextBenefit(minutes)).toBeNull();
  });
});
