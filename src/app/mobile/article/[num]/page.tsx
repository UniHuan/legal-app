import Link from 'next/link';
import { getArticle } from '@/lib/api';
export default async function MobileArticle({params}:{params:Promise<{num:string}>}) {
  const {num} = await params;
  const a = await getArticle(parseInt(num));
  if (!a) return <div className="text-center text-[#6B7194] py-10">未找到该法条</div>;
  return (
    <>
      <Link href="/mobile/code" className="text-sm text-[#1D4ED8] font-medium mb-4 inline-block">← 法典</Link>
      <div className="text-[22px] font-bold text-[#1D4ED8] mb-1">第{a.article_number}条</div>
      <div className="text-xs text-[#6B7194] mb-3">{a.book_title}</div>
      <div className="bg-[#F0F4FA] rounded-2xl p-4 mb-3 text-sm leading-relaxed"><strong>💬 大白话：</strong>{a.content_plain}</div>
      <div className="bg-white rounded-2xl p-4 border-l-[3px] border-[#1D4ED8] text-sm leading-relaxed shadow-sm"><strong>📜 法条原文：</strong><br/>{a.content_original}</div>
    </>
  );
}
