import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isValidCigaretteCount, validateUserData, MAX_CIGARETTES_PER_DAY } from './validation';

const validData = {
  packPrice: '5.50',
  cigarettesPerPack: '20',
  cigarettesPerDayBefore: '20',
  cigarettesPerDayNow: '5',
  quitDate: '2026-10-10'
};

describe('isValidCigaretteCount', () => {
  it.each([
    ['0', true],
    [0, true],
    ['15', true],
    [MAX_CIGARETTES_PER_DAY, true],
    [MAX_CIGARETTES_PER_DAY + 1, false],
    ['', false],
    [null, false],
    [undefined, false],
    ['-1', false],
    ['2.5', false],
    ['abc', false]
  ])('%s → %s', (value, expected) => {
    expect(isValidCigaretteCount(value)).toBe(expected);
  });

  it('respeta el mínimo indicado', () => {
    expect(isValidCigaretteCount('0', 1)).toBe(false);
    expect(isValidCigaretteCount('1', 1)).toBe(true);
  });
});

describe('validateUserData', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 15, 12, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('acepta datos válidos', () => {
    expect(validateUserData(validData)).toEqual({});
  });

  it('acepta el mismo consumo que antes', () => {
    expect(validateUserData({ ...validData, cigarettesPerDayNow: '20' })).toEqual({});
  });

  it('rechaza fumar más que antes', () => {
    const errors = validateUserData({ ...validData, cigarettesPerDayNow: '21' });
    expect(errors.cigarettesPerDayNow).toBeDefined();
  });

  it('rechaza precio cero o vacío', () => {
    expect(validateUserData({ ...validData, packPrice: '0' }).packPrice).toBeDefined();
    expect(validateUserData({ ...validData, packPrice: '' }).packPrice).toBeDefined();
  });

  it('rechaza cantidades decimales', () => {
    expect(validateUserData({ ...validData, cigarettesPerDayBefore: '10.5' }).cigarettesPerDayBefore).toBeDefined();
  });

  it('rechaza fechas futuras pero acepta hoy', () => {
    expect(validateUserData({ ...validData, quitDate: '2026-10-16' }).quitDate).toBeDefined();
    expect(validateUserData({ ...validData, quitDate: '2026-10-15' })).toEqual({});
  });
});
