import Link from 'next/link';
import { getValue, getValueScenes } from '@/lib/api';
import SceneCard from '@/components/shared/SceneCard';
import type { Scenario } from '@/lib/types';
export default async function DesktopValue({params}:{params:Promise<{id:string}>}) {
  const {id} = await params;
  const [v, scenes] = await Promise.all([getValue(id), getValueScenes((await getValue(id)).name)]);
  if (!v) return <div className="text-center py-10">未找到</div>;
  return (
    <>
      <Link href="/desktop/values" className="text-sm text-[#1D4ED8] font-medium mb-4 inline-block">← 价值观</Link>
      <div className="flex items-center gap-4 p-6 bg-[#F0F4FA] rounded-2xl mb-6">
        <span className="text-6xl">{v.icon}</span>
        <div>
          <h1 className="text-3xl font-bold text-[#1D4ED8]">{v.name}</h1>
          <p className="text-sm text-[#6B7194] mt-1">{v.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border shadow-sm"><h3 className="font-bold mb-2">📜 民法典依据</h3><p className="text-sm text-[#6B7194] leading-relaxed">{v.legal_basis}</p></div>
        <div className="bg-white rounded-2xl p-5 border shadow-sm"><h3 className="font-bold mb-2">🔗 关联场景</h3><p className="text-sm text-[#6B7194]">共 {scenes.length} 个场景</p></div>
      </div>
      <h2 className="text-lg font-bold mb-4">📋 场景列表</h2>
      <div className="grid grid-cols-2 gap-4">
        {scenes.map((s:Scenario,i:number)=>(
          <SceneCard key={s.id} scene={s} delay={i*0.05} href={`/desktop/scene/${s.id}`} />
        ))}
      </div>
    </>
  );
}
