import Link from 'next/link';
import { getScene } from '@/lib/api';
import { VALUE_TIERS } from '@/lib/constants';
const tierColors:Record<string,string> = {national:'bg-red-50 text-red-700',social:'bg-blue-50 text-blue-700',personal:'bg-green-50 text-green-700'};
const concColors:Record<string,string> = {good:'bg-green-50 text-green-700',warn:'bg-orange-50 text-orange-700',bad:'bg-red-50 text-red-700'};

export default async function DesktopScene({params}:{params:Promise<{id:string}>}) {
  const {id} = await params;
  const s = await getScene(id);
  if (!s) return <div className="text-center py-10 text-[#6B7194]">未找到</div>;
  return (
    <>
      <Link href="/desktop" className="text-sm text-[#1D4ED8] font-medium mb-4 inline-block">← 返回首页</Link>
      <h1 className="text-[26px] font-bold mb-3 tracking-tight">{s.title}</h1>
      <div className="flex gap-2 flex-wrap mb-4">
        {(s.value_tags||[]).map((v:string)=>(
          <span key={v} className={`px-2 py-0.5 rounded text-[10px] font-medium ${tierColors[VALUE_TIERS[v]]||'bg-gray-100 text-gray-600'}`}>{v}</span>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div>
          <div className={`rounded-2xl p-5 mb-5 text-base font-semibold leading-relaxed ${concColors[s.conclusion_type]}`}>{s.conclusion}</div>
          <h3 className="text-base font-bold mb-3">📋 你可以这样做</h3>
          <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm mb-5">
            <ol className="list-none space-y-0">
              {(s.steps||[]).map((st:string,i:number)=>(
                <li key={i} className="flex gap-3 py-3 border-b border-black/5 text-sm last:border-b-0 items-start">
                  <span className="w-7 h-7 bg-[#1D4ED8] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i+1}</span><span>{st}</span>
                </li>
              ))}
            </ol>
          </div>
          <h3 className="text-base font-bold mb-3">📜 法律怎么说</h3>
          <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm mb-5 text-sm leading-relaxed">{s.legal_analysis}</div>
          {(s.warnings||[]).length>0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-5 text-xs text-orange-700 leading-relaxed">
              <strong>⚠️ 容易踩的坑</strong>{(s.warnings||[]).map((w:string,i:number)=><div key={i} className="mt-1">· {w}</div>)}
            </div>
          )}
        </div>
        <div className="pt-1">
          <div className="bg-white rounded-2xl border border-black/5 p-4 shadow-sm sticky top-20">
            <h4 className="text-sm font-semibold mb-2">📞 法律援助</h4>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
              <div className="text-sm text-red-600 font-semibold">全国法律援助热线</div>
              <div className="text-3xl font-extrabold text-red-600 tracking-widest my-1">12348</div>
              <div className="text-[11px] text-red-500">免费 · 24小时 · 专业律师</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
