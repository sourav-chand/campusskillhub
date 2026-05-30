import { AuthLayout } from '@/components/layout/auth-layout';

export default function AuthPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
