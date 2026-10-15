// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import BreathingModal from '../BreathingModal';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// Avanza el reloj segundo a segundo (el ejercicio usa un intervalo de 1 s)
const advanceSeconds = (seconds) => {
  for (let i = 0; i < seconds; i++) {
    act(() => { vi.advanceTimersByTime(1000); });
  }
};

describe('BreathingModal', () => {
  it('guía las fases de cada respiración', () => {
    render(<BreathingModal onClose={vi.fn()} onComplete={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /empezar/i }));

    expect(screen.getByText('Toma aire por la nariz')).toBeInTheDocument();
    expect(screen.getByText('Respiración 1 de 10')).toBeInTheDocument();

    advanceSeconds(4);
    expect(screen.getByText('Suelta el aire por la boca')).toBeInTheDocument();

    advanceSeconds(6);
    expect(screen.getByText('Respiración 2 de 10')).toBeInTheDocument();
  });

  it('al completar las 10 respiraciones avisa una sola vez y felicita', () => {
    const onComplete = vi.fn();
    render(<BreathingModal onClose={vi.fn()} onComplete={onComplete} />);
    fireEvent.click(screen.getByRole('button', { name: /empezar/i }));

    advanceSeconds(10 * 10);
    expect(screen.getByRole('heading', { name: '¡Bien hecho!' })).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);

    advanceSeconds(5);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('"Otra vez" vuelve a empezar y cuenta un nuevo ejercicio al terminar', () => {
    const onComplete = vi.fn();
    render(<BreathingModal onClose={vi.fn()} onComplete={onComplete} />);
    fireEvent.click(screen.getByRole('button', { name: /empezar/i }));
    advanceSeconds(100);

    fireEvent.click(screen.getByRole('button', { name: /otra vez/i }));
    expect(screen.getByText('Respiración 1 de 10')).toBeInTheDocument();
    advanceSeconds(100);
    expect(onComplete).toHaveBeenCalledTimes(2);
  });

  it('cerrar antes de terminar no cuenta el ejercicio', () => {
    const onComplete = vi.fn();
    const onClose = vi.fn();
    render(<BreathingModal onClose={onClose} onComplete={onComplete} />);
    fireEvent.click(screen.getByRole('button', { name: /empezar/i }));
    advanceSeconds(30);

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onClose).toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
  });
});
