import Link from 'next/link';
import { getArticle } from '@/lib/api';
export default async function DesktopArticle({params}:{params:Promise<{num:string}>}) {
  const {num} = await params;
  const a = await getArticle(parseInt(num));
  if (!a) return <div className="text-center py-10 text-[#6B7194]">未找到</div>;
  return (
    <>
      <Link href="/desktop/code" className="text-sm text-[#1D4ED8] font-medium mb-4 inline-block">← 法典</Link>
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-black/5">
          <div className="text-2xl font-bold text-[#1D4ED8]">第{a.article_number}条</div>
          <div className="text-xs text-[#6B7194] mt-1">{a.book_title}</div>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-[#F0F4FA] rounded-xl p-5 text-sm leading-relaxed"><strong>💬 大白话：</strong>{a.content_plain}</div>
          <div className="bg-[#F9F8F5] rounded-xl p-5 border-l-2 border-[#1D4ED8] text-sm leading-relaxed"><strong>📜 法条原文：</strong><br/>{a.content_original}</div>
        </div>
      </div>
    </>
  );
}
