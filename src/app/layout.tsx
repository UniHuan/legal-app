import './globals.css';
import { Metadata } from 'next';
export const metadata: Metadata = {title:'法治同行',description:'民法典科普平台'};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="zh-CN"><body className="antialiased">{children}</body></html>;
}
