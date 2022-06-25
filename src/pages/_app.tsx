import { withTRPC } from '@trpc/next';
import { AppType } from 'next/dist/shared/lib/utils';
import type { AppRouter } from '@pages/api/trpc/[trpc]';
import { ClickToComponent } from 'click-to-react-component';
import Loading from '@components/Loading';
import { transformer } from '@utils/trpc';
import { VisibilityProvider } from 'context';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    router.events.on('routeChangeError', () => setLoading(false));
    router.events.on('routeChangeStart', () => setLoading(true));
    router.events.on('routeChangeComplete', () => setLoading(false));

    return () => {
      router.events.off('routeChangeError', () => setLoading(false));
      router.events.off('routeChangeStart', () => setLoading(true));
      router.events.off('routeChangeComplete', () => setLoading(false));
    };
  }, [router.events]);

  return loading ? (
    <Loading />
  ) : (
    <VisibilityProvider>
      <ClickToComponent />
      <Component {...pageProps} />
    </VisibilityProvider>
  );
};

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '';
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export default withTRPC<AppRouter>({
  config() {
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer,
    };
  },
  ssr: true,
})(MyApp);
