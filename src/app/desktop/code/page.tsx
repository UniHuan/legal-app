import Link from 'next/link';
import { BOOKS } from '@/lib/constants';
export default function DesktopCode() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-1">📖 法典全文</h1>
      <p className="text-sm text-[#6B7194] mb-6">《中华人民共和国民法典》· 7编 · 1260条 · 2021.1.1施行</p>
      <div className="flex items-center gap-2.5 bg-[#F9F8F5] border border-black/5 rounded-3xl px-4 py-2.5 mb-6 max-w-lg transition-all focus-within:border-[#1D4ED8]">
        <span>🔍</span>
        <input placeholder="编号直达(如725)或关键词..." className="flex-1 border-none outline-none text-sm bg-transparent" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {BOOKS.map(b=>(
          <Link key={b.b} href={`/desktop/code/${b.b}`}
            className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm no-underline text-inherit hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="text-base font-bold">第{b.b}编 {b.t}</div>
            <div className="text-xs text-[#6B7194] mt-1">{b.c}条</div>
          </Link>
        ))}
      </div>
    </>
  );
}
