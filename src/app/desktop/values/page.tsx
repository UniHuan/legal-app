import Link from 'next/link';
import { getValues } from '@/lib/api';
import type { Value } from '@/lib/types';
export default async function DesktopValues() {
  const values = await getValues();
  const groups:Record<string,any[]> = {national:[],social:[],personal:[]};
  values.forEach((v:Value)=>groups[v.tier].push(v));
  const labels:Record<string,string> = {national:'🇨🇳 国家层面',social:'🤝 社会层面',personal:'❤️ 个人层面'};
  const borders:Record<string,string> = {national:'border-t-red-500',social:'border-t-blue-500',personal:'border-t-green-500'};
  return (
    <>
      <h1 className="text-2xl font-bold mb-1">🌍 价值观地图</h1>
      <p className="text-sm text-[#6B7194] mb-6">12个核心价值观，每一个都在民法典中有制度支撑</p>
      {Object.entries(groups).map(([tier,vals])=>(
        <div key={tier} className="mb-8">
          <h3 className="text-xs font-semibold text-[#6B7194] uppercase tracking-widest mb-4 pb-2 border-b-2 border-black/5">{labels[tier]}</h3>
          <div className="grid grid-cols-4 gap-2.5">
            {vals.map((v:Value)=>(
              <Link key={v.id} href={`/desktop/values/${v.id}`}
                className={`text-center py-5 px-3 bg-white border border-black/5 rounded-2xl ${borders[tier]} border-t-[3px] no-underline text-inherit hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer`}>
                <span className="text-3xl block mb-2">{v.icon}</span>
                <div className="text-[15px] font-bold">{v.name}</div>
                <div className="text-[11px] text-[#6B7194]">{v.scenario_count}个场景</div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
