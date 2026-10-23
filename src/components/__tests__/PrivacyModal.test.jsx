// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Footer from '../Footer';

describe('Privacidad (desde el footer)', () => {
  it('abre el diálogo de privacidad desde el enlace del footer', async () => {
    const user = userEvent.setup();
    render(<Footer />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Privacidad' }));

    const dialog = screen.getByRole('dialog', { name: 'Tu privacidad' });
    expect(dialog).toHaveTextContent('solo en el almacenamiento de este navegador');
    expect(dialog).toHaveTextContent('No usamos cookies');
    expect(screen.getByRole('link', { name: 'pacoalfair@hotmail.com' })).toHaveAttribute('href', 'mailto:pacoalfair@hotmail.com');
  });

  it('se cierra con "Entendido" y con Escape', async () => {
    const user = userEvent.setup();
    render(<Footer />);

    await user.click(screen.getByRole('button', { name: 'Privacidad' }));
    await user.click(screen.getByRole('button', { name: 'Entendido' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: 'Privacidad' }));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
