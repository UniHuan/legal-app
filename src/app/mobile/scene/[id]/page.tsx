import Link from 'next/link';
import { getScene } from '@/lib/api';
import { VALUE_TIERS } from '@/lib/constants';
const tierColors:Record<string,string> = {national:'bg-red-50 text-red-700',social:'bg-blue-50 text-blue-700',personal:'bg-green-50 text-green-700'};
const concColors:Record<string,string> = {good:'bg-green-50 text-green-700',warn:'bg-orange-50 text-orange-700',bad:'bg-red-50 text-red-700'};

export default async function MobileScene({params}:{params:Promise<{id:string}>}) {
  const {id} = await params;
  const s = await getScene(id);
  if (!s) return <div className="text-center py-10 text-[#6B7194]">未找到该场景</div>;
  return (
    <>
      <Link href="/mobile" className="text-sm text-[#1D4ED8] font-medium mb-3 inline-block">← 返回</Link>
      <h1 className="text-xl font-bold mb-3 leading-snug">{s.title}</h1>
      <div className={`rounded-2xl p-3.5 mb-4 text-sm font-semibold leading-relaxed ${concColors[s.conclusion_type]}`}>{s.conclusion}</div>

      <h3 className="text-[15px] font-bold mb-2">📋 你可以这样做</h3>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-black/5 mb-4">
        <ol className="list-none space-y-0">
          {(s.steps||[]).map((st:string,i:number)=>(
            <li key={i} className="flex gap-2.5 py-2.5 border-b border-black/5 text-sm last:border-b-0 items-start">
              <span className="w-6 h-6 bg-[#1D4ED8] text-white rounded-full flex items-center justify-center text-[11px] font-bold shrink-0">{i+1}</span>
              <span>{st}</span>
            </li>
          ))}
        </ol>
      </div>

      <h3 className="text-[15px] font-bold mb-2">📜 法律怎么说</h3>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-black/5 mb-4 text-sm leading-relaxed">{s.legal_analysis}</div>

      {(s.warnings||[]).length>0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 mb-4 text-xs text-orange-700 leading-relaxed">
          <strong>⚠️ 容易踩的坑</strong>
          {(s.warnings||[]).map((w:string,i:number)=><div key={i} className="mt-1">· {w}</div>)}
        </div>
      )}

      <div className="flex gap-1 flex-wrap mb-3">
        {(s.value_tags||[]).map((v:string)=>(
          <span key={v} className={`px-2 py-0.5 rounded text-[10px] font-medium ${tierColors[VALUE_TIERS[v]]||'bg-gray-100 text-gray-600'}`}>{v}</span>
        ))}
      </div>

      <Link href="/mobile/ai" className="block w-full bg-[#1D4ED8] text-white text-center rounded-2xl py-3.5 text-[15px] font-semibold no-underline active:scale-[0.98] transition-all">
        💬 还有疑问？问问AI
      </Link>
    </>
  );
}
