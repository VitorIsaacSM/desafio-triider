import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Autenticacao from './autenticacao';

describe('<Autenticacao />', () => {
  test('it should mount', () => {
    render(<Autenticacao />);
    
    const auth = screen.getByTestId('auth');

    expect(auth).toBeInTheDocument();
  });
});