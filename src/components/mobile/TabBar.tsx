'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
const tabs = [
  {href:'/mobile',label:'场景学法',icon:'🏠'},
  {href:'/mobile/values',label:'价值观',icon:'🌍'},
  {href:'/mobile/code',label:'法典全文',icon:'📖'},
  {href:'/mobile/ai',label:'AI问答',icon:'💬'},
  {href:'/mobile/quiz',label:'题库',icon:'📝'},
];
export default function TabBar() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-13 bg-white/90 backdrop-blur-xl border-t border-black/5 flex justify-around items-center pb-[env(safe-area-inset-bottom)]">
      {tabs.map(t=>{
        const active = path===t.href || (t.href!=='/mobile' && path.startsWith(t.href));
        return (
          <Link key={t.href} href={t.href}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1.5 flex-1 no-underline transition-colors ${active?'text-[#1D4ED8] font-semibold':'text-[#6B7194]'}`}>
            <span className="text-xl leading-none">{t.icon}</span>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
