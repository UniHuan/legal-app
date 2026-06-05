import './globals.css';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: '法治同行',
  description: '民法典科普平台 · 1260条法条 · AI问答 · 完全免费',
  icons: { icon: '/favicon.svg', apple: '/apple-touch-icon.svg' },
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: '法治同行' },
  other: { 'mobile-web-app-capable': 'yes' }
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="zh-CN"><body className="antialiased">{children}</body></html>;
}
