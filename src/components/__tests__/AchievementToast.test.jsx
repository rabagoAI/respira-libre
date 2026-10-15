// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Trophy, Coins } from 'lucide-react';
import AchievementToast from '../AchievementToast';

const achievements = [
  { id: 'a', title: 'Una semana', description: '7 días seguidos sin fumar', icon: Trophy },
  { id: 'b', title: 'Primeros 10 €', description: 'Has ahorrado 10 €', icon: Coins }
];

afterEach(() => {
  vi.useRealTimers();
});

describe('AchievementToast', () => {
  it('muestra el primer logro nuevo e indica cuántos más hay', () => {
    render(<AchievementToast achievements={achievements} onDismiss={vi.fn()} />);
    const toast = screen.getByRole('status');
    expect(toast).toHaveTextContent('¡Logro desbloqueado!');
    expect(toast).toHaveTextContent('Una semana');
    expect(toast).toHaveTextContent('y 1 más');
  });

  it('se cierra solo a los 7 segundos', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<AchievementToast achievements={achievements} onDismiss={onDismiss} />);

    act(() => { vi.advanceTimersByTime(6999); });
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(1); });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('se puede cerrar a mano', () => {
    const onDismiss = vi.fn();
    render(<AchievementToast achievements={achievements} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole('button', { name: /cerrar aviso de logro/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('no muestra nada sin logros nuevos', () => {
    render(<AchievementToast achievements={[]} onDismiss={vi.fn()} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
