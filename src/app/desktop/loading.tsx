export default function DesktopLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-48 bg-black/5 rounded-2xl" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-32 bg-black/5 rounded-2xl" />
        <div className="h-32 bg-black/5 rounded-2xl" />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {[...Array(4)].map((_,i)=><div key={i} className="h-36 bg-black/5 rounded-2xl" />)}
      </div>
    </div>
  );
}
