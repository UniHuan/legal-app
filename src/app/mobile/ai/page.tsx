'use client';
import { useState } from 'react';
import { aiAsk } from '@/lib/api';
export default function MobileAI() {
  const [messages, setMessages] = useState<Array<{role:string;content:string}>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const presets = ['房东卖房我能不搬吗','收到假货退一赔三怎么操作','没打借条能要回钱吗'];

  async function send(q?:string) {
    const question = q || input.trim(); if(!question) return;
    setMessages(m=>[...m,{role:'user',content:question}]);
    setInput(''); setLoading(true);
    const answer = await aiAsk(question);
    setMessages(m=>[...m,{role:'bot',content:answer||'服务暂不可用。📞 12348'}]);
    setLoading(false);
  }

  return (
    <div className="fixed top-11 left-0 right-0 bottom-13 flex flex-col bg-[#F9F8F5] z-40">
      <div className="flex gap-1.5 flex-wrap px-4 py-2">
        {presets.map(p=>(
          <button key={p} onClick={()=>send(p)} className="bg-white border border-black/5 rounded-full px-3 py-1.5 text-xs text-[#1D4ED8] active:bg-[#1D4ED8] active:text-white transition-colors">{p.length>8?p.slice(0,8)+'...':p}</button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.length===0 && (
          <div className="text-center text-[#6B7194] py-12">
            <div className="text-5xl mb-3">💬</div>
            <div className="font-semibold">法律问题，直接问我</div>
            <div className="text-xs mt-1">基于民法典全量知识库+AI智能分析</div>
          </div>
        )}
        {messages.map((m,i)=>(
          <div key={i} className={`max-w-[85%] mb-2.5 px-3 py-2.5 rounded-2xl text-sm leading-relaxed animate-[bubbleIn_.3s_cubic-bezier(.2,0,0,1)] ${m.role==='user'?'bg-[#1D4ED8] text-white ml-auto rounded-br-sm':'bg-white mr-auto rounded-bl-sm shadow-sm border border-black/5'}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="max-w-[85%] mb-2.5 px-3 py-2.5 rounded-2xl text-sm bg-white mr-auto rounded-bl-sm shadow-sm">分析中...</div>}
      </div>
      <div className="flex gap-2 px-4 py-2.5 bg-white border-t border-black/5">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
          placeholder="输入你的法律问题..." className="flex-1 border border-black/5 rounded-full px-4 py-2.5 text-[15px] outline-none bg-[#F9F8F5] focus:border-[#1D4ED8] transition-colors"/>
        <button onClick={()=>send()} className="w-10 h-10 rounded-full bg-[#1D4ED8] text-white text-lg flex items-center justify-center shrink-0 active:scale-90 transition-transform">↑</button>
      </div>
    </div>
  );
}
