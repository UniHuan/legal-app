import Link from 'next/link';
import { getScenarios } from '@/lib/api';
import { CATEGORIES } from '@/lib/constants';
import SceneCard from '@/components/shared/SceneCard';
import type { Scenario } from '@/lib/types';

export default async function DesktopHome({searchParams}:{searchParams:Promise<{cat?:string}>}) {
  const {cat} = await searchParams;
  const scenes = await getScenarios(cat ? 50 : 8, cat);
  const catInfo = cat ? CATEGORIES[cat] : null;

  if (catInfo) {
    return (
      <>
        <Link href="/desktop" className="text-sm text-[#1D4ED8] font-medium mb-4 inline-block">← 返回首页</Link>
        <div className="flex items-center gap-4 p-5 bg-[#F0F4FA] rounded-2xl mb-6">
          <span className="text-4xl">{catInfo.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-[#1D4ED8]">{catInfo.label}</h1>
            <p className="text-sm text-[#6B7194]">共 {scenes.length} 个场景</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {scenes.map((s:Scenario,i:number)=>(
            <SceneCard key={s.id} scene={s} delay={i*0.05} href={`/desktop/scene/${s.id}`} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-[#1A1F36] via-[#1E3A5F] to-[#1D4ED8] rounded-2xl p-11 text-white mb-7 relative overflow-hidden">
        <div className="absolute -right-3 -top-8 text-[200px] font-thin opacity-[.04]">⚖️</div>
        <h1 className="text-[30px] font-bold mb-2 relative z-10 tracking-tight">一本你真正能读懂的民法典</h1>
        <p className="text-[15px] opacity-80 max-w-lg mb-4 relative z-10 leading-relaxed">1260条法条 → 100+生活场景 → 12个核心价值观<br/>不用注册 · 完全免费 · 打开即用</p>
        <div className="flex gap-9 mt-5 relative z-10">
          <div className="text-center"><div className="text-2xl font-bold">1,260</div><div className="text-[11px] opacity-60 uppercase tracking-wider">法条全覆盖</div></div>
          <div className="text-center"><div className="text-2xl font-bold">12</div><div className="text-[11px] opacity-60 uppercase tracking-wider">核心价值观</div></div>
          <div className="text-center"><div className="text-2xl font-bold">免费</div><div className="text-[11px] opacity-60 uppercase tracking-wider">永久免费</div></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-7">
        <Link href="/desktop/ai" className="block bg-gradient-to-br from-[#F0F4FA] to-[#E8EFF9] rounded-2xl p-6 border border-blue-500/10 no-underline hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3.5"><span className="text-4xl">💬</span><span className="text-lg font-bold text-[#1D4ED8]">AI 智能问答</span></div>
          <p className="text-sm text-[#6B7194] mb-3.5">基于民法典全量知识库，免费不限次</p>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-white border border-black/5 rounded-full px-3.5 py-1.5 text-xs text-[#6B7194]">房东卖房我能不搬吗</span>
            <span className="bg-white border border-black/5 rounded-full px-3.5 py-1.5 text-xs text-[#6B7194]">买到假货退一赔三</span>
            <span className="bg-white border border-black/5 rounded-full px-3.5 py-1.5 text-xs text-[#6B7194]">没打借条要回钱</span>
          </div>
        </Link>
        <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
          <h2 className="text-base font-bold mb-3">📂 场景分类浏览</h2>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(CATEGORIES).map(([k,v])=>(
              <Link key={k} href={`/desktop?cat=${k}`}
                className="text-center py-2.5 px-1 bg-[#F9F8F5] rounded-xl text-xs hover:bg-[#E8EEFB] hover:text-[#1D4ED8] transition-all no-underline text-inherit">
                <span className="text-xl block mb-0.5">{v.icon}</span>{v.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 mt-6"><h2 className="text-lg font-bold">🔥 大家都在看</h2></div>
      <div className="grid grid-cols-2 gap-4">
        {scenes.map((s:Scenario,i:number)=>(
          <SceneCard key={s.id} scene={s} delay={i*0.05} href={`/desktop/scene/${s.id}`} />
        ))}
      </div>
    </>
  );
}
