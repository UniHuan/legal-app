import Link from 'next/link';
import { getValue, getValueScenes } from '@/lib/api';
import SceneCard from '@/components/shared/SceneCard';
import type { Scenario } from '@/lib/types';
export default async function MobileValue({params}:{params:Promise<{id:string}>}) {
  const {id} = await params;
  const [v, scenes] = await Promise.all([getValue(id), getValueScenes((await getValue(id)).name)]);
  if (!v) return <div className="text-center py-10">未找到</div>;
  return (
    <>
      <Link href="/mobile/values" className="text-sm text-[#1D4ED8] font-medium mb-3 inline-block">← 价值观</Link>
      <div className="flex items-center gap-3 p-4 bg-[#F0F4FA] rounded-2xl mb-4">
        <span className="text-4xl">{v.icon}</span>
        <div>
          <div className="text-lg font-bold text-[#1D4ED8]">{v.name}</div>
          <div className="text-xs text-[#6B7194]">{v.description}</div>
        </div>
      </div>
      <h3 className="text-[15px] font-bold mb-2">关联场景 ({scenes.length})</h3>
      {scenes.map((s:Scenario,i:number)=>(
        <SceneCard key={s.id} scene={s} delay={i*0.05} href={`/mobile/scene/${s.id}`} />
      ))}
    </>
  );
}
