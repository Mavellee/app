import { render, screen } from '@testing-library/react-native';

import StartScreen from '@/app/index';

describe('StartScreen', () => {
  it('shows the app name and which build is running', async () => {
    await render(<StartScreen />);
    expect(screen.getByRole('header', { name: 'Mavelle' })).toBeTruthy();
    expect(screen.getByText('Build')).toBeTruthy();
    expect(screen.getByText('development')).toBeTruthy();
  });
});
