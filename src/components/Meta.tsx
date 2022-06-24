import Head from 'next/head';

interface IDefaultMetaProps {
  title?: string;
  keywords?: string;
  description?: string;
}

const Meta = ({ title, keywords, description }: IDefaultMetaProps) => (
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="keywords" content={keywords} />
    <meta name="description" content={description} />
    <meta charSet="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <title>{title}</title>
  </Head>
);

export default Meta;

Meta.defaultProps = {
  title: 'Task Management',
  keywords: 'web development, programming, nextjs, prisma, trpc',
  description: 'A task management app built with modern tools.',
};
