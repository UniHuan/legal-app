export default function MobileLoading() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-10 bg-black/5 rounded-3xl" />
      <div className="h-20 bg-black/5 rounded-2xl" />
      <div className="h-8 bg-black/5 rounded-xl w-1/3 mt-5" />
      <div className="grid grid-cols-4 gap-2">
        {[...Array(8)].map((_,i)=><div key={i} className="h-20 bg-black/5 rounded-2xl" />)}
      </div>
      <div className="h-8 bg-black/5 rounded-xl w-1/3 mt-5" />
      {[...Array(3)].map((_,i)=><div key={i} className="h-24 bg-black/5 rounded-2xl" />)}
    </div>
  );
}
