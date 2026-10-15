import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getDailySeries } from './dailyCalculations';
import { getStreaks } from './streaks';
import { ACHIEVEMENTS, buildAchievementContext, getAchievements, getNewAchievements } from './achievements';

// Hoy: 15 de octubre de 2026. Inicio: 6 de octubre → 10 días contando hoy
const user = (dailyLog, cigarettesPerDayNow = 10) => ({
  quitDate: new Date(2026, 9, 6).toISOString(),
  packPrice: 5,
  cigarettesPerPack: 20,
  cigarettesPerDayBefore: 20,
  cigarettesPerDayNow,
  dailyLog
});

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 15, 12, 0));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('getDailySeries', () => {
  it('tiene un día por fecha desde el inicio hasta hoy y rellena huecos', () => {
    const series = getDailySeries(user({ '2026-10-10': 0 }));
    expect(series).toHaveLength(10);
    expect(series[0]).toEqual({ date: '2026-10-06', value: 10, logged: false });
    expect(series[4]).toEqual({ date: '2026-10-10', value: 0, logged: true });
    expect(series[9]).toEqual({ date: '2026-10-15', value: 0, logged: false });
  });
});

describe('getStreaks', () => {
  it('cuenta la racha actual y la mejor sin fumar', () => {
    // 6-7: 0 | 8: 3 | 9-15: 0 (7 días, el 15 sin registrar hereda el 0)
    const series = getDailySeries(user({ '2026-10-06': 0, '2026-10-08': 3, '2026-10-09': 0 }));
    const { smokeFree } = getStreaks(series, 20);
    expect(smokeFree).toEqual({ current: 7, best: 7 });
  });

  it('una recaída corta la racha actual pero conserva la mejor', () => {
    const series = getDailySeries(user({ '2026-10-06': 0, '2026-10-14': 2 }));
    const { smokeFree } = getStreaks(series, 20);
    expect(smokeFree).toEqual({ current: 0, best: 8 });
  });

  it('cuenta los días seguidos por debajo del consumo anterior', () => {
    const series = getDailySeries(user({ '2026-10-12': 25, '2026-10-13': 5 }));
    expect(getStreaks(series, 20).reduction).toEqual({ current: 3, best: 6 });
  });

  it('no registrar hoy todavía no rompe la racha de registro', () => {
    const log = { '2026-10-12': 1, '2026-10-13': 1, '2026-10-14': 1 };
    expect(getStreaks(getDailySeries(user(log)), 20).logging).toEqual({ current: 3, best: 3 });
    expect(getStreaks(getDailySeries(user({ ...log, '2026-10-15': 1 })), 20).logging.current).toBe(4);
  });

  it('un día sin registrar en medio sí rompe la racha de registro', () => {
    const log = { '2026-10-11': 1, '2026-10-13': 1, '2026-10-14': 1 };
    expect(getStreaks(getDailySeries(user(log)), 20).logging).toEqual({ current: 2, best: 2 });
  });
});

describe('logros', () => {
  const context = (overrides = {}) => buildAchievementContext({
    streaks: { smokeFree: { current: 0, best: 0 }, reduction: { current: 0, best: 0 }, logging: { current: 0, best: 0 } },
    moneySaved: 0,
    cigarettesAvoided: 0,
    ...overrides
  });

  it('todos tienen id único y objetivo positivo', () => {
    const ids = ACHIEVEMENTS.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    ACHIEVEMENTS.forEach(a => expect(a.target).toBeGreaterThan(0));
  });

  it('al empezar solo está desbloqueado el primer paso', () => {
    const unlocked = getAchievements(context()).filter(a => a.unlocked).map(a => a.id);
    expect(unlocked).toEqual(['start']);
  });

  it('se desbloquean al alcanzar el objetivo y muestran el progreso', () => {
    const achievements = getAchievements(context({
      streaks: { smokeFree: { current: 2, best: 7 }, reduction: { current: 0, best: 0 }, logging: { current: 0, best: 3 } },
      moneySaved: 55,
      breathingSessions: 1
    }));
    const byId = Object.fromEntries(achievements.map(a => [a.id, a]));
    expect(byId['smoke-free-7'].unlocked).toBe(true);
    expect(byId['smoke-free-30'].progress).toBeCloseTo(7 / 30);
    expect(byId['save-10'].unlocked).toBe(true);
    expect(byId['save-100'].progress).toBeCloseTo(0.55);
    expect(byId['logging-7'].unlocked).toBe(false);
    expect(byId['breathing-1'].unlocked).toBe(true);
  });

  it('el ahorro negativo no da progreso negativo', () => {
    const save = getAchievements(context({ moneySaved: -20 })).find(a => a.id === 'save-10');
    expect(save.progress).toBe(0);
  });

  it('detecta los logros nuevos que no se han visto', () => {
    const achievements = getAchievements(context({ moneySaved: 12 }));
    expect(getNewAchievements(achievements, ['start']).map(a => a.id)).toEqual(['save-10']);
    expect(getNewAchievements(achievements, ['start', 'save-10'])).toEqual([]);
  });
});
