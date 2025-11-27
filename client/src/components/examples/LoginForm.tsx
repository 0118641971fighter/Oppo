import LoginForm from '../LoginForm';

export default function LoginFormExample() {
  return <LoginForm onLoginSuccess={() => console.log('Login successful')} />;
}
