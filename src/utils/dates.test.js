import { describe, it, expect } from 'vitest';
import { toLocalDateString, parseLocalDate } from './dates';

describe('toLocalDateString', () => {
  it('usa el día local aunque en UTC aún sea el día anterior', () => {
    // 00:30 en Madrid (CEST) son las 22:30 UTC del día 14
    const date = new Date(2026, 9, 15, 0, 30);
    expect(date.toISOString().startsWith('2026-10-14')).toBe(true);
    expect(toLocalDateString(date)).toBe('2026-10-15');
  });
});

describe('parseLocalDate', () => {
  it('interpreta yyyy-MM-dd como medianoche local', () => {
    const date = parseLocalDate('2026-10-15');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(9);
    expect(date.getDate()).toBe(15);
    expect(date.getHours()).toBe(0);
  });

  it('es la operación inversa de toLocalDateString', () => {
    expect(toLocalDateString(parseLocalDate('2026-03-29'))).toBe('2026-03-29');
  });
});
