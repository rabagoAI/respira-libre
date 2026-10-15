import { describe, it, expect } from 'vitest';
import {
  isValidReminderTime,
  getReminderDate,
  getReminder,
  isTodayLogged,
  shouldShowReminder,
  getNotificationDelay
} from './reminder';

const at = (hours, minutes = 0) => new Date(2026, 9, 15, hours, minutes);
const user = (reminder, dailyLog = {}) => ({ reminder, dailyLog });

describe('isValidReminderTime', () => {
  it.each([
    ['21:00', true],
    ['00:00', true],
    ['23:59', true],
    ['24:00', false],
    ['9:00', false],
    ['21:60', false],
    ['', false],
    [undefined, false]
  ])('%s → %s', (time, expected) => {
    expect(isValidReminderTime(time)).toBe(expected);
  });
});

describe('getReminder', () => {
  it('usa valores por defecto si no hay configuración', () => {
    expect(getReminder({})).toEqual({ enabled: false, time: '21:00', lastNotified: null });
  });

  it('corrige una hora inválida', () => {
    expect(getReminder(user({ enabled: true, time: '99:99' })).time).toBe('21:00');
  });
});

describe('getReminderDate', () => {
  it('devuelve hoy a la hora indicada', () => {
    expect(getReminderDate('21:30', at(10))).toEqual(at(21, 30));
  });
});

describe('isTodayLogged', () => {
  it('detecta el registro de hoy en hora local', () => {
    expect(isTodayLogged(user({}, { '2026-10-15': 0 }), at(0, 30))).toBe(true);
    expect(isTodayLogged(user({}, { '2026-10-14': 0 }), at(0, 30))).toBe(false);
  });
});

describe('shouldShowReminder', () => {
  const enabled = { enabled: true, time: '21:00' };

  it('aparece tras la hora si hoy no hay registro', () => {
    expect(shouldShowReminder(user(enabled), at(21))).toBe(true);
    expect(shouldShowReminder(user(enabled), at(23, 30))).toBe(true);
  });

  it('no aparece antes de la hora, con registro o desactivado', () => {
    expect(shouldShowReminder(user(enabled), at(20, 59))).toBe(false);
    expect(shouldShowReminder(user(enabled, { '2026-10-15': 2 }), at(22))).toBe(false);
    expect(shouldShowReminder(user({ ...enabled, enabled: false }), at(22))).toBe(false);
  });
});

describe('getNotificationDelay', () => {
  const enabled = { enabled: true, time: '21:00' };

  it('programa la notificación para la hora de hoy', () => {
    expect(getNotificationDelay(user(enabled), at(20, 30))).toBe(30 * 60 * 1000);
  });

  it('no programa nada si ya pasó la hora, ya hay registro o ya se notificó hoy', () => {
    expect(getNotificationDelay(user(enabled), at(21, 5))).toBeNull();
    expect(getNotificationDelay(user(enabled, { '2026-10-15': 0 }), at(20))).toBeNull();
    expect(getNotificationDelay(user({ ...enabled, lastNotified: '2026-10-15' }), at(20))).toBeNull();
    expect(getNotificationDelay(user({ ...enabled, enabled: false }), at(20))).toBeNull();
  });

  it('una notificación de ayer no impide la de hoy', () => {
    expect(getNotificationDelay(user({ ...enabled, lastNotified: '2026-10-14' }), at(20))).toBe(60 * 60 * 1000);
  });
});
