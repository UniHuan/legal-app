import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <script dangerouslySetInnerHTML={{__html:`
        var w=window.innerWidth;
        location.href = w < 900 ? '/mobile' : '/desktop';
      `}}/>
      <a href="/mobile" className="text-blue-600 underline">进入移动版</a>
      <span className="mx-4">|</span>
      <a href="/desktop" className="text-blue-600 underline">进入桌面版</a>
    </div>
  );
}
