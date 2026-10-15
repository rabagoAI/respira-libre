// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsModal from '../SettingsModal';
import { buildBackup } from '../../utils/backup';
import { reloadPage } from '../../utils/reload';

vi.mock('../../utils/reload', () => ({ reloadPage: vi.fn() }));

const userData = {
  quitDate: new Date(2026, 9, 1).toISOString(),
  packPrice: 5,
  cigarettesPerPack: 20,
  cigarettesPerDayBefore: 20,
  cigarettesPerDayNow: 10,
  dailyLog: { '2026-10-02': 4 }
};

const backupFile = (content) => new File([content], 'copia.json', { type: 'application/json' });

const setup = () => {
  const props = { onClose: vi.fn(), onSave: vi.fn(), onReset: vi.fn() };
  render(<SettingsModal userData={userData} {...props} />);
  return { ...props, user: userEvent.setup() };
};

beforeEach(() => {
  vi.mocked(reloadPage).mockClear();
});

describe('SettingsModal · copia de seguridad', () => {
  it('rechaza un archivo que no es una copia y no toca los datos', async () => {
    const { user } = setup();
    await user.upload(screen.getByLabelText('Archivo de copia de seguridad'), backupFile('{"app":"otra"}'));

    expect(await screen.findByText(/no es una copia de seguridad/i)).toBeInTheDocument();
    expect(window.localStorage.getItem('respiraLibre_userData')).toBeNull();
    expect(reloadPage).not.toHaveBeenCalled();
  });

  it('pide confirmación y, al aceptar, guarda la copia y recarga', async () => {
    const { user } = setup();
    const goals = [{ id: 1, name: 'Bicicleta', price: 300, category: 'Deporte' }];
    await user.upload(
      screen.getByLabelText('Archivo de copia de seguridad'),
      backupFile(JSON.stringify(buildBackup(userData, goals)))
    );

    expect(await screen.findByText(/la copia tiene 1 días registrados y 1 objetivo/i)).toBeInTheDocument();
    expect(window.localStorage.getItem('respiraLibre_userData')).toBeNull();

    await user.click(screen.getByRole('button', { name: /sí, importar/i }));
    expect(JSON.parse(window.localStorage.getItem('respiraLibre_userData'))).toEqual(userData);
    expect(JSON.parse(window.localStorage.getItem('respiraLibre_goals'))).toEqual(goals);
    expect(reloadPage).toHaveBeenCalledTimes(1);
  });

  it('cancelar la importación no cambia nada', async () => {
    const { user } = setup();
    await user.upload(screen.getByLabelText('Archivo de copia de seguridad'), backupFile(JSON.stringify(buildBackup(userData))));
    // Hay dos "Cancelar": se usa el del bloque de confirmación de la importación
    const summary = await screen.findByText(/la copia tiene/i);
    await user.click(within(summary.parentElement).getByRole('button', { name: /^cancelar$/i }));
    expect(window.localStorage.getItem('respiraLibre_userData')).toBeNull();
    expect(screen.getByRole('button', { name: /importar datos/i })).toBeInTheDocument();
  });
});

describe('SettingsModal · accesibilidad', () => {
  it('es un diálogo con título y se cierra con Escape', async () => {
    const { onClose, user } = setup();
    expect(screen.getByRole('dialog', { name: 'Editar configuración' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});
