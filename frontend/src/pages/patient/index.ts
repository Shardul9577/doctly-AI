import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// config
import { PATH_AFTER_PATIENT_LOGIN } from '../../config';
// routes
import { PATH_PATIENT_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function Index() {
  const { pathname, replace, prefetch } = useRouter();

  useEffect(() => {
    if (pathname === PATH_PATIENT_DASHBOARD.root) {
      replace(PATH_AFTER_PATIENT_LOGIN);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    prefetch(PATH_AFTER_PATIENT_LOGIN);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
