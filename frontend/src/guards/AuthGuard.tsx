import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import LoadingScreen from '../components/LoadingScreen';
import {
  PATH_DASHBOARD,
  PATH_PATIENT_DASHBOARD,
  PATH_ADMIN_DASHBOARD,
} from '../routes/paths';
import AccessDeniedPage from 'src/sections/Access Denied/AccessDenied';

type Props = {
  children: ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  const allowedRoutesByRole: Record<string, string[]> = {
    doctor: [PATH_DASHBOARD.root],
    patient: [PATH_PATIENT_DASHBOARD.root],
    admin: [PATH_ADMIN_DASHBOARD.root],
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('userData');
      const accessToken = localStorage.getItem('accessToken');

      if (!storedUser || !accessToken) {
        setUser(null);
        setToken(null);
        setChecking(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(accessToken);
        setChecking(false);

        const role = parsedUser.role;
        const currentPath = router.pathname;

        if (currentPath === '/' || currentPath.includes('/auth')) {
          if (role === 'doctor') router.replace(PATH_DASHBOARD.root);
          else if (role === 'patient')
            router.replace(PATH_PATIENT_DASHBOARD.root);
          else if (role === 'admin') router.replace(PATH_ADMIN_DASHBOARD.root);
        }
      } catch (err) {
        console.error('Invalid user data in localStorage');
        setUser(null);
        setToken(null);
        setChecking(false);
      }
    }
  }, [router]);

  if (checking) return <LoadingScreen />;

  const isDashboardRoute =
    router.pathname.startsWith(PATH_DASHBOARD.root) ||
    router.pathname.startsWith(PATH_PATIENT_DASHBOARD.root) ||
    router.pathname.startsWith(PATH_ADMIN_DASHBOARD.root);

  // Block guests from accessing any dashboard route
  if (!user && isDashboardRoute) {
    return <AccessDeniedPage />;
  }

  // Block logged-in users from accessing routes not allowed for their role
  const isAllowed =
    !user || // public routes
    allowedRoutesByRole[user.role]?.some((route) =>
      router.pathname.startsWith(route)
    );

  if (!isAllowed) {
    return <AccessDeniedPage />;
  }

  return <>{children}</>;
}
