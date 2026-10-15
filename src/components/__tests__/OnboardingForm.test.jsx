// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OnboardingForm from '../OnboardingForm';
import { parseLocalDate, toLocalDateString } from '../../utils/dates';

const setup = () => {
  const onSubmit = vi.fn();
  render(<OnboardingForm onSubmit={onSubmit} />);
  return { onSubmit, user: userEvent.setup() };
};

describe('OnboardingForm', () => {
  it('muestra los errores asociados a cada campo si faltan datos', async () => {
    const { onSubmit, user } = setup();
    await user.click(screen.getByRole('button', { name: /comenzar mi camino/i }));

    const price = screen.getByLabelText(/cuánto cuesta tu paquete/i);
    expect(price).toHaveAttribute('aria-invalid', 'true');
    expect(price).toHaveAccessibleDescription(/introduce un precio válido/i);
    expect(screen.getByLabelText(/cuántos cigarrillos fumabas/i)).toHaveAttribute('aria-invalid', 'true');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('muestra la vista previa del ahorro y envía los datos convertidos', async () => {
    const { onSubmit, user } = setup();
    await user.type(screen.getByLabelText(/cuánto cuesta tu paquete/i), '5');
    await user.type(screen.getByLabelText(/cuántos cigarrillos fumabas/i), '20');

    // 20 cigarrillos × 0,25 € = 5 € al día
    expect(screen.getByText('Cada día').nextElementSibling).toHaveTextContent('5,00 €');

    await user.click(screen.getByRole('button', { name: /comenzar mi camino/i }));
    expect(onSubmit).toHaveBeenCalledWith({
      packPrice: 5,
      cigarettesPerPack: 20,
      cigarettesPerDayBefore: 20,
      cigarettesPerDayNow: 0,
      quitDate: parseLocalDate(toLocalDateString()).toISOString()
    });
  });

  it('no deja fumar más ahora que antes', async () => {
    const { onSubmit, user } = setup();
    await user.type(screen.getByLabelText(/cuánto cuesta tu paquete/i), '5');
    await user.type(screen.getByLabelText(/cuántos cigarrillos fumabas/i), '10');
    const now = screen.getByLabelText(/cuántos cigarrillos fumas ahora/i);
    await user.clear(now);
    await user.type(now, '12');
    await user.click(screen.getByRole('button', { name: /comenzar mi camino/i }));

    expect(now).toHaveAccessibleDescription(/no puede ser mayor/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
