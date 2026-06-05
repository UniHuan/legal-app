'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
const navItems = [
  {section:'主导航',items:[
    {href:'/desktop',label:'首页',icon:'🏠'},
    {href:'/desktop/values',label:'价值观地图',icon:'🌍'},
    {href:'/desktop/code',label:'法典全文',icon:'📖'},
    {href:'/desktop/ai',label:'AI 智能问答',icon:'💬',badge:'免费'},
  ]},
  {section:'学习',items:[
    {href:'/desktop/quiz',label:'每日一题',icon:'📝'},
  ]},
];
export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-black/5 flex flex-col z-50 shadow-sm">
      <Link href="/desktop" className="flex items-center gap-2.5 px-5 py-5 border-b border-black/5 no-underline">
        <span className="text-2xl">⚖️</span>
        <div>
          <div className="text-[17px] font-bold text-[#1A1F36]">法治同行</div>
          <div className="text-[11px] text-[#6B7194]">民法典科普平台</div>
        </div>
      </Link>
      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map(g=>(
          <div key={g.section}>
            <div className="px-5 pt-4 pb-1.5 text-[10px] font-semibold text-[#6B7194] uppercase tracking-widest">{g.section}</div>
            {g.items.map(item=>{
              const active = path===item.href || (item.href!=='/desktop' && path.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-2.5 px-5 py-2.5 text-sm no-underline transition-all border-l-[3px] ${
                    active?'bg-[#E8EEFB] text-[#1D4ED8] font-semibold border-l-[#1D4ED8]':'text-[#6B7194] border-l-transparent hover:bg-[#F9F8F5] hover:text-[#1A1F36]'
                  }`}>
                  <span className="text-lg w-6 text-center">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && <span className="ml-auto bg-[#1D4ED8] text-white rounded-full px-2 py-0.5 text-[10px] font-semibold">{item.badge}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="px-5 py-3.5 border-t border-black/5 text-xs text-[#6B7194]">
        <span>📞 法律援助热线</span>
        <a href="tel:12348" className="block text-red-600 font-bold text-base no-underline mt-0.5">12348</a>
      </div>
    </aside>
  );
}
