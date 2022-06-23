import { withTRPC } from '@trpc/next';
import { AppType } from 'next/dist/shared/lib/utils';
import type { AppRouter } from '@pages/api/trpc/[trpc]';
import { transformer } from '@utils/trpc';
import '../styles/globals.css';

const MyApp: AppType = ({ Component, pageProps }) => <Component {...pageProps} />;

export default withTRPC<AppRouter>({
  config() {
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : 'http://localhost:3000/api/trpc';

    // eslint-disable-next-line no-console
    console.log('🚀 ~ file: _app.tsx ~ line 12 ~ config ~ url', url);
    return {
      url,
      transformer,
    };
  },
  ssr: true,
})(MyApp);
