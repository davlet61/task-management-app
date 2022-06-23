import { withTRPC } from '@trpc/next';
import { AppType } from 'next/dist/shared/lib/utils';
import type { AppRouter } from '@pages/api/trpc/[trpc]';
import { transformer } from '@utils/trpc';
import '../styles/globals.css';

const MyApp: AppType = ({ Component, pageProps }) => <Component {...pageProps} />;

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
  ssr: false,
})(MyApp);
