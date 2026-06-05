import Link from 'next/link';
import { getArticles } from '@/lib/api';
export default async function DesktopBook({params}:{params:Promise<{book:string}>}) {
  const {book} = await params;
  const articles = await getArticles(50, parseInt(book));
  return (
    <>
      <Link href="/desktop/code" className="text-sm text-[#1D4ED8] font-medium mb-4 inline-block">← 目录</Link>
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm divide-y divide-black/5">
        {articles.map((a:any)=>(
          <Link key={a.article_number} href={`/desktop/article/${a.article_number}`}
            className="flex items-center gap-3 px-5 py-3.5 text-sm no-underline text-inherit hover:text-[#1D4ED8] hover:pl-6 transition-all">
            <span className="text-[#1D4ED8] font-bold w-14 text-right shrink-0">第{a.article_number}条</span>
            <span>{a.one_liner}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
