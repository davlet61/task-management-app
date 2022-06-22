import { withTRPC } from '@trpc/next';
import { AppType } from 'next/dist/shared/lib/utils';
import type { AppRouter } from '@routers/.';
import '../styles/globals.css';

const MyApp: AppType = ({ Component, pageProps }) => <Component {...pageProps} />;

export default withTRPC<AppRouter>({
  config() {
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : 'http://localhost:3000/api/trpc';

    return {
      url,
    };
  },
  ssr: true,
})(MyApp);
