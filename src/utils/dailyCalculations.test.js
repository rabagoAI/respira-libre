import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  calculateRealSavings,
  getCurrentConsumption,
  getMovingAverage,
  getTrendStats,
  getChartData
} from './dailyCalculations';

// Hoy: 15 de octubre de 2026 a mediodía. Inicio: 6 de octubre → 10 días contando hoy
const baseUser = {
  quitDate: new Date(2026, 9, 6).toISOString(),
  packPrice: 5,
  cigarettesPerPack: 20, // 0,25 € por cigarrillo
  cigarettesPerDayBefore: 20,
  cigarettesPerDayNow: 10
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 15, 12, 0));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('calculateRealSavings', () => {
  it('sin registro usa cigarettesPerDayNow para todos los días', () => {
    const result = calculateRealSavings({ ...baseUser, dailyLog: {} });
    expect(result.totalCigarettesAvoided).toBe(10 * 10);
    expect(result.totalMoneySaved).toBe(25);
    expect(result.daysTracked).toBe(0);
  });

  it('rellena los huecos con el último valor registrado', () => {
    const result = calculateRealSavings({
      ...baseUser,
      dailyLog: { '2026-10-10': 4, '2026-10-13': 0 }
    });
    // 6-9 oct: 4 días × 10 | 10-12 oct: 3 días × 16 | 13-15 oct: 3 días × 20
    expect(result.totalCigarettesAvoided).toBe(40 + 48 + 60);
    expect(result.daysTracked).toBe(2);
    expect(result.averageDaily).toBe(2);
  });

  it('cuenta el primer día aunque se empiece hoy', () => {
    const result = calculateRealSavings({
      ...baseUser,
      quitDate: new Date(2026, 9, 15).toISOString(),
      dailyLog: { '2026-10-15': 0 }
    });
    expect(result.totalCigarettesAvoided).toBe(20);
  });

  it('ignora registros anteriores a la fecha de inicio', () => {
    const result = calculateRealSavings({
      ...baseUser,
      dailyLog: { '2026-10-01': 0 }
    });
    expect(result.totalCigarettesAvoided).toBe(10 * 10);
    expect(result.daysTracked).toBe(0);
  });

  it('acepta quitDate guardado como medianoche UTC (datos antiguos)', () => {
    const result = calculateRealSavings({
      ...baseUser,
      quitDate: '2026-10-06T00:00:00.000Z',
      dailyLog: {}
    });
    expect(result.totalCigarettesAvoided).toBe(10 * 10);
  });
});

describe('getCurrentConsumption', () => {
  it('devuelve el registro más reciente', () => {
    expect(getCurrentConsumption({ ...baseUser, dailyLog: { '2026-10-14': 3, '2026-10-10': 8 } })).toBe(3);
  });

  it('usa cigarettesPerDayNow si no hay registro', () => {
    expect(getCurrentConsumption({ ...baseUser, dailyLog: {} })).toBe(10);
    expect(getCurrentConsumption(baseUser)).toBe(10);
  });
});

describe('getMovingAverage', () => {
  it('promedia los últimos N registros', () => {
    const log = { '2026-10-01': 100, '2026-10-02': 2, '2026-10-03': 4 };
    expect(getMovingAverage(log, 2)).toBe(3);
  });

  it('devuelve 0 sin registro', () => {
    expect(getMovingAverage({})).toBe(0);
    expect(getMovingAverage(undefined)).toBe(0);
  });
});

describe('getTrendStats', () => {
  it('es neutral con menos de dos registros', () => {
    expect(getTrendStats({ '2026-10-01': 5 }).trend).toBe('neutral');
  });

  it('detecta mejora y empeoramiento', () => {
    expect(getTrendStats({ '2026-10-01': 10, '2026-10-02': 5 })).toEqual({ trend: 'improving', percentage: 50 });
    expect(getTrendStats({ '2026-10-01': 5, '2026-10-02': 10 })).toEqual({ trend: 'worsening', percentage: 100 });
  });

  it('no divide entre cero cuando se parte de 0', () => {
    expect(getTrendStats({ '2026-10-01': 0, '2026-10-02': 0 })).toEqual({ trend: 'stable', percentage: 0 });
    expect(getTrendStats({ '2026-10-01': 0, '2026-10-02': 3 })).toEqual({ trend: 'worsening', percentage: 100 });
  });
});

describe('getChartData', () => {
  it('muestra desde la fecha de inicio si hay menos días que el máximo', () => {
    const data = getChartData({ '2026-10-14': 3 }, new Date(2026, 9, 12).toISOString(), 30);
    expect(data).toEqual([
      { date: '2026-10-12', value: null },
      { date: '2026-10-13', value: null },
      { date: '2026-10-14', value: 3 },
      { date: '2026-10-15', value: null }
    ]);
  });

  it('limita a los últimos N días terminando hoy', () => {
    const data = getChartData({ '2026-10-15': 0 }, baseUser.quitDate, 7);
    expect(data).toHaveLength(7);
    expect(data[0].date).toBe('2026-10-09');
    expect(data[6]).toEqual({ date: '2026-10-15', value: 0 });
  });
});
