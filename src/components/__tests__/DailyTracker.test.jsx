// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { subDays } from 'date-fns';
import DailyTracker from '../DailyTracker';
import { toLocalDateString } from '../../utils/dates';

const today = toLocalDateString();
const yesterday = toLocalDateString(subDays(new Date(), 1));

const userData = (dailyLog = {}) => ({
  quitDate: subDays(new Date(), 5).toISOString(),
  packPrice: 5,
  cigarettesPerPack: 20,
  cigarettesPerDayBefore: 20,
  cigarettesPerDayNow: 10,
  dailyLog
});

const setup = (props = {}) => {
  const onUpdateDaily = vi.fn();
  const onOpenBreathing = vi.fn();
  render(
    <DailyTracker userData={userData()} onUpdateDaily={onUpdateDaily} onOpenBreathing={onOpenBreathing} embedded {...props} />
  );
  return { onUpdateDaily, onOpenBreathing, user: userEvent.setup() };
};

const countInput = () => screen.getByLabelText('Cigarrillos fumados');
const saveButton = () => screen.getByRole('button', { name: /guardar/i });

describe('DailyTracker', () => {
  it('guarda el consumo de hoy sin tocar el resto de datos', async () => {
    const { onUpdateDaily, user } = setup();
    await user.type(countInput(), '3');
    await user.click(saveButton());

    expect(onUpdateDaily).toHaveBeenCalledTimes(1);
    const saved = onUpdateDaily.mock.calls[0][0];
    expect(saved.dailyLog).toEqual({ [today]: 3 });
    expect(saved.cigarettesPerDayNow).toBe(10);
    expect(screen.getByText(/guardado correctamente/i)).toBeInTheDocument();
  });

  it('muestra un error y no guarda si el valor no es válido', async () => {
    const { onUpdateDaily, user } = setup();
    await user.click(saveButton());
    expect(screen.getByText(/introduce un número entero/i)).toBeInTheDocument();

    await user.type(countInput(), '2.5');
    await user.click(saveButton());
    expect(onUpdateDaily).not.toHaveBeenCalled();
  });

  it('permite registrar un día pasado', async () => {
    const { onUpdateDaily, user } = setup();
    // jsdom no permite escribir en un campo de fecha: se asigna el valor directamente
    fireEvent.change(screen.getByLabelText('Día del registro'), { target: { value: yesterday } });
    expect(screen.getByRole('heading', { name: /fumaste el/i })).toBeInTheDocument();

    await user.type(countInput(), '1');
    await user.click(saveButton());
    expect(onUpdateDaily.mock.calls[0][0].dailyLog).toEqual({ [yesterday]: 1 });
  });

  it('avisa al escribir más de lo que se fumaba antes de empezar', async () => {
    const { user } = setup();
    await user.type(countInput(), '25');
    expect(screen.getByRole('note')).toHaveTextContent(/más de lo que fumabas al día antes de empezar \(20\)/i);
  });

  it('tras guardar un día por encima del consumo anterior muestra apoyo y ofrece respirar', async () => {
    const { onUpdateDaily, onOpenBreathing, user } = setup();
    await user.type(countInput(), '25');
    await user.click(saveButton());

    expect(onUpdateDaily).toHaveBeenCalled();
    expect(screen.getByText('Un mal día no borra tu progreso')).toBeInTheDocument();
    expect(screen.queryByRole('note')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /respirar ahora/i }));
    expect(onOpenBreathing).toHaveBeenCalledTimes(1);
  });

  it('el mensaje de apoyo desaparece al cambiar el valor', async () => {
    const { user } = setup();
    await user.type(countInput(), '25');
    await user.click(saveButton());
    await user.clear(countInput());
    await user.type(countInput(), '4');
    expect(screen.queryByText('Un mal día no borra tu progreso')).not.toBeInTheDocument();
  });
});
