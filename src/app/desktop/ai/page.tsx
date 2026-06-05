'use client';
import { useState } from 'react';
import { aiAsk } from '@/lib/api';
import Link from 'next/link';
export default function DesktopAI() {
  const [messages, setMessages] = useState<Array<{role:string;content:string}>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function send(q?:string) {
    const question = q || input.trim(); if(!question) return;
    setMessages(m=>[...m,{role:'user',content:question}]);
    setInput(''); setLoading(true);
    const answer = await aiAsk(question);
    setMessages(m=>[...m,{role:'bot',content:answer||'服务暂不可用。📞 12348'}]);
    setLoading(false);
  }

  return (
    <div className="grid grid-cols-[1fr_300px] h-[calc(100vh-120px)] gap-0">
      <div className="flex flex-col bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-black/5 font-semibold text-sm">
          💬 AI 智能问答 <span className="text-[11px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">免费</span>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {messages.length===0 && (
            <div className="text-center text-[#6B7194] py-16">
              <div className="text-6xl mb-4">💬</div>
              <div className="font-semibold text-base">法律问题，直接问我</div>
              <div className="text-xs mt-1">基于民法典全量知识库+AI智能分析</div>
            </div>
          )}
          {messages.map((m,i)=>(
            <div key={i} className={`max-w-[80%] mb-3.5 px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role==='user'?'bg-[#1D4ED8] text-white ml-auto rounded-br-sm':'bg-[#F9F8F5] mr-auto rounded-bl-sm border border-black/5'}`}>{m.content}</div>
          ))}
          {loading && <div className="max-w-[80%] mb-3.5 px-4 py-3 rounded-2xl text-sm bg-[#F9F8F5] mr-auto rounded-bl-sm border border-black/5">分析中...</div>}
        </div>
        <div className="flex gap-2.5 px-5 py-3 border-t border-black/5">
          <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}}
            placeholder="输入你的法律问题..." rows={1} className="flex-1 border border-black/5 rounded-xl px-4 py-2.5 text-sm outline-none resize-none focus:border-[#1D4ED8] transition-colors font-sans" />
          <button onClick={()=>send()} className="w-11 h-11 rounded-full bg-[#1D4ED8] text-white text-xl flex items-center justify-center shrink-0 hover:bg-[#1E3A8A] transition-colors">↑</button>
        </div>
      </div>
      <div className="pl-6 pt-6">
        <div className="bg-white rounded-2xl border border-black/5 p-4 shadow-sm">
          <h4 className="text-sm font-semibold mb-2">⚡ 试试这些问题</h4>
          <div className="space-y-0">
            {['🏠 房东卖房，租客能继续住吗？','🛒 买到假货，怎么索赔？','💰 没打借条，怎么要回欠款？'].map((q,i)=>(
              <div key={i} className="py-2 border-b border-black/5 text-sm text-[#6B7194] cursor-pointer hover:text-[#1D4ED8] transition-colors last:border-b-0" onClick={()=>send(q.replace(/^[^\s]+\s/,''))}>{q}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
