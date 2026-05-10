import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// routes
import { PATH_ADMIN_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function Index() {
  const { pathname, push } = useRouter();

  useEffect(() => {
    if (pathname === PATH_ADMIN_DASHBOARD.mail.root) {
      push(PATH_ADMIN_DASHBOARD.mail.all);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
