import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { buildBackup, getBackupFileName, parseBackup } from './backup';

const userData = {
  packPrice: 5.5,
  cigarettesPerPack: 20,
  cigarettesPerDayBefore: 20,
  cigarettesPerDayNow: 5,
  quitDate: new Date(2026, 9, 6).toISOString(),
  dailyLog: { '2026-10-06': 5, '2026-10-14': 0 }
};
const goals = [{ id: 1, name: 'Bicicleta', price: 300, image: '🚲', category: 'Deporte' }];

const toText = (overrides = {}) => JSON.stringify({ ...buildBackup(userData, goals), ...overrides });

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 15, 12, 0));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('copia de seguridad', () => {
  it('exportar e importar devuelve los mismos datos', () => {
    expect(parseBackup(toText())).toEqual({ userData, goals });
  });

  it('el nombre del archivo lleva la fecha local', () => {
    expect(getBackupFileName()).toBe('respira-libre-2026-10-15.json');
  });

  it('acepta copias sin objetivos ni registro diario', () => {
    const { dailyLog: _dailyLog, ...withoutLog } = userData;
    const result = parseBackup(JSON.stringify({ app: 'respira-libre', version: 1, userData: withoutLog }));
    expect(result.goals).toEqual([]);
    expect(result.userData.dailyLog).toEqual({});
  });

  it.each([
    ['texto que no es JSON', 'hola', 'JSON válido'],
    ['JSON de otra app', JSON.stringify({ app: 'otra', version: 1 }), 'no es una copia'],
    ['versión futura', toText({ version: 99 }), 'más reciente'],
    ['sin datos de usuario', toText({ userData: null }), 'datos de usuario'],
    ['configuración inválida', toText({ userData: { ...userData, packPrice: -1 } }), 'configuración'],
    ['registro con fecha mal formada', toText({ userData: { ...userData, dailyLog: { '15/10/2026': 1 } } }), 'registro diario'],
    ['registro con valor negativo', toText({ userData: { ...userData, dailyLog: { '2026-10-10': -3 } } }), 'registro diario'],
    ['objetivo sin precio', toText({ goals: [{ name: 'X' }] }), 'objetivos']
  ])('rechaza %s', (_case, text, message) => {
    expect(() => parseBackup(text)).toThrow(message);
  });
});
