import dynamic from 'next/dynamic';

const RouterApp = dynamic(() => import('@/components/RouterApp'), { ssr: false });

export default function Page() {
  return <RouterApp />;
}
