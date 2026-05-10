import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// routes
import { PATH_PATIENT_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function Index() {
  const { pathname, push } = useRouter();

  useEffect(() => {
    if (pathname === PATH_PATIENT_DASHBOARD.visits.root) {
      push(PATH_PATIENT_DASHBOARD.visits.list);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
