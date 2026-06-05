import Link from 'next/link';
import { getArticles } from '@/lib/api';
export default async function MobileBook({params}:{params:Promise<{book:string}>}) {
  const {book} = await params;
  const articles = await getArticles(50, parseInt(book));
  return (
    <>
      <Link href="/mobile/code" className="text-sm text-[#1D4ED8] font-medium mb-4 inline-block">← 目录</Link>
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 divide-y divide-black/5">
        {articles.map((a:any)=>(
          <Link key={a.article_number} href={`/mobile/article/${a.article_number}`}
            className="flex items-center gap-2.5 px-4 py-3 text-sm no-underline text-inherit active:bg-[#F0F4FA] transition-colors">
            <span className="text-[#1D4ED8] font-bold w-12 text-right shrink-0">第{a.article_number}条</span>
            <span className="leading-snug">{a.one_liner}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
