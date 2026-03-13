import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navigation from '../components/Navigation';

describe('Navigation component', () => {
  test('renders logo and browse link and matches snapshot', () => {
    localStorage.clear();
    const { container } = render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    expect(screen.getByText(/ProNexus/i)).toBeInTheDocument();
    expect(screen.getByText(/Browse Jobs/i)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
