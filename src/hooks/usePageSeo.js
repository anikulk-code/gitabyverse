import { useEffect } from 'react';

export function usePageSeo(applySeo, deps) {
  useEffect(() => {
    applySeo();
    // applySeo is intentionally recreated per page; deps list controls when SEO updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
