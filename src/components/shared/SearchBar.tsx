'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
export default function SearchBar() {
  const [q, setQ] = useState('');
  const router = useRouter();
  const search = () => {
    if (q.trim().length < 2) return;
    router.push(`/mobile?q=${encodeURIComponent(q.trim())}`);
  };
  return (
    <form onSubmit={e=>{e.preventDefault();search()}} className="flex items-center gap-2 bg-white border border-black/5 rounded-3xl px-4 py-2.5 mb-5 shadow-sm focus-within:border-[#1D4ED8] transition-colors">
      <span>🔍</span>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="比如：房东要卖房我能不搬吗？"
        className="flex-1 border-none outline-none text-[15px] bg-transparent" />
    </form>
  );
}
