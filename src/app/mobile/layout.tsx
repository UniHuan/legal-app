import Link from 'next/link';
import TabBar from '@/components/mobile/TabBar';
export default function MobileLayout({children}:{children:React.ReactNode}) {
  return (
    <div className="min-h-screen bg-[#F9F8F5] text-[#1A1F36] font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 h-11 bg-white border-b border-black/5 flex items-center justify-between px-4 text-[15px] font-semibold">
        <Link href="/mobile" className="flex items-center gap-1.5 no-underline text-inherit">
          ⚖️ 法治同行
        </Link>
        <a href="tel:12348" className="text-sm text-red-600 no-underline font-medium">📞 12348</a>
      </header>
      <main className="pt-11 pb-16 px-4">{children}</main>
      <TabBar />
    </div>
  );
}
