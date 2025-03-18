import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from './Login';
import '@testing-library/jest-dom';

describe('LoginPage', () => {
  it('renders login form', () => {
    render(<LoginPage />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByLabelText('Accedi come:')).toBeInTheDocument();
  });

  it('shows error message on failed login', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText('Login'));

    const errorMessage = await screen.findByText('Invalid credentials');
    expect(errorMessage).toBeInTheDocument();
  });

  it('allows user to select role', () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText('Accedi come:'), { target: { value: 'teacher' } });
    expect(screen.getByDisplayValue('Teacher')).toBeInTheDocument();
  });
});
