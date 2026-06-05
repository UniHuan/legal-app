import Link from 'next/link';
export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-[100dvh] gap-8 bg-[#F9F8F5]">
      <Link href="/mobile" className="px-8 py-4 bg-[#1D4ED8] text-white rounded-2xl text-lg font-semibold no-underline hover:bg-[#1E3A8A] transition-colors">
        📱 移动版
      </Link>
      <Link href="/desktop" className="px-8 py-4 bg-white border-2 border-[#1D4ED8] text-[#1D4ED8] rounded-2xl text-lg font-semibold no-underline hover:bg-[#E8EEFB] transition-colors">
        🖥️ 桌面版
      </Link>
    </div>
  );
}
