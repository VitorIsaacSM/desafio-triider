import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import calendario from './calendario';

describe('<calendario />', () => {
  test('it should mount', () => {
    render(<calendario />);
    
    const calendario = screen.getByTestId('calendario');

    expect(calendario).toBeInTheDocument();
  });
});