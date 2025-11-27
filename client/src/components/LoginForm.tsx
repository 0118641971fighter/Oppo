import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest('POST', '/api/login', { username, password });
      const data = await response.json();

      if (data.success) {
        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: 'مرحباً بك في نظام المخالفات',
        });
        onLoginSuccess();
      }
    } catch (error) {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: 'اسم المستخدم أو كلمة المرور غير صحيحة',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/30 to-background p-4">
      <Card className="w-full max-w-md">
        <div className="h-2 bg-gradient-to-r from-[#00bfa5] to-[#1de9b6] rounded-t-lg" />
        <CardHeader className="text-center space-y-2 pt-8">
          <div className="mx-auto mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3" fill="none" className="text-primary" />
              <path
                d="M30 50C30 38.954 38.954 30 50 30C61.046 30 70 38.954 70 50C70 61.046 61.046 70 50 70C38.954 70 30 61.046 30 50Z"
                fill="currentColor"
                className="text-primary"
              />
              <path
                d="M45 40C45 37.239 47.239 35 50 35C52.761 35 55 37.239 55 40V60C55 62.761 52.761 65 50 65C47.239 65 45 62.761 45 60V40Z"
                fill="white"
              />
              <path
                d="M40 45H60C62.761 45 65 47.239 65 50C65 52.761 62.761 55 60 55H40C37.239 55 35 52.761 35 50C35 47.239 37.239 45 40 45Z"
                fill="white"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
          <p className="text-muted-foreground text-sm">نظام إدارة المخالفات - OPPO EGYPT</p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-right block">
                اسم المستخدم
              </Label>
              <Input
                id="username"
                data-testid="input-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 text-right"
                required
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-right block">
                كلمة المرور
              </Label>
              <Input
                id="password"
                data-testid="input-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-right"
                required
                dir="rtl"
              />
            </div>
            <Button
              type="submit"
              data-testid="button-login"
              className="w-full h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'دخول'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
