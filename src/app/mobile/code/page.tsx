import Link from 'next/link';
import { BOOKS } from '@/lib/constants';
export default function MobileCode() {
  return (
    <>
      <h2 className="text-[17px] font-bold mb-1">📖 法典全文</h2>
      <p className="text-xs text-[#6B7194] mb-4">《中华人民共和国民法典》· 7编 · 1260条</p>
      <div className="flex items-center gap-2 bg-white border border-black/5 rounded-3xl px-4 py-2.5 mb-5 shadow-sm">
        <span>🔍</span>
        <input placeholder="输入编号直达(如725)" className="flex-1 border-none outline-none text-[15px] bg-transparent" />
      </div>
      {BOOKS.map(b=>(
        <Link key={b.b} href={`/mobile/code/${b.b}`}
          className="block bg-white rounded-2xl p-4 mb-2 shadow-sm border border-black/5 no-underline text-inherit active:scale-[0.98] transition-all">
          <div className="text-[15px] font-bold">第{b.b}编 {b.t}</div>
          <div className="text-xs text-[#6B7194] mt-1">{b.c}条</div>
        </Link>
      ))}
    </>
  );
}
