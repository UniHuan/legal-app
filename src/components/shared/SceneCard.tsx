import Link from 'next/link';
import { VALUE_TIERS } from '@/lib/constants';

const tierColors:Record<string,string> = {
  national:'bg-red-50 text-red-700',social:'bg-blue-50 text-blue-700',personal:'bg-green-50 text-green-700'
};
const conclusionStyles:Record<string,string> = {
  good:'bg-green-50 text-green-700',warn:'bg-orange-50 text-orange-700',bad:'bg-red-50 text-red-700'
};

export default function SceneCard({scene,delay=0,href}:{scene:any;delay?:number;href:string}) {
  return (
    <Link href={href} className="block bg-white rounded-2xl p-4 mb-2.5 shadow-sm border border-black/5 no-underline text-inherit transition-all active:scale-[0.98] hover:shadow-md"
      style={{animation:`cardIn .4s cubic-bezier(.2,0,0,1) both`,animationDelay:`${delay}s`}}>
      <div className="text-[15px] font-semibold mb-1.5 leading-snug">{scene.title}</div>
      <div className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold mb-1 ${conclusionStyles[scene.conclusion_type]||''}`}>
        {scene.conclusion}
      </div>
      <div className="flex gap-1 flex-wrap mt-1">
        {(scene.value_tags||[]).map((v:string)=>(
          <span key={v} className={`px-2 py-0.5 rounded text-[10px] font-medium ${tierColors[VALUE_TIERS[v]]||'bg-gray-100 text-gray-600'}`}>{v}</span>
        ))}
      </div>
      <style>{`@keyframes cardIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </Link>
  );
}
