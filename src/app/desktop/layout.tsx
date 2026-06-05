import Sidebar from '@/components/desktop/Sidebar';
export default function DesktopLayout({children}:{children:React.ReactNode}) {
  return (
    <div className="flex min-h-[100dvh] bg-[#F9F8F5] text-[#1A1F36]">
      <Sidebar />
      <main className="ml-60 flex-1 min-w-0">
        <div className="sticky top-0 z-40 bg-white border-b border-black/5 px-6 py-3 flex items-center gap-4">
          <div className="flex-1 max-w-lg flex items-center gap-2 bg-[#F9F8F5] border border-black/5 rounded-3xl px-4 py-2.5">
            <span>🔍</span>
            <input placeholder="描述你的情况..." className="flex-1 border-none outline-none text-sm bg-transparent" />
          </div>
          <button className="border border-red-300 text-red-600 rounded-lg px-3 py-1.5 text-xs hover:bg-red-50 transition-colors">👴 银发模式</button>
        </div>
        <div className="p-7 max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
