import Link from 'next/link';
import { getValues } from '@/lib/api';
export default async function MobileValues() {
  const values = await getValues();
  const groups:Record<string,any[]> = {national:[],social:[],personal:[]};
  values.forEach((v:any)=>groups[v.tier].push(v));
  const labels:Record<string,string> = {national:'🇨🇳 国家层面',social:'🤝 社会层面',personal:'❤️ 个人层面'};
  const borderColors:Record<string,string> = {national:'border-red-500',social:'border-blue-500',personal:'border-green-500'};
  return (
    <>
      <h2 className="text-[17px] font-bold mb-1">🌍 价值观地图</h2>
      <p className="text-xs text-[#6B7194] mb-4">12个核心价值观，每一个都在民法典中有制度支撑</p>
      {Object.entries(groups).map(([tier,vals])=>(
        <div key={tier} className="mb-5">
          <div className="text-[11px] text-[#94A3B8] mb-2">{labels[tier]}</div>
          <div className="grid grid-cols-3 gap-2">
            {vals.map((v:any)=>(
              <Link key={v.id} href={`/mobile/values/${v.id}`}
                className={`text-center py-4 px-2 bg-white rounded-2xl shadow-sm border-t-[3px] ${borderColors[tier]} no-underline text-inherit transition-all active:scale-95`}>
                <span className="text-2xl block mb-1">{v.icon}</span>
                <div className="text-[13px] font-bold">{v.name}</div>
                <div className="text-[10px] text-[#6B7194]">{v.scenario_count}个场景</div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
