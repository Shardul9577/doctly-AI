import { ReactNode } from 'react';
// guards
import AuthGuard from '../guards/AuthGuard';
// components
import MainLayout from './main';
import DashboardLayout from './dashboard';
import PatientLayout from './patient';
import AdminLayout from './admin';
import LogoOnlyLayout from './LogoOnlyLayout';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
  variant?: 'main' | 'dashboard' | 'logoOnly';
};

export default function Layout({ variant = 'dashboard', children }: Props) {
  const router = useRouter();

  let query = router.asPath;

  if (variant === 'logoOnly') {
    return <LogoOnlyLayout> {children} </LogoOnlyLayout>;
  }

  if (variant === 'main') {
    return <MainLayout>{children}</MainLayout>;
  }

  return (
    <AuthGuard>
      {query.split('/').includes('dashboard') && (
        <DashboardLayout> {children} </DashboardLayout>
      )}
      {query.split('/').includes('patient') && (
        <PatientLayout> {children} </PatientLayout>
      )}
      {query.split('/').includes('admin') && (
        <AdminLayout> {children} </AdminLayout>
      )}
    </AuthGuard>
  );
}
