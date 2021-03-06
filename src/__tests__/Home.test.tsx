import { expect, test } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import Home from '../pages/index';

test('home', () => {
  render(<Home />);
  const main = within(screen.getByLabelText('Home'));
  expect(main).toBeDefined();
});
