import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  calculateTimeSinceQuit,
  calculateGoalProgress,
  calculateDailySavings,
  formatCurrency
} from './calculations';

afterEach(() => {
  vi.useRealTimers();
});

describe('calculateTimeSinceQuit', () => {
  it('separa días, horas y minutos', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 15, 10, 52));
    expect(calculateTimeSinceQuit(new Date(2026, 9, 13))).toEqual({ days: 2, hours: 10, minutes: 52 });
  });
});

describe('calculateDailySavings', () => {
  it('multiplica los cigarrillos reducidos por el precio unitario', () => {
    expect(calculateDailySavings(5, 20, 20, 4)).toBe(4);
  });
});

describe('calculateGoalProgress', () => {
  it('calcula porcentaje, restante y días', () => {
    expect(calculateGoalProgress(10, 100, 5)).toEqual({ percentage: '10.0', remaining: 90, daysRemaining: 18 });
  });

  it('no supera el 100% y no quedan días al completar', () => {
    expect(calculateGoalProgress(150, 100, 5)).toMatchObject({ percentage: '100.0', daysRemaining: 0 });
  });

  it('no estima días si el ahorro diario no es positivo', () => {
    expect(calculateGoalProgress(10, 100, 0).daysRemaining).toBeNull();
    expect(calculateGoalProgress(10, 100, -2).daysRemaining).toBeNull();
  });

  it('no muestra porcentajes negativos', () => {
    expect(calculateGoalProgress(-5, 100, 1).percentage).toBe('0.0');
  });
});

describe('formatCurrency', () => {
  it('formatea en euros con dos decimales', () => {
    expect(formatCurrency(1234.5)).toMatch(/^1\.?234,50\s€$/);
  });
});
