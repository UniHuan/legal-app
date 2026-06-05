import Link from 'next/link';
import { getScenarios } from '@/lib/api';
import { CATEGORIES } from '@/lib/constants';
import SceneCard from '@/components/shared/SceneCard';
import type { Scenario } from '@/lib/types';

export default async function MobileHome({searchParams}:{searchParams:Promise<{cat?:string}>}) {
  const {cat} = await searchParams;
  const scenes = await getScenarios(cat ? 50 : 8, cat);
  const catInfo = cat ? CATEGORIES[cat] : null;

  if (catInfo) {
    return (
      <>
        <Link href="/mobile" className="text-sm text-[#1D4ED8] font-medium mb-3 inline-block">← 返回首页</Link>
        <div className="flex items-center gap-3 p-3.5 bg-[#F0F4FA] rounded-2xl mb-4">
          <span className="text-3xl">{catInfo.icon}</span>
          <div>
            <div className="text-lg font-bold text-[#1D4ED8]">{catInfo.label}</div>
            <div className="text-xs text-[#6B7194]">共 {scenes.length} 个场景</div>
          </div>
        </div>
        {scenes.map((s:Scenario,i:number)=>(
          <SceneCard key={s.id} scene={s} delay={i*0.05} href={`/mobile/scene/${s.id}`} />
        ))}
      </>
    );
  }

  return (
    <>
      <form action="/mobile" className="flex items-center gap-2 bg-white border border-black/5 rounded-3xl px-4 py-2.5 mb-5 shadow-sm focus-within:border-[#1D4ED8] transition-colors">
        <span>🔍</span>
        <input name="q" placeholder="比如：房东要卖房我能不搬吗？" className="flex-1 border-none outline-none text-[15px] bg-transparent" />
      </form>
      <Link href="/mobile/ai" className="block bg-gradient-to-br from-[#F0F4FA] to-[#E8EEFB] rounded-2xl p-4 mb-5 border border-blue-500/10 relative overflow-hidden no-underline">
        <div className="absolute -top-8 -right-8 w-20 h-20 bg-blue-500/5 rounded-full" />
        <div className="flex items-center gap-3 relative z-10">
          <span className="text-4xl">💬</span>
          <div>
            <div className="text-base font-bold text-[#1D4ED8]">AI 智能问答</div>
            <div className="text-xs text-[#6B7194] mt-0.5">免费不限次 · 基于民法典知识库</div>
          </div>
        </div>
      </Link>

      <h2 className="text-[17px] font-bold mb-3 mt-6">📂 场景分类</h2>
      <div className="grid grid-cols-4 gap-2 mb-6">
        {Object.entries(CATEGORIES).map(([k,v])=>(
          <Link key={k} href={`/mobile?cat=${k}`}
            className="text-center py-3 px-1 bg-white rounded-2xl text-[11px] border border-transparent hover:border-[#1D4ED8] hover:bg-[#E8EEFB] transition-all no-underline text-inherit shadow-sm">
            <span className="text-2xl block mb-1">{v.icon}</span>{v.label}
          </Link>
        ))}
      </div>

      <h2 className="text-[17px] font-bold mb-3">🔥 大家都在看</h2>
      {scenes.map((s:Scenario,i:number)=>(
        <SceneCard key={s.id} scene={s} delay={i*0.05} href={`/mobile/scene/${s.id}`} />
      ))}
    </>
  );
}
